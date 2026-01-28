import Link from "next/link";
import React from "react";

const Home = () => {
  const user = false;
  return (
    <div className="min-h-screen bg-linear-to-br from-[#020617] via-[#020617] to-[#020617] text-white">
      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="text-center text-4xl font-bold">
          Team Access Control Demo
        </h1>

        <p className="mx-auto mt-4 max-w-3xl text-center text-gray-300">
          This demo showcases Next.js 16 access control features with role-based
          permissions.
        </p>

        {/* Cards */}
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {/* Features */}
          <div className="rounded-xl bg-white/5 p-6 shadow-lg backdrop-blur">
            <h2 className="mb-4 text-lg font-semibold">
              Features Demonstrated
            </h2>
            <ul className="space-y-2 text-gray-300">
              <li>• Role-based access control (RBAC)</li>
              <li>• Route protection with middleware</li>
              <li>• Server-side permission checks</li>
              <li>• Client-side permission hooks</li>
              <li>• Dynamic route access</li>
            </ul>
          </div>

          {/* Roles */}
          <div className="rounded-xl bg-white/5 p-6 shadow-lg backdrop-blur">
            <h2 className="mb-4 text-lg font-semibold">User Roles</h2>
            <ul className="space-y-2">
              <li>
                <span className="font-semibold text-purple-400">
                  SUPER_ADMIN:
                </span>{" "}
                <span className="text-gray-300">Full system access</span>
              </li>
              <li>
                <span className="font-semibold text-green-400">ADMIN:</span>{" "}
                <span className="text-gray-300">User & team management</span>
              </li>
              <li>
                <span className="font-semibold text-yellow-400">MANAGER:</span>{" "}
                <span className="text-gray-300">Team-specific management</span>
              </li>
              <li>
                <span className="font-semibold text-blue-400">USER:</span>{" "}
                <span className="text-gray-300">Basic dashboard access</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Auth Status */}
        {user ? (
          <div className="mt-12 rounded-xl border border-green-500/20 bg-blue-500/10 p-6">
            <p className="mb-4 text-green-200">
              Welcome back <strong>Ravindu</strong>! You are loggine in as{" "}
              <strong className="text-green-200">USER</strong>
            </p>
            <Link href="/ashboard">Go to Dashbaord</Link>
          </div>
        ) : (
          <div className="mt-12 rounded-xl border border-blue-500/20 bg-blue-500/10 p-6">
            <p className="mb-4 text-gray-200">You are not logged in.</p>
            <div className="flex gap-4">
              <Link
                href={"/login"}
                className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium hover:bg-blue-700"
              >
                Login
              </Link>
              <Link
                href={"/register"}
                className="rounded-md border border-white/20 px-5 py-2 text-sm font-medium text-gray-300 hover:bg-white/10"
              >
                Register
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
