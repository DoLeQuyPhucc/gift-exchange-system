import Link from 'next/link'
import { Search, Bell, ShoppingCart, PlusCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-orange-500">EStore</span>
          </Link>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input placeholder="Tìm kiếm sản phẩm..." className="pl-10 w-full bg-gray-50" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Link href="/create-post">
              <Button variant="ghost" size="icon" className="hover:bg-gray-100 rounded-full">
                <PlusCircle size={20} />
              </Button>
            </Link>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Bell size={20} />
            </button>
            <Link href="/cart" className="p-2 hover:bg-gray-100 rounded-full">
              <ShoppingCart size={20} />
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Tài khoản</DropdownMenuItem>
                <DropdownMenuItem>Đơn hàng</DropdownMenuItem>
                <DropdownMenuItem>Đăng xuất</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  )
}