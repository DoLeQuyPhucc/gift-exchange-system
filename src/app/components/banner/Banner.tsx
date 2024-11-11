"use client";

import Image from "next/image";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import useSearchStore from "@/shared/store/SearchStore";


export default function Banner() {
  const setSearchQuery = useSearchStore((state) => state.setSearchQuery);
  const searchQuery = useSearchStore((state) => state.searchQuery);
  return (
    <div
      className="relative h-[400px] rounded-xl overflow-hidden mb-8 group"
      style={{ perspective: "1000px" }}
    >
      <Image
        src="/banner.jpg"
        alt="Banner"
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30 flex items-center justify-center">
        <div className="text-center text-white max-w-2xl px-4">
          <h1 className="text-5xl font-bold mb-6 animate-fade-in">
            Khám phá sản phẩm
          </h1>
          <p className="text-xl mb-8">Chất lượng tạo nên thương hiệu</p>
          <div className="relative">
            <Input
              type="search"
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full pl-12 bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-white/70"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
          </div>
        </div>
      </div>
    </div>
  );
}
