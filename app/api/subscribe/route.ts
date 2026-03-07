import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const DB_PATH = path.join(process.cwd(), "data", "subscribers.json");

interface Subscriber {
    id: string;
    email: string;
    confirmed: boolean;
    token: string;
    created_at: string;
}

async function readSubscribers(): Promise<Subscriber[]> {
    try {
        const raw = await fs.readFile(DB_PATH, "utf-8");
        return JSON.parse(raw);
    } catch {
        return [];
    }
}

async function writeSubscribers(subs: Subscriber[]): Promise<void> {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify(subs, null, 2));
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const email = (body.email ?? "").trim().toLowerCase();

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json(
                { error: "Invalid email address." },
                { status: 400 }
            );
        }

        const subs = await readSubscribers();
        const existing = subs.find((s) => s.email === email);

        if (existing) {
            if (existing.confirmed) {
                return NextResponse.json({ message: "You're already subscribed!" });
            }
            await sendConfirmationEmail(email, existing.token);
            return NextResponse.json({
                message: "Confirmation email resent. Check your inbox.",
            });
        }

        const token = crypto.randomBytes(32).toString("hex");
        const newSub: Subscriber = {
            id: crypto.randomUUID(),
            email,
            confirmed: false,
            token,
            created_at: new Date().toISOString(),
        };

        subs.push(newSub);
        await writeSubscribers(subs);
        await sendConfirmationEmail(email, token);

        return NextResponse.json({
            message: "Check your inbox to confirm your subscription.",
        });
    } catch (err) {
        console.error("[subscribe] error:", err);
        return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
    }
}

// GET /api/subscribe?token=xxx — confirm subscription
export async function GET(req: NextRequest) {
    const token = req.nextUrl.searchParams.get("token");
    if (!token) {
        return NextResponse.json({ error: "No token provided." }, { status: 400 });
    }

    const subs = await readSubscribers();
    const sub = subs.find((s) => s.token === token);

    if (!sub) {
        return NextResponse.json(
            { error: "This confirmation link is invalid or has already been used." },
            { status: 404 }
        );
    }

    if (sub.confirmed) {
        return NextResponse.json({ message: "Already confirmed!" });
    }

    sub.confirmed = true;
    await writeSubscribers(subs);
    return NextResponse.json({ message: "Subscription confirmed!" });
}

async function sendConfirmationEmail(email: string, token: string) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "Krish Blog";
    const confirmUrl = `${siteUrl}/confirm-subscription?token=${token}`;

    await sendEmail({
        to: email,
        subject: `Confirm your subscription to ${siteName}`,
        html: `
      <div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; padding: 40px 20px; color: #1a1a1a;">
        <h2 style="font-size: 24px; margin-bottom: 16px;">Confirm your subscription</h2>
        <p style="font-size: 16px; line-height: 1.7; color: #555; margin-bottom: 24px;">
          You asked to be notified when new posts are published on ${siteName}.
          Click the button below to confirm.
        </p>
        <a href="${confirmUrl}"
          style="display: inline-block; background: #e84c30; color: white; padding: 12px 28px; border-radius: 4px; text-decoration: none; font-family: sans-serif; font-weight: 600; font-size: 14px;">
          Confirm subscription
        </a>
        <p style="font-size: 13px; color: #999; margin-top: 32px; font-family: sans-serif;">
          If you didn't sign up, ignore this email.
        </p>
      </div>
    `,
    });
}

export async function sendNewPostEmail(opts: {
    subject: string;
    title: string;
    summary: string;
    url: string;
}) {
    const subs = await readSubscribers();
    const confirmed = subs.filter((s) => s.confirmed);
    const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "Krish Blog";

    const results = await Promise.allSettled(
        confirmed.map((sub) => {
            const unsubUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/unsubscribe?token=${sub.token}`;
            return sendEmail({
                to: sub.email,
                subject: opts.subject,
                html: `
          <div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; padding: 40px 20px; color: #1a1a1a;">
            <p style="font-size: 12px; font-family: sans-serif; color: #999; margin-bottom: 32px; text-transform: uppercase; letter-spacing: 0.1em;">
              New post on ${siteName}
            </p>
            <h2 style="font-size: 28px; margin-bottom: 12px; line-height: 1.3;">${opts.title}</h2>
            <p style="font-size: 16px; line-height: 1.7; color: #555; margin-bottom: 28px;">${opts.summary}</p>
            <a href="${opts.url}"
              style="display: inline-block; background: #e84c30; color: white; padding: 12px 28px; border-radius: 4px; text-decoration: none; font-family: sans-serif; font-weight: 600; font-size: 14px;">
              Read the post →
            </a>
            <hr style="border: none; border-top: 1px solid #eee; margin: 40px 0;" />
            <p style="font-size: 12px; color: #bbb; font-family: sans-serif;">
              You're receiving this because you subscribed to ${siteName}.
              <a href="${unsubUrl}" style="color: #bbb;">Unsubscribe</a>
            </p>
          </div>
        `,
            });
        })
    );

    const sent = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;
    console.log(`[notify] sent=${sent} failed=${failed} total=${confirmed.length}`);
    return { sent, failed, total: confirmed.length };
}

async function sendEmail(opts: { to: string; subject: string; html: string }) {
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.EMAIL_FROM ?? "Krish Blog <noreply@krishblog.com>";

    if (!apiKey) {
        console.log(`[email] To: ${opts.to} | Subject: ${opts.subject}`);
        console.log(`[email] (Set RESEND_API_KEY to send real emails)`);
        return;
    }

    const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            from: fromEmail,
            to: opts.to,
            subject: opts.subject,
            html: opts.html,
        }),
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Resend error: ${err}`);
    }
}
