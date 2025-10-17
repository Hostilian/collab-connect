import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/auth/signin")
  }

  // Fetch user profile with stats
  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    include: {
      hobbies: {
        include: {
          hobby: true,
        },
      },
      interests: {
        include: {
          interest: true,
        },
      },
    },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-indigo-600">
              CollabConnect
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/dashboard" className="text-gray-700 hover:text-indigo-600 font-medium">
                Dashboard
              </Link>
              <Link href="/map" className="text-gray-700 hover:text-indigo-600 font-medium">
                Map
              </Link>
              <Link href="/groups" className="text-gray-700 hover:text-indigo-600 font-medium">
                Groups
              </Link>
              <Link href="/profile" className="text-gray-700 hover:text-indigo-600 font-medium">
                Profile
              </Link>
              <form action={async () => {
                'use server'
                const { signOut } = await import("@/lib/auth")
                await signOut()
              }}>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Sign Out
                </button>
              </form>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {session.user.name || "Friend"}!
          </h1>
          <p className="text-gray-600">
            Ready to connect and collaborate today?
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Total Collaborations</span>
              <span className="text-2xl">🤝</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {profile?.totalCollaborations || 0}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Successful</span>
              <span className="text-2xl">✅</span>
            </div>
            <p className="text-3xl font-bold text-green-600">
              {profile?.successfulCollabs || 0}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Active Now</span>
              <span className="text-2xl">🔥</span>
            </div>
            <p className="text-3xl font-bold text-indigo-600">
              {profile?.activeCollabs || 0}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Verification</span>
              <span className="text-2xl">{profile?.isVerified ? "✓" : "⏳"}</span>
            </div>
            <p className="text-lg font-bold text-gray-900">
              {profile?.isVerified ? "Verified" : "Pending"}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              href="/profile/edit"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all text-center"
            >
              <div className="text-3xl mb-2">👤</div>
              <p className="font-medium text-gray-900">Complete Your Profile</p>
              <p className="text-sm text-gray-600">Add hobbies and interests</p>
            </Link>

            <Link
              href="/map"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all text-center"
            >
              <div className="text-3xl mb-2">🗺️</div>
              <p className="font-medium text-gray-900">Explore the Map</p>
              <p className="text-sm text-gray-600">Find people and opportunities</p>
            </Link>

            <Link
              href="/groups/create"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all text-center"
            >
              <div className="text-3xl mb-2">➕</div>
              <p className="font-medium text-gray-900">Start a Collaboration</p>
              <p className="text-sm text-gray-600">Create a new group</p>
            </Link>
          </div>
        </div>

        {/* Recent Activity / Getting Started */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Getting Started</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-1">✓</span>
                <div>
                  <p className="font-medium text-gray-900">Create your account</p>
                  <p className="text-sm text-gray-600">You're all set!</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className={profile?.bio ? "text-green-500" : "text-gray-400"}>
                  {profile?.bio ? "✓" : "○"}
                </span>
                <div>
                  <p className="font-medium text-gray-900">Complete your profile</p>
                  <p className="text-sm text-gray-600">Tell us about yourself</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gray-400">○</span>
                <div>
                  <p className="font-medium text-gray-900">Join your first group</p>
                  <p className="text-sm text-gray-600">Start collaborating</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gray-400">○</span>
                <div>
                  <p className="font-medium text-gray-900">Connect with others</p>
                  <p className="text-sm text-gray-600">Find your people</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl shadow-sm p-6 text-white">
            <h2 className="text-xl font-bold mb-4">Why Transparency Matters</h2>
            <p className="mb-4">
              Your profile was created on{" "}
              <span className="font-bold">
                {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "today"}
              </span>
              . Everyone can see this.
            </p>
            <p className="mb-4">
              This builds trust. No fake accounts. No hidden histories. Just real people working together.
            </p>
            <p className="text-sm opacity-90">
              That's how we fight the system - with honesty, transparency, and solidarity.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
