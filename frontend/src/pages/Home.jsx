import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Scissors,
  Link2,
  Palette,
  BarChart3,
  User,
  Sparkles,
  Tag,
  ArrowRight,
  Check,
  Copy,
  ExternalLink,
  TrendingUp,
  MousePointerClick,
  Globe,
  Zap,
} from "lucide-react";

function HeroDemoCard() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `${import.meta.env.VITE_SERVICE_URL}/lebaran`,
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sampleUrl = `${import.meta.env.VITE_SERVICE_URL}/lebaran`;

  return (
    <div className="relative">
      {/* Glow */}
      <div className="absolute -inset-8 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-auto">
        {/* Header */}
        <div className="flex items-center gap-2 mb-5">
          <div className="size-2.5 rounded-full bg-red-400" />
          <div className="size-2.5 rounded-full bg-yellow-400" />
          <div className="size-2.5 rounded-full bg-green-400" />
          <span className="ml-auto text-xs text-gray-400 font-mono">
            pendekin
          </span>
        </div>

        {/* Long URL input */}
        <div className="mb-3">
          <p className="text-[10px] text-gray-400 mb-1 font-medium uppercase tracking-wider">
            Long URL
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 flex items-center gap-2">
            <Globe className="size-3.5 text-gray-400 shrink-0" />
            <span className="text-[11px] text-gray-500 truncate font-mono">
              tokopedia.com/shop/lebaran-mega-sale-2025?ref=banner&utm_source=ig
            </span>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex items-center justify-center my-2">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <div className="h-px w-8 bg-gray-200" />
            <Zap className="size-3.5 text-secondary" />
            <div className="h-px w-8 bg-gray-200" />
          </div>
        </div>

        {/* Short URL output */}
        <div className="mb-4">
          <p className="text-[10px] text-gray-400 mb-1 font-medium uppercase tracking-wider">
            Short URL
          </p>
          <div className="bg-[#fff5f5] border border-secondary/25 rounded-lg px-3 py-2.5 flex items-center justify-between gap-2">
            <span className="text-sm font-bold text-secondary font-mono">
              {sampleUrl}
            </span>
            <button
              onClick={handleCopy}
              className="shrink-0 flex items-center gap-1 text-[10px] text-secondary/70 hover:text-secondary transition-colors cursor-pointer"
            >
              {copied ? (
                <Check className="size-3.5" />
              ) : (
                <Copy className="size-3.5" />
              )}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const features = [
  {
    icon: Link2,
    title: "Instant Shortening",
    body: "Paste any URL and get a clean short link in under a second. No sign-up required to try.",
  },
  {
    icon: Palette,
    title: "Custom Aliases",
    body: "Brand your links with memorable slugs instead of random characters.",
  },
  {
    icon: BarChart3,
    title: "Deep Analytics",
    body: "Click counts, device breakdown, referrer sources, and AI-generated performance insights.",
  },
  {
    icon: Sparkles,
    title: "AI Suggestions",
    body: "Our AI reads your destination URL and proposes short, relevant, brand-safe aliases.",
  },
  {
    icon: User,
    title: "Clean Dashboard",
    body: "Manage all your links in one place. Search, filter, edit, and delete without friction.",
  },
  {
    icon: Tag,
    title: "Scalable Plans",
    body: "Free tier for casual users. Pro and Team plans unlock custom domains and advanced analytics.",
  },
];

// ── Steps ───────────────────────────────────────────────────────────────────

const steps = [
  {
    n: "01",
    title: "Create an account",
    body: "Sign up for free in under 30 seconds. No credit card needed.",
  },
  {
    n: "02",
    title: "Paste your URL",
    body: "Drop any long link into the dashboard input and optionally set a custom alias.",
  },
  {
    n: "03",
    title: "Share & track",
    body: "Copy your short link and share it anywhere. Watch clicks roll in on your analytics page.",
  },
];

// ── Social proof numbers ─────────────────────────────────────────────────────

const stats = [
  { value: "50K+", label: "Links created" },
  { value: "2M+", label: "Clicks tracked" },
  { value: "12K+", label: "Active users" },
  { value: "99.9%", label: "Uptime" },
];

export default function Home() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleCopy = (shrturl = "") => {
    const serviceUrl = new URL(import.meta.env.VITE_SERVICE_URL);
    if (shrturl == "") {
      if (!shortUrl) {
        return;
      } else {
        shrturl = shortUrl;
      }
    } else {
      shrturl = `${import.meta.env.VITE_SERVICE_URL}/${shrturl}`;
    }
    navigator.clipboard.writeText(`${serviceUrl.protocol}//${shrturl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShorten = () => {
    if (!url) return;
    const serviceUrl = import.meta.env.VITE_SERVICE_URL;
    const host = new URL(serviceUrl).host + "/";

    const slug = Math.random().toString(36).substring(2, 8);
    setShortUrl(`${host}${slug}`);
  };

  return (
    <div className="font-sans">
      <header className="bg-[#0f0a0d] border-b border-white/5 sticky top-0 z-50 text-white">
        <nav className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="text-secondary font-bold text-xl">
            <a href="/">PENDEKIN</a>
          </div>
          <div className="hidden md:flex items-center gap-7">
            <a
              href="#features"
              className="text-sm text-white/50 hover:text-white/90 transition-colors"
            >
              Features
            </a>
            <a
              href="#how-to"
              className="text-sm text-white/50 hover:text-white/90 transition-colors"
            >
              How it works
            </a>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/auth", { state: { mode: "login" } })}
              className="text-sm text-white/60 hover:text-white px-3 py-1.5 transition-colors cursor-pointer"
            >
              Log in
            </button>
            <button
              onClick={() => navigate("/auth", { state: { mode: "register" } })}
              className="bg-secondary hover:bg-secondary/90 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              Sign up free
            </button>
          </div>
        </nav>
      </header>
      {/* ── Hero ── */}
      <section className="bg-[#0f0a0d] pt-20 pb-28 relative overflow-hidden">
        {/* Background texture dots */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <h1 className="text-5xl lg:text-6xl text-white leading-[1.08] mb-6 font-display">
                Links that{" "}
                <span className="text-secondary italic">actually</span>
                <br />
                work for you.
              </h1>

              <p className="text-white/50 text-base leading-relaxed mb-8 max-w-md">
                Shorten, brand, and track every link you share. With AI-powered
                deep analytics built right in.
              </p>

              {/* Inline shortener */}
              <div className="flex gap-2 mb-4">
                <div className="flex-1 flex items-center bg-white/8 border border-white/12 rounded-xl px-4 h-12 gap-3 focus-within:border-secondary/50 transition-colors">
                  <Link2 className="size-4 text-white/30 shrink-0" />
                  <input
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      setShortUrl("");
                    }}
                    placeholder="Paste your long URL here…"
                    className="flex-1 bg-transparent text-sm text-white placeholder:text-white/25 outline-none"
                  />
                </div>
                <button
                  onClick={handleShorten}
                  className="bg-secondary hover:bg-secondary/90 text-white font-semibold text-sm px-5 h-12 rounded-xl flex items-center gap-2 transition-colors shrink-0 cursor-pointer"
                >
                  Shorten
                  <ArrowRight className="size-4" />
                </button>
              </div>
              {/* Result */}
              {shortUrl && (
                <>
                  <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-primary/15">
                    <span className="flex-1 text-sm font-mono text-primary font-medium truncate">
                      {shortUrl}
                    </span>
                    <button
                      onClick={() => handleCopy()}
                      className="text-primary/60 hover:text-primary shrink-0 gap-1.5 flex items-center rounded-md px-2 py-1 text-sm font-sans cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="size-3.5 text-green-600" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="size-3.5" /> Copy
                        </>
                      )}
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* <Sparkles className="size-4 shrink-0 text-primary" />*/}
                    <button
                      onClick={() =>
                        navigate("/auth", { state: { mode: "login" } })
                      }
                      className="cursor-pointer text-secondary/70 hover:text-secondary underline underline-offset-2 transition-colors text-sm"
                    >
                      Log in
                    </button>
                    <p className="text-xs text-white/40">
                      For custom aliases and deep analytics
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Right */}
            <div className="flex justify-center lg:justify-end">
              <HeroDemoCard />
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="bg-primary">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-x divide-white/10">
            {stats.map((s) => (
              <div key={s.label} className="text-center px-4">
                <p
                  className="text-3xl font-black text-white mb-0.5"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {s.value}
                </p>
                <p className="text-xs text-white/55 uppercase tracking-widest">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="bg-background py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-xl mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-3">
              What you get
            </p>
            <h2
              className="text-4xl text-foreground leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Everything a modern
              <br />
              link needs.
            </h2>
          </div>

          {/* Asymmetric grid: big card left, 2×2 right */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            {/* Big feature card */}
            <div className="lg:col-span-2 bg-primary rounded-2xl p-8 flex flex-col justify-between min-h-80">
              <div>
                <div className="flex items-center justify-center size-12 rounded-xl bg-white/10 mb-6">
                  <BarChart3 className="size-6 text-white" />
                </div>
                <h3
                  className="text-2xl font-bold text-white mb-3"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Deep click analytics
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  See exactly where your clicks come from — device type,
                  referrer source, geography — plus AI-generated insights that
                  tell you what to do next.
                </p>
              </div>
            </div>

            {/* 2×2 smaller cards */}
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {features
                .filter((_, i) => i !== 2)
                .map((f) => {
                  const Icon = f.icon;
                  return (
                    <div
                      key={f.title}
                      className="bg-card border border-border rounded-2xl p-6 hover:border-primary/30 hover:shadow-sm transition-all group"
                    >
                      <div className="flex items-center justify-center size-10 rounded-xl bg-primary/8 mb-4 group-hover:bg-primary/12 transition-colors">
                        <Icon className="size-5 text-primary" />
                      </div>
                      <h3 className="font-bold text-foreground text-sm mb-1.5">
                        {f.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {f.body}
                      </p>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-to" className="bg-[#faf5f8] py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-secondary mb-3">
              Get started in minutes
            </p>
            <h2
              className="text-4xl text-foreground"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Three steps to a better link.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-7 left-[calc(16.66%+2rem)] right-[calc(16.66%+2rem)] h-px bg-linear-to-r from-transparent via-primary/20 to-transparent" />

            {steps.map((s, i) => (
              <div
                key={s.n}
                className="relative bg-white rounded-2xl p-7 border border-border hover:border-primary/20 hover:shadow-sm transition-all"
              >
                <div
                  className="text-5xl font-black mb-5 leading-none"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: i === 1 ? "#E55050" : "#732255",
                    opacity: 0.15,
                  }}
                >
                  {s.n}
                </div>
                <div
                  className="text-xs font-bold uppercase tracking-widest mb-2"
                  style={{ color: i === 1 ? "#E55050" : "#732255" }}
                >
                  Step {i + 1}
                </div>
                <h3 className="font-bold text-foreground text-base mb-2">
                  {s.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-primary relative overflow-hidden py-28">
        {/* Background pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #ffffff 1.5px, transparent 1.5px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary/40 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 relative text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-5">
            Start for free · No credit card
          </p>
          <h2
            className="text-5xl md:text-6xl text-white leading-tight mb-6 max-w-2xl mx-auto"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Start shortening{" "}
            <span className="text-secondary italic">smarter</span> today.
          </h2>
          <p className="text-white/55 text-base mb-10 max-w-md mx-auto leading-relaxed">
            Join thousands of users already building cleaner, trackable links
            with Pendekin.
          </p>
          <button
            onClick={() => navigate("/auth", { state: { mode: "register" } })}
            className="inline-flex items-center gap-2 bg-white text-primary font-bold text-base px-8 py-4 rounded-xl hover:bg-white/90 transition-colors shadow-lg cursor-pointer"
          >
            Create your free account
            <ArrowRight className="size-4" />
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-[#0f0a0d]">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <p
                className="text-secondary text-xl font-black tracking-tight mb-1"
                style={{ fontFamily: "var(--font-display)" }}
              >
                PENDEKIN
              </p>
              <p className="text-white/30 text-xs">Shorten smarter.</p>
            </div>

            <div className="flex items-center gap-8 text-sm text-white/40">
              <a
                href="#features"
                className="hover:text-white/80 transition-colors"
              >
                Features
              </a>
              <a
                href="#how-to"
                className="hover:text-white/80 transition-colors"
              >
                How it works
              </a>
              <button
                onClick={() => navigate("dashboard")}
                className="hover:text-white/80 transition-colors cursor-pointer"
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-white/5 py-4 text-center">
          <p className="text-white/20 text-xs">
            © 2026 Pendekin. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
