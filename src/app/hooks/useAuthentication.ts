import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "../api/axiosInstance";
import toast from "react-hot-toast";

interface LoginResponse {
  isSuccess: boolean;
  code: number;
  data: {
    userId: string;
    username: string;
    email: string;
    role: string;
    token: string;
    refreshToken: string;
  };
  message: string;
}

interface AuthUser {
  email: string;
  password: string;
}

interface RegisterUser extends AuthUser {
  name: string;
  confirmedPassword: string;
}

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validatePassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,12})/;
    return passwordRegex.test(password);
  };

  const login = async ({ email, password }: AuthUser) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post<LoginResponse>(
        "authentication/login",
        {
          email,
          password,
        }
      );

      if (response.data.isSuccess) {
        const { token, refreshToken, userId, username, role } =
          response.data.data;

        // Store tokens securely
        localStorage.setItem("token", token);
        localStorage.setItem("refreshToken", refreshToken);

        // Store user info
        const userInfo = {
          userId,
          username,
          email,
          role,
        };
        localStorage.setItem("userInfo", JSON.stringify(userInfo));

        toast.success("Login successful!");
        router.push("/");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const register = async ({
    name,
    email,
    password,
    confirmedPassword,
  }: RegisterUser) => {
    if (password !== confirmedPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!validatePassword(password)) {
      toast.error(
        "Password must be 8-12 characters with at least one uppercase letter, one number, and one special character (!@#$%^&*)"
      );
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post("user/register", {
        username: name,
        email,
        password,
        confirmedPassword
      });

      if (response.data.isSuccess) {
        toast.success("Registration successful! Please login.");
        return true;
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    router.push("/auth");
  };

  return {
    login,
    register,
    logout,
    loading,
  };
};
