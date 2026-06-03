import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";

type Props = {
  searchParams: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const error = params.error;
  const success = params.success;

  let errorMessage = "";
  if (error) {
    if (error === "CredentialsSignin") {
      errorMessage = "Invalid email or password. Please try again.";
    } else {
      errorMessage = "An authentication error occurred. Please try again.";
    }
  }

  let successMessage = "";
  if (success === "registered") {
    successMessage = "Account created successfully! You can now sign in.";
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-zinc-950">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          {/* Logo Icon */}
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg shadow-emerald-500/20 mb-4">
            A
          </div>
          <h2 className="mt-2 text-center text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-600 dark:text-zinc-400">
            Aasa MedChem Inventory Management System
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-zinc-900 py-8 px-6 shadow-xl shadow-zinc-200/50 dark:shadow-none border border-zinc-200/50 dark:border-zinc-800 rounded-2xl">
          {successMessage && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium">
              {errorMessage}
            </div>
          )}

          <form
            action={async (formData) => {
              "use server";
              try {
                await signIn("credentials", {
                  email: formData.get("email"),
                  password: formData.get("password"),
                  redirectTo: "/",
                });
              } catch (err: any) {
                // If it is a Next.js redirect, rethrow it so the browser actually redirects
                if (err instanceof Error && err.message === "NEXT_REDIRECT") {
                  throw err;
                }
                if (err && typeof err === "object" && "digest" in err && String(err.digest).startsWith("NEXT_REDIRECT")) {
                  throw err;
                }
                // For any other error (such as CredentialsSignin), redirect to login with query param
                redirect("/login?error=CredentialsSignin");
              }
            }}
            className="space-y-6"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@medchem.com"
                className="block w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-150 text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••"
                className="block w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-150 text-sm"
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 active:scale-[0.98] transition-all duration-150 cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </form>

          {/* Test Credentials Display */}
          <div className="mt-8 pt-6 border-t border-zinc-200/50 dark:border-zinc-800">
            <h3 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">
              🧪 Test Credentials
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center p-2 rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/30 dark:border-zinc-800/30">
                <span className="text-zinc-600 dark:text-zinc-400 font-medium">Admin:</span>
                <code className="text-xs text-emerald-600 dark:text-emerald-400 font-mono">
                  admin@medchem.com / admin123
                </code>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/30 dark:border-zinc-800/30">
                <span className="text-zinc-600 dark:text-zinc-400 font-medium">Seller:</span>
                <code className="text-xs text-emerald-600 dark:text-emerald-400 font-mono">
                  seller@medchem.com / seller123
                </code>
              </div>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center text-sm">
            <span className="text-zinc-500 dark:text-zinc-400">Don't have an account? </span>
            <Link
              href="/signup"
              className="font-semibold text-emerald-600 dark:text-emerald-450 hover:underline"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}