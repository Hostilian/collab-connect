import { CheckCircle, ChevronRight, ShieldCheck, Users, Home, TrendingUp, Globe, Zap, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CollabConnect - Unite, Collaborate, Conquer Life's Biggest Challenges",
  description: "Join thousands fighting insurance companies, buying homes together, and tackling life's challenges through the power of collaboration. 100% free, forever.",
  keywords: "collaboration platform, insurance claims, group home buying, peer support, community platform, fight insurance denials, collaborative property investment",
  authors: [{ name: "CollabConnect" }],
  openGraph: {
    title: "CollabConnect - Unite Against Big Institutions",
    description: "The platform connecting people to fight insurance denials, buy homes together, and solve life's biggest challenges collaboratively.",
    type: "website",
    siteName: "CollabConnect",
    url: "https://collab-connect.vercel.app",
    images: [
      {
        url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=630&fit=crop",
        width: 1200,
        height: 630,
        alt: "People collaborating together",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CollabConnect - Unite, Collaborate, Win",
    description: "Join the movement. Fight insurance companies. Buy homes together. Tackle challenges with allies.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-slate-900/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2">
                <Users className="h-6 w-6 text-indigo-400" />
                <span className="text-xl font-bold text-white">CollabConnect</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/auth/signin"
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-indigo-400 transition-all hover:scale-105"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="isolate">
        {/* Hero Section */}
        <div className="relative pt-24">
          <div
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] via-[#7c3aed] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
          <div className="py-24 sm:py-32 lg:py-40">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-3xl text-center">
                <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300">
                  <Zap className="h-4 w-4" />
                  <span>Join 10,000+ people taking control</span>
                </div>
                <h1 className="text-5xl font-bold tracking-tight text-white sm:text-7xl bg-gradient-to-r from-white via-indigo-100 to-white bg-clip-text text-transparent">
                  Stop Fighting Alone.
                  <br />
                  <span className="text-indigo-400">Unite & Win.</span>
                </h1>
                <p className="mt-6 text-xl leading-8 text-gray-300">
                  The platform connecting thousands to fight insurance denials, buy homes together, and tackle life's biggest challenges through the power of collaboration.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/auth/signup"
                    className="group flex items-center gap-2 rounded-lg bg-indigo-500 px-8 py-4 text-lg font-semibold text-white shadow-xl hover:bg-indigo-400 transition-all hover:scale-105"
                  >
                    Start Free Today
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="#features"
                    className="text-lg font-semibold leading-6 text-indigo-300 hover:text-indigo-200 transition-colors"
                  >
                    See How It Works <span aria-hidden="true">→</span>
                  </Link>
                </div>
                <div className="mt-10 flex items-center justify-center gap-8 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span>100% Free Forever</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span>No Credit Card</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span>2 Min Setup</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] via-[#7c3aed] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
        </div>

        {/* Stats Section */}
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="text-5xl font-bold text-indigo-400">10K+</div>
                <div className="mt-2 text-lg text-gray-300">Active Members</div>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="text-5xl font-bold text-indigo-400">$50M+</div>
                <div className="mt-2 text-lg text-gray-300">Claims Won</div>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="text-5xl font-bold text-indigo-400">500+</div>
                <div className="mt-2 text-lg text-gray-300">Homes Co-Owned</div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Section */}
        <div id="features" className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-400">Everything You Need</h2>
            <p className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Power in Numbers
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              One person alone? They ignore you. A thousand people with the same problem? Game over.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col items-start rounded-2xl bg-white/5 p-8 ring-1 ring-inset ring-white/10 transition-all hover:bg-white/10 hover:scale-105">
                <div className="rounded-lg bg-indigo-500/10 p-3 ring-1 ring-inset ring-indigo-500/20">
                  <Users className="h-8 w-8 text-indigo-400" />
                </div>
                <dt className="mt-4 font-semibold text-xl text-white">Connect Instantly</dt>
                <dd className="mt-2 flex flex-auto flex-col text-base leading-7 text-gray-300">
                  <p className="flex-auto">
                    Find people fighting the same battles. Match by location, problem type, or goal. See verified profiles with full transparency and trust scores.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col items-start rounded-2xl bg-white/5 p-8 ring-1 ring-inset ring-white/10 transition-all hover:bg-white/10 hover:scale-105">
                <div className="rounded-lg bg-indigo-500/10 p-3 ring-1 ring-inset ring-indigo-500/20">
                  <ShieldCheck className="h-8 w-8 text-indigo-400" />
                </div>
                <dt className="mt-4 font-semibold text-xl text-white">Pool Resources</dt>
                <dd className="mt-2 flex flex-auto flex-col text-base leading-7 text-gray-300">
                  <p className="flex-auto">
                    Share legal fees. Split property costs. Combine knowledge. Built-in escrow, contracts, and dispute resolution keep everyone protected.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col items-start rounded-2xl bg-white/5 p-8 ring-1 ring-inset ring-white/10 transition-all hover:bg-white/10 hover:scale-105">
                <div className="rounded-lg bg-indigo-500/10 p-3 ring-1 ring-inset ring-indigo-500/20">
                  <TrendingUp className="h-8 w-8 text-indigo-400" />
                </div>
                <dt className="mt-4 font-semibold text-xl text-white">Win Together</dt>
                <dd className="mt-2 flex flex-auto flex-col text-base leading-7 text-gray-300">
                  <p className="flex-auto">
                    Track your group's progress. Celebrate wins. Learn from others' successes. Real-time updates keep everyone aligned and motivated.
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Use Cases Section */}
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Real Problems, Real Solutions
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              See how thousands are using CollabConnect to level the playing field
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            <div className="flex gap-x-4 rounded-2xl bg-gradient-to-br from-red-500/10 to-orange-500/10 p-8 ring-1 ring-inset ring-red-500/20">
              <div className="text-red-400">
                <ShieldCheck className="h-10 w-10" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-3">
                  Fight Insurance Denials
                </h3>
                <p className="text-base text-gray-300 leading-relaxed">
                  <strong className="text-white">The Problem:</strong> Your $50K surgery denied. You're alone, they have lawyers.
                </p>
                <p className="mt-3 text-base text-gray-300 leading-relaxed">
                  <strong className="text-white">The Solution:</strong> Connect with 100 people denied for the same reason. Pool $500 each, hire a firm that specializes in this. They cave every time.
                </p>
                <div className="mt-4 text-sm text-green-400 font-semibold">
                  ✓ Success rate: 87% | Average recovery: $42K
                </div>
              </div>
            </div>
            <div className="flex gap-x-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 p-8 ring-1 ring-inset ring-blue-500/20">
              <div className="text-blue-400">
                <Home className="h-10 w-10" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-3">
                  Buy Homes Together
                </h3>
                <p className="text-base text-gray-300 leading-relaxed">
                  <strong className="text-white">The Problem:</strong> Dream house is $800K. You have $200K. Banks say no.
                </p>
                <p className="mt-3 text-base text-gray-300 leading-relaxed">
                  <strong className="text-white">The Solution:</strong> Find 3 friends, each with $200K. Buy it together, live in it, rent it, or flip it. Built-in legal docs and ownership tracking.
                </p>
                <div className="mt-4 text-sm text-green-400 font-semibold">
                  ✓ 500+ co-owned homes | Average savings: $150K
                </div>
              </div>
            </div>
            <div className="flex gap-x-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-8 ring-1 ring-inset ring-purple-500/20">
              <div className="text-purple-400">
                <Globe className="h-10 w-10" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-3">
                  Tackle Any Challenge
                </h3>
                <p className="text-base text-gray-300 leading-relaxed">
                  <strong className="text-white">The Problem:</strong> Medical bills crushing you. Landlord won't fix mold. Company screwed you over.
                </p>
                <p className="mt-3 text-base text-gray-300 leading-relaxed">
                  <strong className="text-white">The Solution:</strong> Find your people. Share strategies. Pool resources. Win together. From debt to lawsuits to activism—it's all here.
                </p>
                <div className="mt-4 text-sm text-green-400 font-semibold">
                  ✓ 50+ use cases | Community support 24/7
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative isolate my-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto flex max-w-2xl flex-col gap-16 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 px-6 py-20 ring-1 ring-white/10 sm:rounded-3xl sm:p-16 lg:mx-0 lg:max-w-none lg:flex-row lg:items-center xl:gap-x-20 xl:px-20">
              <div className="h-96 w-full flex-none lg:aspect-square lg:h-auto lg:max-w-md">
                <Image
                  className="rounded-2xl object-cover shadow-2xl ring-1 ring-white/10"
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80"
                  alt="People collaborating and celebrating success"
                  width={800}
                  height={800}
                  priority
                />
              </div>
              <div className="w-full flex-auto">
                <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                  Ready to Stop Fighting Alone?
                </h2>
                <p className="mt-6 text-xl leading-8 text-gray-300">
                  Join over 10,000 people who refuse to let big institutions push them around. 100% free. No credit card. No BS.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/auth/signup"
                    className="flex items-center justify-center gap-x-2 rounded-lg bg-indigo-500 px-8 py-4 text-lg font-semibold text-white shadow-xl hover:bg-indigo-400 transition-all hover:scale-105"
                  >
                    Create Free Account
                    <ChevronRight className="h-5 w-5" />
                  </Link>
                  <Link
                    href="/map"
                    className="flex items-center justify-center gap-x-2 rounded-lg border border-white/10 bg-white/5 px-8 py-4 text-lg font-semibold text-white hover:bg-white/10 transition-all"
                  >
                    Explore Map
                    <Globe className="h-5 w-5" />
                  </Link>
                </div>
                <ul className="mt-10 grid grid-cols-1 gap-x-8 gap-y-3 text-base leading-7 text-white sm:grid-cols-2">
                  <li className="flex gap-x-3">
                    <CheckCircle className="h-7 w-5 flex-none text-green-400" />
                    <span>Forever Free</span>
                  </li>
                  <li className="flex gap-x-3">
                    <CheckCircle className="h-7 w-5 flex-none text-green-400" />
                    <span>No Credit Card Required</span>
                  </li>
                  <li className="flex gap-x-3">
                    <CheckCircle className="h-7 w-5 flex-none text-green-400" />
                    <span>2-Minute Setup</span>
                  </li>
                  <li className="flex gap-x-3">
                    <CheckCircle className="h-7 w-5 flex-none text-green-400" />
                    <span>AI-Powered Matching</span>
                  </li>
                  <li className="flex gap-x-3">
                    <CheckCircle className="h-7 w-5 flex-none text-green-400" />
                    <span>Built-in Legal Tools</span>
                  </li>
                  <li className="flex gap-x-3">
                    <CheckCircle className="h-7 w-5 flex-none text-green-400" />
                    <span>24/7 Community Support</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-slate-900">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Product</h3>
              <ul className="mt-4 space-y-2">
                <li><Link href="/map" className="text-sm text-gray-400 hover:text-white transition-colors">Interactive Map</Link></li>
                <li><Link href="/features" className="text-sm text-gray-400 hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="text-sm text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Company</h3>
              <ul className="mt-4 space-y-2">
                <li><Link href="/about" className="text-sm text-gray-400 hover:text-white transition-colors">About</Link></li>
                <li><Link href="/blog" className="text-sm text-gray-400 hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/careers" className="text-sm text-gray-400 hover:text-white transition-colors">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Legal</h3>
              <ul className="mt-4 space-y-2">
                <li><Link href="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">Terms</Link></li>
                <li><Link href="/cookies" className="text-sm text-gray-400 hover:text-white transition-colors">Cookies</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Support</h3>
              <ul className="mt-4 space-y-2">
                <li><Link href="/help" className="text-sm text-gray-400 hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/status" className="text-sm text-gray-400 hover:text-white transition-colors">Status</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-white/10 pt-8 flex items-center justify-between">
            <p className="text-sm text-gray-400">© 2025 CollabConnect. All rights reserved.</p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>Made with</span>
              <span className="text-red-400">♥</span>
              <span>for everyone tired of fighting alone</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
