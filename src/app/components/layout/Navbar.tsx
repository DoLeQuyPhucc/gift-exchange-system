"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Bell, ShoppingCart, PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import { useAuth } from "@/app/hooks/useAuthentication";
import useSearchStore from "@/shared/store/SearchStore";

export default function Navbar() {
  const setSearchQuery = useSearchStore((state) => state.setSearchQuery);
  const searchQuery = useSearchStore((state) => state.searchQuery);
  const router = useRouter();
  // const [searchTerm, setSearchTerm] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const token = localStorage.getItem("token");
  const { logout } = useAuth();

  useEffect(() => {
    // Check if the user is logged in by checking for token in localStorage
    setIsLoggedIn(!!token);
  }, [token]);

  const login = () => {
    router.push("/auth");
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    toast.success("Đăng xuất thành công");
    router.push("/auth");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-orange-200 border-bz-10 shadow-md">
      <div className="container mx-auto w-4/5 py-2">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-orange-500">EStore</span>
          </Link>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <Input
                type="search"
                placeholder="Tìm kiếm sản phẩm..."
                className="pl-10 w-full bg-gray-50 rounded-lg focus:ring-2 focus:border-orange-300 focus:ring-orange-500 focus:outline-none dark:bg-orange-800"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {!isLoggedIn ? (
              <button
                className="py-2 px-4 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white disabled:from-orange-400 disabled:to-orange-500"
                onClick={login}
              >
                Đăng nhập
              </button>
            ) : (
              <>
                <div className="relative group">
                  <Link
                    href="/create-post"
                    className="p-2 hover:bg-gray-100 rounded-full flex items-center transition-all duration-300"
                  >
                    <PlusCircle size={20} />
                    <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Thêm sản phẩm
                    </span>
                  </Link>
                </div>

                <div className="relative group">
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <Bell size={20} />
                    <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Thông báo
                    </span>
                  </button>
                </div>

                <div className="relative group">
                  <Link
                    href="/cart"
                    className="p-2 hover:bg-gray-100 rounded-full flex items-center transition-all duration-300"
                  >
                    <ShoppingCart size={20} />
                    <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Giỏ hàng
                    </span>
                  </Link>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Link
                        href="#"
                        className="p-2 hover:bg-gray-100 rounded-full"
                      >
                        Tài khoản
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link
                        href="/products/my-products"
                        className="p-2 hover:bg-gray-100 rounded-full"
                      >
                        Sản phẩm của tôi
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link
                        href="/request-exchange"
                        className="p-2 hover:bg-gray-100 rounded-full"
                      >
                        Quản lí yêu cầu trao đổi
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link
                        href="#"
                        className="p-2 hover:bg-gray-100 rounded-full"
                      >
                        Đơn hàng
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <button
                        className="p-2 hover:bg-gray-100 rounded-full"
                        onClick={handleLogout}
                      >
                        Đăng xuất
                      </button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
