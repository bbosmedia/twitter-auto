import {
  ArrowRight,
  AtSign,
  BadgeCheck,
  CalendarClock,
  Check,
  Clock,
  FileText,
  Heart,
  Layers3,
  LayoutTemplate,
  MessageCircle,
  Repeat2,
  ShieldCheck,
  Sparkles,
  BarChart3,
  Zap,
  Workflow,
  Lock,
  RefreshCw,
  Users,
} from "lucide-react";
import { Card, Chip } from "@heroui/react";
import { LinkButton } from "@/components/shared/link-button";
import { FaqAccordion } from "@/components/landing/faq-accordion";
import { Reveal } from "@/components/landing/reveal";
import { SmoothAnchor } from "@/components/landing/smooth-anchor";
import { cn } from "@/utils/cn";

const nav = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#security", label: "Security" },
  { href: "#faq", label: "FAQ" },
];

const stats = [
  { value: "∞", label: "Accounts per workspace" },
  { value: "60s", label: "Scheduler precision" },
  { value: "3×", label: "Publish retries" },
  { value: "0", label: "Subscription tiers" },
];

const features = [
  {
    icon: Layers3,
    title: "Multi-account publishing",
    description:
      "Connect every X profile you manage. Publish or schedule to many accounts in one action.",
    tone: "from-sky-500/15 to-blue-500/5 text-sky-600",
  },
  {
    icon: CalendarClock,
    title: "Reliable scheduling",
    description:
      "Background workers pick up due posts every minute with exponential backoff retries.",
    tone: "from-violet-500/15 to-purple-500/5 text-violet-600",
  },
  {
    icon: ShieldCheck,
    title: "Encrypted OAuth tokens",
    description:
      "Access and refresh tokens encrypted at rest with AES-256-GCM. Never exposed to the browser.",
    tone: "from-emerald-500/15 to-teal-500/5 text-emerald-600",
  },
  {
    icon: Zap,
    title: "Post now or draft",
    description:
      "Instant queue publish, save drafts, or schedule for later — same polished compose flow.",
    tone: "from-amber-500/15 to-orange-500/5 text-amber-600",
  },
  {
    icon: LayoutTemplate,
    title: "Reusable templates",
    description:
      "Save winning copy and drop it into Compose in one click for consistent campaigns.",
    tone: "from-pink-500/15 to-rose-500/5 text-pink-600",
  },
  {
    icon: FileText,
    title: "Queue & failure recovery",
    description:
      "Track scheduled, publishing, and failed posts. Retry failed publishes without rewriting.",
    tone: "from-indigo-500/15 to-blue-500/5 text-indigo-600",
  },
];

const steps = [
  {
    step: "01",
    title: "Sign in securely",
    description:
      "Continue with Google or X. No passwords to manage — Better Auth sessions with HTTP-only cookies.",
    icon: Users,
  },
  {
    step: "02",
    title: "Connect X accounts",
    description:
      "OAuth 2.0 PKCE flow with tweet write scopes. Tokens stay encrypted; you keep full control.",
    icon: AtSign,
  },
  {
    step: "03",
    title: "Compose & schedule",
    description:
      "Write once, preview like the real timeline, then post now or schedule across accounts.",
    icon: Workflow,
  },
];

const securityPoints = [
  "AES-256-GCM token encryption at rest",
  "OAuth 2.0 PKCE for account connect",
  "Server-side session validation on APIs",
  "Security headers (HSTS, frame deny, nosniff)",
  "Audit log for connect / publish actions",
  "No secrets in client bundles",
];

const faqs = [
  {
    q: "Is there a subscription?",
    a: "No. Pulse is a full-stack product with every feature unlocked. You only need an X API tier if you want to publish live tweets.",
  },
  {
    q: "How do I sign in?",
    a: "Google or X (Twitter) OAuth only — no email/password. After sign-in you connect the X accounts you want to publish from.",
  },
  {
    q: "Can I manage multiple X accounts?",
    a: "Yes. Connect as many profiles as you need and select any combination when composing a post.",
  },
  {
    q: "What about scheduled reliability?",
    a: "A BullMQ worker scans due posts every minute and retries failed publishes with exponential backoff.",
  },
];

const comparison = [
  { feature: "Multi-account compose", pulse: true, manual: false, saas: true },
  {
    feature: "Native X-style preview",
    pulse: true,
    manual: false,
    saas: "partial" as const,
  },
  { feature: "Self-host / own data", pulse: true, manual: true, saas: false },
  { feature: "No monthly fee", pulse: true, manual: true, saas: false },
  { feature: "Encrypted token vault", pulse: true, manual: false, saas: true },
  { feature: "Queue retries", pulse: true, manual: false, saas: true },
];

function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left"
      )}
    >
      {eyebrow && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-sky-600">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-base leading-relaxed text-slate-500 md:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}

function ProductMock() {
  return (
    <div className="relative mx-auto w-full max-w-5xl">
      <div className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-sky-400/20 via-violet-400/10 to-transparent blur-2xl" />

      <div className="relative overflow-hidden rounded-[1.35rem] border border-slate-200/80 bg-white shadow-[0_24px_80px_-20px_rgba(15,23,42,0.18)] transition-shadow duration-500 hover:shadow-[0_32px_90px_-24px_rgba(37,99,235,0.28)]">
        <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/90 px-4 py-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </div>
          <div className="ml-3 flex flex-1 items-center justify-center">
            <div className="rounded-lg border border-slate-200 bg-white px-4 py-1 text-[11px] text-slate-400">
              app.pulse · Compose
            </div>
          </div>
          <Chip size="sm" color="accent" variant="soft">
            Live preview
          </Chip>
        </div>

        <div className="grid md:grid-cols-2">
          <div className="border-b border-slate-100 p-5 md:border-b-0 md:border-r">
            <div className="mb-4 flex items-center gap-2 text-xs font-semibold text-slate-500">
              <Sparkles size={14} className="text-sky-500" />
              Compose
            </div>
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-600 text-sm font-bold text-white">
                P
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[17px] leading-6 text-slate-800">
                  Shipping the next release today. Multi-account scheduling with
                  encrypted OAuth & reliable workers.{" "}
                  <span className="text-sky-500">#buildinpublic</span>
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {["@pulse", "@launch", "@studio"].map((h) => (
                    <span
                      key={h}
                      className="rounded-full bg-sky-50 px-2.5 py-0.5 text-[11px] font-medium text-sky-700"
                    >
                      {h}
                    </span>
                  ))}
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3">
                  <div className="flex gap-2 text-sky-500">
                    <CalendarClock size={16} />
                    <Clock size={16} />
                  </div>
                  <span className="rounded-full bg-sky-500 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition-transform duration-300 hover:scale-[1.03]">
                    Schedule
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50/50 p-5">
            <div className="mb-4 flex items-center gap-2 text-xs font-semibold text-slate-500">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Timeline preview
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-600 text-sm font-bold text-white">
                  P
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1 text-[14px]">
                    <span className="font-bold text-slate-900">Pulse Studio</span>
                    <BadgeCheck size={15} className="fill-sky-500 text-white" />
                    <span className="text-slate-500">@pulse · Jul 14</span>
                  </div>
                  <p className="mt-1 text-[14px] leading-5 text-slate-800">
                    Shipping the next release today. Multi-account scheduling
                    with encrypted OAuth & reliable workers.{" "}
                    <span className="text-sky-500">#buildinpublic</span>
                  </p>
                  <div className="mt-3 flex max-w-xs justify-between text-slate-400">
                    <MessageCircle size={15} />
                    <Repeat2 size={15} />
                    <Heart size={15} />
                    <BarChart3 size={15} />
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-3 text-center text-[11px] text-slate-400">
              Preview updates as you type — just like the real post.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#f7f8fb] text-slate-900">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.16),transparent_70%)]" />
        <div className="landing-float absolute -right-32 top-40 h-72 w-72 rounded-full bg-violet-400/10 blur-3xl" />
        <div
          className="landing-float absolute -left-24 bottom-40 h-64 w-64 rounded-full bg-sky-400/10 blur-3xl"
          style={{ animationDelay: "-4s" }}
        />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/75 backdrop-blur-xl transition-[box-shadow,background-color] duration-300">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-6">
          <a href="#" className="group flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/25 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105">
              <AtSign size={18} />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold tracking-tight">Pulse</p>
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                X Scheduler
              </p>
            </div>
          </a>

          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((item) => (
              <SmoothAnchor
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-900"
              >
                {item.label}
              </SmoothAnchor>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <LinkButton
              href="/login"
              variant="ghost"
              size="sm"
              className="hidden sm:inline-flex"
            >
              Sign in
            </LinkButton>
            <LinkButton href="/login" size="sm" className="btn-glow">
              Get started
              <ArrowRight size={14} />
            </LinkButton>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative mx-auto max-w-6xl px-5 pb-16 pt-14 md:px-6 md:pb-24 md:pt-20">
          <div className="mx-auto max-w-3xl text-center">
            <div className="hero-enter mb-6 inline-flex items-center gap-2 rounded-full border border-sky-200/80 bg-white/90 px-3 py-1.5 shadow-sm">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-500 text-white">
                <Sparkles size={11} />
              </span>
              <span className="text-xs font-medium text-slate-600">
                Premium multi-account scheduler · Google & X sign-in · No paywall
              </span>
            </div>

            <h1 className="hero-enter hero-delay-1 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl md:leading-[1.05]">
              Publish on X with{" "}
              <span className="gradient-text">studio-grade control</span>
            </h1>

            <p className="hero-enter hero-delay-2 mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-500 md:text-lg">
              Pulse is a full-stack post scheduler for creators and teams —
              multi-account compose, realistic timeline previews, encrypted
              tokens, and a queue that never forgets.
            </p>

            <div className="hero-enter hero-delay-3 mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <LinkButton
                href="/login"
                size="lg"
                className="btn-glow min-w-[180px]"
              >
                Start free
                <ArrowRight size={16} />
              </LinkButton>
              <LinkButton
                href="/login"
                size="lg"
                variant="secondary"
                className="min-w-[180px]"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Continue with X
              </LinkButton>
            </div>

            <p className="hero-enter hero-delay-4 mt-4 text-xs text-slate-400">
              Also available with Google · No credit card · Full feature access
            </p>
          </div>

          <div className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 80} variant="up">
                <div className="rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-4 text-center shadow-sm backdrop-blur transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-sky-200 hover:shadow-md">
                  <p className="text-2xl font-bold tracking-tight text-slate-900">
                    {s.value}
                  </p>
                  <p className="mt-1 text-[11px] font-medium leading-snug text-slate-500">
                    {s.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-16" delay={120} variant="scale">
            <ProductMock />
          </Reveal>
        </section>

        {/* Audience strip */}
        <section className="border-y border-slate-200/80 bg-white/60 py-8">
          <Reveal variant="fade">
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-5 text-xs font-semibold uppercase tracking-wider text-slate-400 md:px-6">
              <span>Built for creators</span>
              <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />
              <span>Agencies</span>
              <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />
              <span>Founders</span>
              <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />
              <span>Growth teams</span>
              <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />
              <span>Self-hosted ready</span>
            </div>
          </Reveal>
        </section>

        {/* Features */}
        <section
          id="features"
          className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20 md:px-6 md:py-28"
        >
          <Reveal>
            <SectionHeading
              eyebrow="Capabilities"
              title="Everything a premium scheduler needs"
              description="A complete product surface — not a freemium teaser. Compose, schedule, recover failures, and keep tokens locked down."
            />
          </Reveal>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 70} variant="up">
                <Card className="card-premium group h-full border-0 transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:shadow-[0_24px_50px_-24px_rgba(37,99,235,0.4)]">
                  <Card.Content className="p-6">
                    <div
                      className={cn(
                        "mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110",
                        f.tone
                      )}
                    >
                      <f.icon size={20} />
                    </div>
                    <h3 className="text-base font-semibold tracking-tight text-slate-900">
                      {f.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">
                      {f.description}
                    </p>
                  </Card.Content>
                </Card>
              </Reveal>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="scroll-mt-24 border-y border-slate-200/80 bg-white py-20 md:py-28"
        >
          <div className="mx-auto max-w-6xl px-5 md:px-6">
            <Reveal>
              <SectionHeading
                eyebrow="Workflow"
                title="From zero to scheduled in three steps"
                description="A clean path from authentication to multi-account publish — designed for daily use."
              />
            </Reveal>

            <div className="relative mt-14 grid gap-6 md:grid-cols-3">
              <div className="pointer-events-none absolute left-[16%] right-[16%] top-10 hidden h-px bg-gradient-to-r from-transparent via-sky-200 to-transparent md:block" />
              {steps.map((s, i) => (
                <Reveal key={s.step} delay={i * 100} variant="up">
                  <div className="relative h-full rounded-2xl border border-slate-200 bg-slate-50/50 p-6 transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-sky-200 hover:bg-white hover:shadow-lg">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-xs font-bold tracking-widest text-sky-600">
                        {s.step}
                      </span>
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sky-600 shadow-sm ring-1 ring-slate-200 transition-transform duration-300 group-hover:scale-105">
                        <s.icon size={18} />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">
                      {s.description}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Deep product */}
        <section className="mx-auto max-w-6xl px-5 py-20 md:px-6 md:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal variant="left">
              <div>
                <SectionHeading
                  align="left"
                  eyebrow="Compose experience"
                  title="See the post before the world does"
                  description="A realistic X timeline preview sits next to compose — hashtags, mentions, and links highlighted exactly like the live feed."
                />
                <ul className="mt-8 space-y-3">
                  {[
                    "Live character meter with X-style ring",
                    "Multi-account switcher on the preview",
                    "Schedule chip with local timezone",
                    "Drafts, templates, and queue recovery",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-sm text-slate-600"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                        <Check size={12} strokeWidth={3} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <LinkButton href="/login" className="btn-glow">
                    Open compose
                    <ArrowRight size={15} />
                  </LinkButton>
                </div>
              </div>
            </Reveal>

            <Reveal variant="right" delay={100}>
              <div className="relative">
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-sky-400/15 to-violet-400/10 blur-xl" />
                <div className="relative space-y-3">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-lg transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                      <RefreshCw size={13} className="text-sky-500" />
                      Queue · 2 scheduled · 1 publishing
                    </div>
                    <div className="mt-3 space-y-2">
                      {[
                        {
                          t: "Launch thread — part 1",
                          s: "Scheduled",
                          c: "bg-amber-50 text-amber-700",
                        },
                        {
                          t: "Hiring: design engineer",
                          s: "Publishing",
                          c: "bg-sky-50 text-sky-700",
                        },
                      ].map((row) => (
                        <div
                          key={row.t}
                          className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2.5 transition-colors duration-200 hover:bg-white"
                        >
                          <span className="truncate text-sm font-medium text-slate-800">
                            {row.t}
                          </span>
                          <span
                            className={cn(
                              "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase",
                              row.c
                            )}
                          >
                            {row.s}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-md transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white">
                        <Lock size={14} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          Tokens encrypted
                        </p>
                        <p className="text-xs text-slate-500">
                          AES-256-GCM · refresh rotation
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Security */}
        <section
          id="security"
          className="scroll-mt-24 border-y border-slate-200/80 bg-slate-950 py-20 text-white md:py-28"
        >
          <div className="mx-auto max-w-6xl px-5 md:px-6">
            <div className="grid items-start gap-12 lg:grid-cols-2">
              <Reveal variant="left">
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-sky-400">
                    Security
                  </p>
                  <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                    Built like production software — not a weekend script
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-slate-400">
                    Account connect, sessions, and publish jobs are designed with
                    defense in depth so you can run Pulse for real workloads.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    {[
                      { k: "Auth", v: "Better Auth + OAuth" },
                      { k: "Jobs", v: "BullMQ + Redis" },
                      { k: "Data", v: "Postgres + Drizzle" },
                    ].map((chip) => (
                      <div
                        key={chip.k}
                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition-colors duration-300 hover:bg-white/10"
                      >
                        <p className="text-xs text-slate-400">{chip.k}</p>
                        <p className="font-semibold">{chip.v}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
              <ul className="grid gap-3 sm:grid-cols-2">
                {securityPoints.map((p, i) => (
                  <Reveal key={p} delay={i * 60} variant="up">
                    <li className="flex h-full items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition-all duration-300 hover:border-sky-400/30 hover:bg-white/[0.07]">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-500/20 text-sky-400">
                        <ShieldCheck size={14} />
                      </span>
                      <span className="text-sm leading-snug text-slate-200">
                        {p}
                      </span>
                    </li>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Comparison */}
        <section className="mx-auto max-w-6xl px-5 py-20 md:px-6 md:py-28">
          <Reveal>
            <SectionHeading
              eyebrow="Why Pulse"
              title="Premium features without the SaaS tax"
              description="Keep control of your stack. Unlock every feature from day one."
            />
          </Reveal>

          <Reveal delay={100} variant="up">
            <div className="mt-12 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="grid grid-cols-4 border-b border-slate-100 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-6">
                <div className="col-span-1">Feature</div>
                <div className="text-center text-sky-600">Pulse</div>
                <div className="text-center">Manual</div>
                <div className="text-center">Typical SaaS</div>
              </div>
              {comparison.map((row, i) => (
                <div
                  key={row.feature}
                  className={cn(
                    "grid grid-cols-4 items-center px-4 py-3.5 text-sm transition-colors duration-200 sm:px-6",
                    i % 2 === 1 && "bg-slate-50/60",
                    "hover:bg-sky-50/40"
                  )}
                >
                  <div className="col-span-1 font-medium text-slate-800">
                    {row.feature}
                  </div>
                  {([row.pulse, row.manual, row.saas] as const).map((v, idx) => (
                    <div key={idx} className="flex justify-center">
                      {v === true ? (
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                          <Check size={14} strokeWidth={3} />
                        </span>
                      ) : v === "partial" ? (
                        <span className="text-xs font-medium text-amber-600">
                          Partial
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* FAQ — smooth accordion */}
        <section
          id="faq"
          className="scroll-mt-24 border-t border-slate-200/80 bg-white py-20 md:py-28"
        >
          <div className="mx-auto max-w-3xl px-5 md:px-6">
            <Reveal>
              <SectionHeading
                eyebrow="FAQ"
                title="Questions, answered"
                description="Straight answers about access, accounts, and reliability."
              />
            </Reveal>
            <Reveal delay={80} className="mt-12">
              <FaqAccordion items={faqs} />
            </Reveal>
          </div>
        </section>

        {/* Final CTA */}
        <section className="mx-auto max-w-6xl px-5 pb-24 md:px-6">
          <Reveal variant="scale">
            <div className="relative overflow-hidden rounded-[1.75rem] border border-sky-200/60 bg-gradient-to-br from-sky-600 via-blue-600 to-indigo-700 px-8 py-14 text-center text-white shadow-[0_30px_80px_-30px_rgba(37,99,235,0.55)] md:px-16">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_45%)]" />
              <div className="landing-float pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
              <div className="relative">
                <Chip className="mb-5 border-0 bg-white/15 text-white">
                  <Sparkles size={12} />
                  <Chip.Label>No subscription · Full access</Chip.Label>
                </Chip>
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                  Ready to schedule like a pro?
                </h2>
                <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-sky-100 md:text-base">
                  Sign in with Google or X, connect your accounts, and ship your
                  first scheduled post in minutes.
                </p>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <LinkButton
                    href="/login"
                    size="lg"
                    className="min-w-[170px] bg-white text-sky-700 shadow-lg transition-transform duration-300 hover:scale-[1.02] hover:bg-sky-50"
                  >
                    Get started free
                    <ArrowRight size={16} />
                  </LinkButton>
                  <LinkButton
                    href="/login"
                    size="lg"
                    variant="secondary"
                    className="min-w-[170px] border-white/30 bg-white/10 text-white hover:bg-white/15"
                  >
                    Sign in
                  </LinkButton>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-4 md:px-6">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 text-white">
                <AtSign size={18} />
              </div>
              <span className="text-base font-bold">Pulse</span>
            </div>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-500">
              Professional multi-account X post scheduler. Compose, preview,
              schedule, and publish — with security built in.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Product
            </p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {nav.map((n) => (
                <li key={n.href}>
                  <SmoothAnchor
                    href={n.href}
                    className="transition-colors hover:text-sky-600"
                  >
                    {n.label}
                  </SmoothAnchor>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Get started
            </p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>
                <a href="/login" className="transition-colors hover:text-sky-600">
                  Sign in
                </a>
              </li>
              <li>
                <SmoothAnchor
                  href="#faq"
                  className="transition-colors hover:text-sky-600"
                >
                  FAQ
                </SmoothAnchor>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-100 py-5 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} Pulse · X multi-account scheduler · Full
          product, no subscription
        </div>
      </footer>
    </div>
  );
}
