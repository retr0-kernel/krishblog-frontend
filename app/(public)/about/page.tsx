import type { Metadata } from "next";
import { SubscribeForm } from "@/components/shared/subscribe-form";
import { Github, Mail } from "lucide-react";

export const metadata: Metadata = {
    title: "About",
    description: "About Krish — software engineer, writer, builder.",
};

export default function AboutPage() {
    return (
        <div className="pt-24">
            <div className="max-w-5xl mx-auto px-6 py-20">

                {/* Two column — responsive grid */}
                <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8 lg:gap-16 items-start">

                    {/* Left — photo fixed width on large screens */}
                    <div className="flex flex-col gap-6 mx-auto lg:mx-0">
                        <div className="relative w-[280px] h-[280px] lg:w-[340px] lg:h-[340px]">
                            <div className="w-full h-full rounded-2xl bg-[hsl(var(--secondary))] border border-[hsl(var(--border))] overflow-hidden flex items-center justify-center">
                                {/* Replace with: <Image src="/your-photo.jpg" alt="Krish" fill className="object-cover" /> */}
                                <div className="flex flex-col items-center gap-3 text-[hsl(var(--muted-foreground))]">
                                    <div className="w-24 h-24 rounded-full bg-[hsl(var(--border))] flex items-center justify-center">
                                        <span className="text-4xl font-bold" style={{ fontFamily: '"Playfair Display", serif' }}>K</span>
                                    </div>
                                    <span className="text-xs font-sans">your photo here</span>
                                </div>
                            </div>
                            <div className="absolute -bottom-3 -right-3 w-full h-full rounded-2xl border-2 border-[hsl(var(--accent)/0.25)] -z-10" />
                        </div>

                        {/* Social icons */}
                        <div className="flex items-center gap-2 justify-center lg:justify-start">
                            <a href="mailto:hello@krishblog.com"
                               className="h-9 w-9 flex items-center justify-center rounded-lg border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--accent))] hover:border-[hsl(var(--accent))] transition-colors"
                               aria-label="Email">
                                <Mail className="h-4 w-4" />
                            </a>
                            <a href="https://github.com/krish" target="_blank" rel="noopener noreferrer"
                               className="h-9 w-9 flex items-center justify-center rounded-lg border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--accent))] hover:border-[hsl(var(--accent))] transition-colors"
                               aria-label="GitHub">
                                <Github className="h-4 w-4" />
                            </a>
                            <a href="https://twitter.com/krish" target="_blank" rel="noopener noreferrer"
                               className="h-9 w-9 flex items-center justify-center rounded-lg border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--accent))] hover:border-[hsl(var(--accent))] transition-colors"
                               aria-label="X / Twitter">
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Right — bio */}
                    <div>
                        <p className="text-xs font-sans font-semibold uppercase tracking-widest text-[hsl(var(--accent))] mb-4">
                            About
                        </p>
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6"
                            style={{ fontFamily: '"Playfair Display", serif' }}>
                            Hi, I&apos;m Krish.
                        </h1>
                        <p className="text-lg text-[hsl(var(--muted-foreground))] font-sans leading-relaxed mb-8">
                            A software engineer who writes about code, ideas, and whatever else captures my attention.
                        </p>
                        <div className="space-y-5 font-sans text-base leading-relaxed">
                            <p>
                                I started this blog as a place to think out loud — a way to crystallise thoughts
                                that would otherwise dissolve in the daily noise. Writing forces clarity. It demands
                                that I actually understand something before I claim to.
                            </p>
                            <p>
                                Professionally, I build software. I care deeply about systems design, developer
                                experience, and the craft of writing code that other people can read and extend
                                without cursing your name. I&apos;m currently working in the Go and TypeScript ecosystem.
                            </p>
                            <p>
                                Outside of work you&apos;ll find me reading — mostly non-fiction, history, and the
                                occasional novel — or going on long walks with no particular destination in mind.
                            </p>
                            <p>
                                This blog has no ads, no trackers beyond basic analytics, and no algorithm deciding
                                what you see. Just writing, in order.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-4 my-20">
                    <div className="flex-1 h-px bg-[hsl(var(--border))]" />
                    <span className="text-[hsl(var(--accent))] text-lg">✦</span>
                    <div className="flex-1 h-px bg-[hsl(var(--border))]" />
                </div>

                {/* Subscribe card */}
                <div className="relative overflow-hidden rounded-2xl bg-[hsl(var(--card))] border border-[hsl(var(--border))]">
                    <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[hsl(var(--accent)/0.06)] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-[hsl(var(--accent)/0.04)] translate-y-1/2 -translate-x-1/2 pointer-events-none" />
                    <div className="relative px-6 lg:px-10 py-12">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                            <div>
                                <p className="text-xs font-sans font-semibold uppercase tracking-widest text-[hsl(var(--accent))] mb-3">
                                    Newsletter
                                </p>
                                <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: '"Playfair Display", serif' }}>
                                    Stay in the loop
                                </h2>
                                <p className="font-sans text-[hsl(var(--muted-foreground))] leading-relaxed">
                                    New posts delivered to your inbox. No noise, no spam — just writing worth reading.
                                </p>
                            </div>
                            <div>
                                <SubscribeForm />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
