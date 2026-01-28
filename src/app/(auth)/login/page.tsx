"use client";

import { apiClient } from "@/app/lib/apiClient";
import Link from "next/link";
import { useActionState } from "react";

export type LoginState = {
  error?: string;
  success?: boolean;
};

const LoginPage = () => {
  const [state, loginAction, isPending] = useActionState(
    async (prevState: LoginState, formData: FormData): Promise<LoginState> => {
      //formData
      const password = formData.get("password") as string;
      const email = formData.get("email") as string;
      
      //try the api call
      try {
        await apiClient.login(email, password);
        //after registering, we have redirect user to dashboard
        window.location.href = "/dashboard";
        return { success: true };
      } catch (error) {
        return {
          error: error instanceof Error ? error.message : "Login Failed",
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
        <h2 className="text-2xl font-semibold text-white text-center">Login</h2>
        <p className="mt-2 text-sm text-center text-blue-400 cursor-pointer hover:underline">
          Or <Link href={"/register"}>Create a new account</Link>
        </p>
      </div>
      {/* show if there is any error */}
      {state?.error && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 px-2 rounded-md">
          {state.error}
        </div>
      )}

      {/* Form */}
      <form action={loginAction} className="mt-8 space-y-5">
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
        {/* Button */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full mt-4 rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          {isPending ? "Signing in..." : " Sign in"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
