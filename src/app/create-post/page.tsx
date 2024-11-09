"use client"

import { useState } from 'react'
import { Check, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import * as Popover from '@radix-ui/react-popover'
import { Search } from "lucide-react"
import toast from "react-hot-toast"

const CategorySelect = ({ onValueChange, categories }: { onValueChange: (value: string) => void, categories: string[] }) => {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCategories = categories.filter(category =>
    category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSelect = (currentValue: string) => {
    setValue(currentValue)
    onValueChange(currentValue)
    setOpen(false)
    setSearchTerm("")
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="flex w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          role="combobox"
          aria-expanded={open}
        >
          {value || "Chọn danh mục..."}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="z-50 min-w-[200px] w-[--radix-popover-trigger-width] overflow-hidden rounded-md border bg-white shadow-md animate-in"
          align="start"
          side="bottom"
          sideOffset={5}
        >
          <div className="flex items-center border-b px-3 py-2">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-70" />
            <input
              placeholder="Tìm danh mục..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex h-8 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="max-h-[300px] overflow-auto">
            {filteredCategories.length === 0 ? (
              <div className="py-6 text-center text-sm">Không tìm thấy danh mục</div>
            ) : (
              filteredCategories.map((category) => (
                <div
                  key={category}
                  className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  onClick={() => handleSelect(category)}
                >
                  <span className="w-6">
                    {value === category && (
                      <Check className="h-4 w-4" />
                    )}
                  </span>
                  {category}
                </div>
              ))
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

// Mảng category mẫu - sau này sẽ được thay thế bằng API call
const predefinedCategories = [
  "Điện thoại & Máy tính bảng",
  "Laptop & Máy tính",
  "Thiết bị điện tử",
  "Thời trang nam",
  "Thời trang nữ",
  "Đồng hồ & Trang sức",
  "Giày dép",
  "Túi xách",
  "Sách & Truyện",
  "Đồ chơi & Game",
  "Đồ gia dụng",
  "Mỹ phẩm & Làm đẹp",
  "Thể thao & Du lịch",
  "Xe cộ",
  "Khác"
]

export default function CreatePost() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false)
  const [newCategory, setNewCategory] = useState("")
  const [newCategoryDescription, setNewCategoryDescription] = useState("")
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    condition: 'new',
    image: '',
    quantity: '1',
    available: true
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await axios.post('https://672f062d229a881691f19ad9.mockapi.io/api/items', {
        ...formData,
        owner_id: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      router.push('/')
      toast.success('Đăng bài mới thành công')
    } catch (error) {
      console.error('Error creating post:', error)
      toast.error('Đăng bài thất bại. Vui lòng thử lại sau')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCategoryChange = (value: string) => {
    if (value === "Khác") {
      setShowNewCategoryModal(true)
    } else {
      setFormData(prev => ({ ...prev, category: value }))
    }
  }

  const handleNewCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Đăng ký category mới:", {
      name: newCategory,
      description: newCategoryDescription
    })
    toast.success('Đăng ký danh mục mới thành công')
    setShowNewCategoryModal(false)
    setNewCategory("")
    setNewCategoryDescription("")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Đăng bài mới</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tên sản phẩm</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Mô tả</label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Danh mục</label>
              <CategorySelect 
                categories={predefinedCategories}
                onValueChange={handleCategoryChange}
              />
            </div>

            {/* Modal đăng ký category mới */}
            {showNewCategoryModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{margin: '0'}}>
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                  <h3 className="text-lg font-semibold mb-4">Đăng ký danh mục mới</h3>
                  <form onSubmit={handleNewCategorySubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Tên danh mục</label>
                      <Input
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="Nhập tên danh mục mới"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Mô tả danh mục</label>
                      <Textarea
                        value={newCategoryDescription}
                        onChange={(e) => setNewCategoryDescription(e.target.value)}
                        placeholder="Mô tả chi tiết về danh mục này"
                        required
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowNewCategoryModal(false)}
                      >
                        Hủy
                      </Button>
                      <Button
                        type="submit"
                        className="bg-orange-500 hover:bg-orange-600"
                      >
                        Gửi yêu cầu
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Tình trạng</label>
              <Select
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, condition: value }))}
                defaultValue="new"
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">Mới</SelectItem>
                  <SelectItem value="like-new">Như mới</SelectItem>
                  <SelectItem value="used">Đã sử dụng</SelectItem>
                  <SelectItem value="damaged">Hư hỏng</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Link hình ảnh</label>
              <Input
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://..."
                type="url"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Số lượng</label>
              <Input
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                type="number"
                min="1"
                required
              />
            </div>

            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={isLoading}>
              {isLoading ? 'Đang đăng...' : 'Đăng bài'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}