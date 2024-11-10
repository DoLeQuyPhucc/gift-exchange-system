"use client";

import { useRouter } from "next/navigation";
// import axiosInstance from '../../api/axiosInstance';
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
}

const AuthScreens: React.FC = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [loading, setLoading] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const router = useRouter();

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!isSignIn && !name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    login(email);

    setTimeout(() => {
      setLoading(false);
      // Reset form after successful submission
      if (!isSignIn) {
        setName("");
      }
      setEmail("");
      setPassword("");
    }, 1500);
  };

  const login = async (email: string) => {
    try {
      //   const response = await axios.post('/auth', { email });
      //   console.log(response.data.user_id);
      //   localStorage.setItem('userId', response.data.user_id);
      //   localStorage.setItem('userRole', 'user');

      setTimeout(() => {
        setLoading(false);
        // Reset form after successful submission
        if (!isSignIn) {
          setName("");
        }
        setEmail("");
        setPassword("");
        localStorage.setItem("userId", "1");
        toast.success("Đăng nhập thành công!");
        router.push("/");
      }, 1500);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {/* Logo placeholder */}
        <div className="w-16 h-16 bg-amber-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent mb-2">
            {isSignIn ? "Welcome Back!" : "Create Account"}
          </h2>
          <p className="text-gray-600">
            {isSignIn
              ? "Enter your credentials to access your account"
              : "Fill in the form to create your account"}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex mb-8 bg-gray-100 rounded-lg p-1">
          <button
            className={`flex-1 py-2 px-4 rounded-md transition-all duration-200 ${
              isSignIn
                ? "bg-white text-amber-600 shadow-sm"
                : "text-gray-600 hover:text-amber-600"
            }`}
            onClick={() => setIsSignIn(true)}
          >
            Sign In
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-md transition-all duration-200 ${
              !isSignIn
                ? "bg-white text-amber-600 shadow-sm"
                : "text-gray-600 hover:text-amber-600"
            }`}
            onClick={() => setIsSignIn(false)}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isSignIn && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.name
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-amber-500"
                } focus:border-transparent focus:ring-2 transition-colors`}
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-amber-500"
              } focus:border-transparent focus:ring-2 transition-colors`}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-amber-500"
                } focus:border-transparent focus:ring-2 transition-colors pr-10`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-amber-600 transition-colors"
              >
                {showPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          {isSignIn && (
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-amber-500 border-gray-300 rounded focus:ring-amber-500"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <a
                href="#"
                className="text-sm text-amber-600 hover:text-amber-700 font-medium"
              >
                Forgot password?
              </a>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-2 px-4 rounded-lg font-medium hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <svg className="w-5 h-5 mx-auto animate-spin" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : isSignIn ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthScreens;
