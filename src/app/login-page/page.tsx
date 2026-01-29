"use client";
import { loginUser } from "@/services/AuthServices";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BarLoader } from "react-spinners";
import { toast } from "sonner";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target as HTMLFormElement;
    const username = form.username.value;
    const password = form.password.value;

    if (!username || !password) {
      setError("Username and password are required.");
      return;
    }

    try {
      const data = await loginUser({ username, password });
      if (data?.success) {
        toast.success(data?.message);
        setLoading(false);
        router.push("/");
      } else {
        setError(data?.message);
        setLoading(false);
      }
    } catch (error) {
      console.log("Error", error);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-sky-500 via-teal-600 to-purple-700"></div>

      {/* Floating bubbles animation */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/10 backdrop-blur-sm"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 20 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-lg mx-3 relative z-50">
        <h2 className="text-center text-3xl font-bold text-gray-800">Login</h2>

        {error && <p className="text-center text-sm text-red-500">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              defaultValue={"super-admin"}
              placeholder="Enter your user name"
              className="w-full rounded-lg border border-gray-300 p-3 text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              defaultValue={"9876543210"}
              placeholder="Enter your password"
              className="w-full rounded-lg border border-gray-300 p-3 text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className={`${
              loading
                ? "bg-slate-200 border border-amber-400 hover:bg-amber-700 "
                : "bg-teal-600 hover:bg-teal-700 cursor-pointer"
            } w-full rounded-lg  p-3 text-white transition`}
            disabled={loading}
          >
            {loading ? (
              <BarLoader color="#47b33e" />
            ) : (
              <span className="font-bold text-md">Login</span>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Don not have an account?
          <span className="text-blue-500 ms-2">We are sorry!</span>
        </p>
      </div>

      {/* Add these to your globals.css */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
