"use client";

import { apiClient } from "@/app/lib/apiClient";
import Link from "next/link";
import { useActionState } from "react";

export type RegisterState = {
  error?: string;
  success?: boolean;
};

const RegisterPage = () => {
  const [state, registerAction, isPending] = useActionState(
    async (
      prevState: RegisterState,
      formData: FormData,
    ): Promise<RegisterState> => { 

      //formData
      const name = formData.get("name") as string;
      const password = formData.get("password") as string;
      const email = formData.get("email") as string;
      const teamCode = formData.get("teamCode") as string;

      //try the api call
      try {
        await apiClient.register({
          name,
          email,
          password,
          teamCode: teamCode || undefined,
        });

        //after registering, we have redirect user to dashboard
        window.location.href = "/dashboard";
        return { success: true };
      } catch (error) {
        return {
          error: error instanceof Error ? error.message : "Registration Failed",
        };
      }
    },
    {
      error: undefined,
      success: undefined,
    },
  );

  return (
    <div className="w-full max-w-md rounded-2xl bg-linear-to-b from-[#1a2436] to-[#0f172a] p-8 shadow-xl border border-white/10">
      {/* Header */}
      <div className="header">
        <h2 className="text-2xl font-semibold text-white text-center">
          Create new account
        </h2>
        <p className="mt-2 text-sm text-center text-blue-400 cursor-pointer hover:underline">
          Or <Link href={"/login"}>Sign in to existing account</Link>
        </p>
      </div>
      {/* show if there is any error */}
      {state?.error && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 px-2 rounded-md">
          {state.error}
        </div>
      )}

      {/* Form */}
      <form action={registerAction} className="mt-8 space-y-5">
        {/* Full Name */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">Full Name</label>
          <input
            name="name"
            type="text"
            placeholder="Enter your full name"
            className="w-full rounded-lg bg-[#0b1220] border border-white/10 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* Email */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">Email</label>
          <input
            name="email"
            type="email"
            placeholder="Enter your email"
            className="w-full rounded-lg bg-[#0b1220] border border-white/10 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* Password */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">Password</label>
          <input
            name="password"
            type="password"
            placeholder="Create a password"
            className="w-full rounded-lg bg-[#0b1220] border border-white/10 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* Team Code */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">
            Team Code (Optional)
          </label>
          <input
            name="teamCode"
            type="text"
            placeholder="Enter team code if you have one"
            className="w-full rounded-lg bg-[#0b1220] border border-white/10 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            Leave empty if you don't have a team code
          </p>
        </div>
        {/* Button */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full mt-4 rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          {isPending ? "Creating Account..." : " Create account"}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
