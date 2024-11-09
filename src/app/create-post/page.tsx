"use client"
import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function CreatePost() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
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
        owner_id: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      router.push('/')
    } catch (error) {
      console.error('Error creating post:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="container mx-auto px-4 pt-20">
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
              <Select 
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electronics">Điện tử</SelectItem>
                  <SelectItem value="clothing">Thời trang</SelectItem>
                  <SelectItem value="books">Sách</SelectItem>
                  <SelectItem value="other">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>

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

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Đang đăng...' : 'Đăng bài'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}