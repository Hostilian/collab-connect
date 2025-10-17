import { auth } from "@/lib/auth"
import Link from "next/link"

export default async function Home() {
  const session = await auth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              CollabConnect
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-4 max-w-3xl mx-auto">
              The platform that connects people to fight back against big institutions
              and collaborate on life's biggest challenges.
            </p>
            <p className="text-lg text-gray-500 mb-8 italic">
              "The powerful don't want you to organize. So let's organize."
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {session ? (
                <Link
                  href="/dashboard"
                  className="px-8 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-full hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/auth/signup"
                    className="px-8 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-full hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    Join the Movement
                  </Link>
                  <Link
                    href="/auth/signin"
                    className="px-8 py-4 bg-white text-indigo-600 text-lg font-semibold rounded-full hover:bg-gray-50 transition-all border-2 border-indigo-600"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Connect</h3>
            <p className="text-gray-600">
              Find people who share your challenges. Match based on location, interests, and goals.
              See verified profiles with full transparency.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">💪</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Collaborate</h3>
            <p className="text-gray-600">
              Team up to fight insurance denials, bid on houses together, or tackle any challenge
              that's easier with friends.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Win</h3>
            <p className="text-gray-600">
              Power in numbers. One person vs. an insurance company? They lose. Ten people
              with the same problem? Now we're talking.
            </p>
          </div>
        </div>
      </div>

      {/* Transparency Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Transparency First</h2>
          <p className="text-xl mb-4">
            See when profiles were created. View collaboration histories. Know who's verified.
          </p>
          <p className="text-lg opacity-90">
            No fake accounts. No hidden agendas. Just real people helping real people.
          </p>
        </div>
      </div>

      {/* Use Cases */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
          What Can You Do?
        </h2>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">🏥 Fight Insurance Companies</h3>
            <p className="text-gray-600 text-lg">
              Connect with others who've had similar claims denied. Pool knowledge, share lawyers,
              and fight back together. The system expects you to give up. Don't.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">🏡 Buy Houses Together</h3>
            <p className="text-gray-600 text-lg">
              Can't afford that perfect place alone? Find friends, pool resources, and bid together.
              Split it, flip it, or co-own it. The wealthy do this all the time.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">🎯 Collaborate on Anything</h3>
            <p className="text-gray-600 text-lg">
              From hobby projects to legal battles, find your people. Beautiful interactive maps
              show opportunities and collaborators near you.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start?</h2>
          <p className="text-xl mb-8">
            Join thousands of people who refuse to face big challenges alone.
          </p>
          {!session && (
            <Link
              href="/auth/signup"
              className="inline-block px-8 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-full hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl"
            >
              Create Free Account
            </Link>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p>CollabConnect - Because collaboration should be free.</p>
          <p className="mt-2 text-sm">MIT License • Built with transparency and hope</p>
        </div>
      </footer>
    </div>
  )
}
