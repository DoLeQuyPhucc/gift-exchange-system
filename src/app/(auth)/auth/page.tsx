"use client";

import { useAuth } from "@/app/hooks/useAuthentication";
import React, { useState } from "react";


interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmedPassword?: string;
}

const AuthScreens: React.FC = () => {
  // Auth states
  const [isSignIn, setIsSignIn] = useState(true);
  const { login, loading } = useAuth();

  // Form states
  const [name, setName] = useState("");
  // const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});


  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!isSignIn && !name.trim()) {
      newErrors.name = "Name is required";
    }

    // if (!email.trim()) {
    //   newErrors.email = "Email is required";
    // } else if (!/\S+@\S+\.\S+/.test(email)) {
    //   newErrors.email = "Email is invalid";
    // }

    // if (!password) {
    //   newErrors.password = "Password is required";
    // }

    // if (!isSignIn) {
    //   if (!confirmedPassword) {
    //     newErrors.confirmedPassword = "Confirm password is required";
    //   } else if (password !== confirmedPassword) {
    //     newErrors.confirmedPassword = "Passwords do not match";
    //   }
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (isSignIn) {
      await login({ phone });
    } else {
      // const success = await register({ name, p, password, confirmedPassword });
      // if (success) {
      //   setIsSignIn(true);
      //   resetForm();
      // }
    }
  };

  const resetForm = () => {
    setName("");
    setPhone("");
    setPassword("");
    setConfirmedPassword("");
    setErrors({});
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
              Phone Number
            </label>
            <input
              type="number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-amber-500"
              } focus:border-transparent focus:ring-2 transition-colors`}
              placeholder="0123xxxxxx"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>
            <a href="#" className="text-sm text-amber-600 hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-amber-600 text-white py-2 px-4 rounded-lg hover:bg-amber-700 transition-all duration-200 disabled:bg-amber-300 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Loading..." : isSignIn ? "Sign In" : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthScreens;
