import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "subscribers.json");

interface Subscriber {
    id: string;
    email: string;
    confirmed: boolean;
    token: string;
    created_at: string;
}

export async function GET(req: NextRequest) {
    const token = req.nextUrl.searchParams.get("token");
    if (!token) {
        return NextResponse.json({ error: "No token provided." }, { status: 400 });
    }

    try {
        const raw = await fs.readFile(DB_PATH, "utf-8");
        const subs: Subscriber[] = JSON.parse(raw);
        const filtered = subs.filter((s) => s.token !== token);

        if (filtered.length === subs.length) {
            return NextResponse.json(
                { error: "This unsubscribe link is invalid or has already been used." },
                { status: 404 }
            );
        }

        await fs.writeFile(DB_PATH, JSON.stringify(filtered, null, 2));
        return NextResponse.json({ message: "You've been unsubscribed." });
    } catch {
        return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
    }
}
