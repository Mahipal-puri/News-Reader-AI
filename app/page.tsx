import Link from "next/link";
import {
  ArrowRight,
  Bell,
  BookOpen,
  Bookmark,
  Hammer,
  Headphones,
  Languages,
  Newspaper,
  Search,
  Sparkles,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/Button";

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI Summaries",
    body: "Short, bullets, or key takeaways — fit the story to the time you have.",
    href: "/article/a1#summary",
    cta: "Try a summary"
  },
  {
    icon: Headphones,
    title: "Voice Reader",
    body: "Listen to any article hands-free with adjustable voices and speed.",
    href: "/article/a1#listen",
    cta: "Listen now"
  },
  {
    icon: Languages,
    title: "Translate",
    body: "Read across languages in one tap. Spanish and Hindi out of the box.",
    href: "/article/a1#translate",
    cta: "Translate a story"
  },
  {
    icon: TrendingUp,
    title: "Trending Topics",
    body: "Surface what the world is reading — across categories.",
    href: "/home#trending",
    cta: "See what's trending"
  },
  {
    icon: Bookmark,
    title: "Bookmarks & Lists",
    body: "Save articles, organize collections, build your reading list.",
    href: "/bookmarks",
    cta: "Open bookmarks"
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    body: "Breaking news, daily briefings, and per-topic notifications.",
    href: "/notifications",
    cta: "View alerts"
  }
];

const CATEGORIES = [
  "Politics","Technology","Business","Sports","Entertainment",
  "Science","Health","Education","Finance","Crypto","Startups","World"
];

export default function LandingPage() {
  return (
    <div>
      <header className="sticky top-0 z-30 glass">
        <div className="mx-auto flex h-14 max-w-7xl items-center px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Newspaper className="h-5 w-5 text-brand-600" />
            News<span className="text-brand-600">AI</span>
          </Link>
          <nav className="ml-8 hidden gap-6 text-sm text-neutral-600 dark:text-neutral-400 md:flex">
            <a href="#features" className="hover:text-current">Features</a>
            <a href="#categories" className="hover:text-current">Categories</a>
            <a href="#faq" className="hover:text-current">FAQ</a>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Get started</Button>
            </Link>
          </div>
        </div>
      </header>

      <section id="main" className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border bg-[rgb(var(--card))] px-3 py-1 text-xs text-neutral-600 dark:text-neutral-400">
                <Sparkles className="h-3.5 w-3.5 text-brand-600" />
                AI-powered. Personalized. Yours.
              </div>
              <h1
                className="mt-4 text-balance font-bold leading-[1.05] tracking-tight"
                style={{ fontSize: "var(--fs-3xl)" }}
              >
                The news, summarized for{" "}
                <span className="bg-gradient-to-r from-brand-500 to-violet-500 bg-clip-text text-transparent">
                  the time you have.
                </span>
              </h1>
              <p
                className="mt-4 max-w-xl text-neutral-600 dark:text-neutral-400"
                style={{ fontSize: "var(--fs-lg)" }}
              >
                NewsAI aggregates headlines from every category, summarizes
                them with AI, and reads them aloud — so you can stay informed
                in minutes, not hours.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/register">
                  <Button size="lg" className="press">
                    Start reading
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                </Link>
                <Link href="/home">
                  <Button size="lg" variant="outline" className="press">
                    Browse as guest
                  </Button>
                </Link>
              </div>
              <div className="mt-6 flex flex-wrap gap-4 text-xs text-neutral-500">
                <span className="inline-flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5" /> 40+ articles
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5" /> 13 categories
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Headphones className="h-3.5 w-3.5" /> Voice playback
                </span>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-8 -z-10 bg-gradient-to-br from-brand-200/40 to-violet-200/40 blur-3xl dark:from-brand-900/30 dark:to-violet-900/30" />
              <div className="relative grid grid-cols-2 gap-3">
                {[1,2,3,4].map((i) => (
                  <div key={i} className={`rounded-2xl border bg-[rgb(var(--card))] p-4 shadow-sm ${i % 2 ? "translate-y-4" : ""}`}>
                    <div className="aspect-[16/10] overflow-hidden rounded-lg">
                      <img
                        src={`https://picsum.photos/seed/landing${i}/600/400`}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="mt-3 text-[11px] text-neutral-500">
                      {["Tech Pulse","Globe Wire","Market Daily","Lab Notes"][i-1]} · 2h ago
                    </div>
                    <h3 className="mt-1 line-clamp-2 text-sm font-semibold">
                      {[
                        "An open-source model just topped a leading reasoning benchmark",
                        "Global summit closes with sweeping climate pact",
                        "Central bank holds rates steady but signals cuts ahead",
                        "Fusion startup claims sustained net-energy gain"
                      ][i-1]}
                    </h3>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="border-t bg-neutral-50/50 dark:bg-neutral-950/50">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold md:text-4xl">Built for how you actually read</h2>
            <p className="mt-2 text-neutral-600 dark:text-neutral-400">
              Six features that compound — so the news fits your life, not the other way around.
            </p>
          </div>
          <div className="stagger mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <Link
                  key={f.title}
                  href={f.href}
                  className="lift-card group rounded-2xl border bg-[rgb(var(--card))] p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
                  aria-label={`${f.title} — ${f.cta}`}
                >
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/40">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-3 font-semibold">{f.title}</h3>
                  <p className="mt-1 text-sm text-neutral-500">{f.body}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-brand-600">
                    {f.cta}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section id="categories" className="border-t">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <h2 className="text-3xl font-bold md:text-4xl">Every category, one feed</h2>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            Follow the categories you care about. Skip the noise.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <span
                key={c}
                className="rounded-full border bg-[rgb(var(--card))] px-3 py-1.5 text-sm"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="border-t bg-neutral-50/50 dark:bg-neutral-950/50">
        <div className="mx-auto max-w-3xl px-4 py-16">
          <h2 className="text-3xl font-bold md:text-4xl">FAQ</h2>
          <div className="mt-6 space-y-4">
            {[
              {
                q: "Is this app real?",
                a: "It's a frontend demo. All articles, users, and AI responses are mocked locally — nothing leaves your browser."
              },
              {
                q: "Can I sign in with any email?",
                a: "Yes. Email, Google, and OTP buttons all accept any input and resolve to a local user."
              },
              {
                q: "Does voice reading work?",
                a: "Yes — voice playback uses the browser's built-in Web Speech API. No API key needed."
              },
              {
                q: "Do bookmarks persist?",
                a: "Yes, through localStorage in your browser."
              }
            ].map((item) => (
              <details
                key={item.q}
                className="group rounded-2xl border bg-[rgb(var(--card))] p-4"
              >
                <summary className="cursor-pointer list-none font-medium">
                  {item.q}
                </summary>
                <p className="mt-2 text-sm text-neutral-500">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center">
          <h2 className="text-balance text-3xl font-bold md:text-4xl">
            Make news fit your day.
          </h2>
          <p className="mt-3 text-neutral-600 dark:text-neutral-400">
            Sign up free, follow your topics, and start reading smarter.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/register">
              <Button size="lg">
                Create your account
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 text-xs text-neutral-500 sm:flex-row">
          <p>© 2026 NewsAI. Articles are fictional, generated for demonstration.</p>
          <p className="inline-flex items-center gap-1.5">
            Developed by
            <a
              href="#"
              className="inline-flex items-center gap-1 font-semibold text-neutral-700 transition-colors hover:text-brand-600 dark:text-neutral-200"
            >
              <Hammer className="h-3.5 w-3.5 text-brand-600" />
              Digital Hammer
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
