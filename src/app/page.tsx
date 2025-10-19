import { CheckCircle, ChevronRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Main Content */}
      <main className="isolate">
        {/* Hero Section */}
        <div className="relative pt-14">
          <div
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
          <div className="py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-2xl text-center">
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                  CollabConnect
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-300">
                  The platform that connects people to fight back against big
                  institutions and collaborate on life's biggest challenges.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                  <Link
                    href="/register"
                    className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
                  >
                    Join the Movement
                  </Link>
                  <Link
                    href="/map"
                    className="text-sm font-semibold leading-6 text-white"
                  >
                    Preview Map <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div
            className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
        </div>

        {/* Feature Section */}
        <div className="mx-auto -mt-12 max-w-7xl px-6 sm:mt-0 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
            <div className="grid grid-cols-1 gap-8 text-base leading-7 text-gray-300 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl bg-white/5 p-6 ring-1 ring-inset ring-white/10">
                <h3 className="text-lg font-semibold text-white">
                  🤝 Connect
                </h3>
                <p className="mt-2">
                  Find people who share your challenges. Match based on
                  location, interests, and goals. See verified profiles with
                  full transparency.
                </p>
              </div>
              <div className="rounded-xl bg-white/5 p-6 ring-1 ring-inset ring-white/10">
                <h3 className="text-lg font-semibold text-white">
                  💪 Collaborate
                </h3>
                <p className="mt-2">
                  Team up to fight insurance denials, bid on houses together, or
                  tackle any challenge that's easier with friends.
                </p>
              </div>
              <div className="rounded-xl bg-white/5 p-6 ring-1 ring-inset ring-white/10">
                <h3 className="text-lg font-semibold text-white">🏆 Win</h3>
                <p className="mt-2">
                  Power in numbers. One person vs. an insurance company? They
                  lose. Ten people with the same problem? Now we're talking.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Use Cases Section */}
        <div className="mx-auto my-32 max-w-7xl px-6 sm:my-40 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              What Can You Do?
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Real problems. Real solutions. Real power.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            <div className="flex gap-x-4 rounded-xl bg-white/5 p-6 ring-1 ring-inset ring-white/10">
              <div className="text-indigo-400">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">
                  Fight Insurance Companies
                </h3>
                <p className="mt-2 text-base text-gray-400">
                  Connect with others who've had similar claims denied. Pool
                  knowledge, share lawyers, and fight back together.
                </p>
              </div>
            </div>
            <div className="flex gap-x-4 rounded-xl bg-white/5 p-6 ring-1 ring-inset ring-white/10">
              <div className="text-indigo-400">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">
                  Buy Houses Together
                </h3>
                <p className="mt-2 text-base text-gray-400">
                  Can't afford that perfect place alone? Find friends, pool
                  resources, and bid together. Co-own it, flip it, or just live
                  in it.
                </p>
              </div>
            </div>
            <div className="flex gap-x-4 rounded-xl bg-white/5 p-6 ring-1 ring-inset ring-white/10">
              <div className="text-indigo-400">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">
                  Collaborate on Anything
                </h3>
                <p className="mt-2 text-base text-gray-400">
                  From hobby projects to legal battles, find your people.
                  Beautiful interactive maps show opportunities and
                  collaborators near you.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative isolate -z-10 my-32">
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-2xl flex-col gap-16 bg-white/5 px-6 py-16 ring-1 ring-white/10 sm:rounded-3xl sm:p-8 lg:mx-0 lg:max-w-none lg:flex-row lg:items-center lg:py-20 xl:gap-x-20 xl:px-20">
              <div className="h-96 w-full flex-none lg:aspect-square lg:h-auto lg:max-w-sm">
                <Image
                  className="rounded-2xl object-cover shadow-xl"
                  src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                  alt="People collaborating at a desk"
                  width={800}
                  height={800}
                  priority
                />
              </div>
              <div className="w-full flex-auto">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Join the Movement
                </h2>
                <p className="mt-6 text-lg leading-8 text-gray-300">
                  Ready to start? Join thousands of people who refuse to face
                  big challenges alone.
                </p>
                <div className="mt-10 flex">
                  <Link
                    href="/register"
                    className="flex items-center gap-x-2 rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
                  >
                    Create Free Account
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
                <ul className="mt-10 grid grid-cols-1 gap-x-8 gap-y-3 text-base leading-7 text-white sm:grid-cols-2">
                  <li className="flex gap-x-3">
                    <CheckCircle className="h-7 w-5 flex-none" />
                    100% Free Forever
                  </li>
                  <li className="flex gap-x-3">
                    <CheckCircle className="h-7 w-5 flex-none" />
                    No Credit Card Required
                  </li>
                  <li className="flex gap-x-3">
                    <CheckCircle className="h-7 w-5 flex-none" />
                    Open Source
                  </li>
                  <li className="flex gap-x-3">
                    <CheckCircle className="h-7 w-5 flex-none" />
                    Privacy First
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative mt-32 sm:mt-40">
        <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <p className="text-center text-xs leading-5 text-gray-400">
              &copy; {new Date().getFullYear()} CollabConnect. MIT License.
            </p>
          </div>
          <div className="mt-8 md:order-1 md:mt-0">
            <p className="text-center text-xs leading-5 text-gray-400">
              Built with transparency and hope.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
