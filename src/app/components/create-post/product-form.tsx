import { Button } from "@/components/ui/button"
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { WritingGuide } from './writing-guide'
import { CategoryAttribute } from "@/app/types/categoryAttribute"
import { AttributeValue } from "@/app/types/attributeValue"
import { FormData } from "@/app/types/form"
import { Category } from "@/app/types/category"
import CategorySelect from "./category-select"

interface ProductFormProps {
  formData: FormData
  categories: Category[]
  isLoading: boolean
  currentCategoryAttributes: CategoryAttribute[]
  attributeValues: AttributeValue[]
  showGuideTitle: boolean
  showGuideContent: boolean
  provinces: { code: string; name: string }[]
  districts: { code: string; name: string }[]
  wards: { code: string; name: string }[]
  onFormChange: (name: string, value: any) => void
  onSubmit: (e: React.FormEvent) => void
  onFocusTitle: () => void
  onBlurTitle: () => void
  onFocusContent: () => void
  onBlurContent: () => void
  onAddressClick: () => void
}

export const ProductForm = ({
  formData,
  isLoading,
  currentCategoryAttributes,
  attributeValues,
  showGuideTitle,
  showGuideContent,
  categories,
  provinces,
  districts,
  wards,
  onFormChange,
  onSubmit,
  onFocusTitle,
  onBlurTitle,
  onFocusContent,
  onBlurContent,
  onAddressClick,
}: ProductFormProps) => {
  const getAttributeValues = (attributeId: string) => {
    return attributeValues
      .filter(av => av.attribute_id === attributeId)
      .map(av => av.value)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          Danh mục
          <span className='text-red-500'>*</span>
        </label>
        <CategorySelect 
          categories={categories}
          onValueChange={(value) => onFormChange('category', value)}
        />
      </div>

      {formData.category && (
        <>
          {/* Dynamic attributes based on category */}
          {currentCategoryAttributes.length > 0 && (
            <div className="space-y-4 border-t pt-4">
              <div className="text-lg font-semibold">
                Thông tin chi tiết {formData.category}
              </div>
              {currentCategoryAttributes.map(attr => {
                const values = getAttributeValues(attr.id)
                return (
                  <div key={attr.id}>
                    <label className="block text-sm font-medium mb-1">
                      {attr.attribute_name}
                      {attr.is_required && <span className="text-red-500">*</span>}
                    </label>
                    <Select
                      onValueChange={(value) => onFormChange(`attributes.${attr.id}`, value)}
                      required={attr.is_required}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={`Chọn ${attr.attribute_name.toLowerCase()}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {values.map((value, index) => (
                          <SelectItem key={index} value={value}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )
              })}
            </div>
          )}

          <div className="space-y-4 border-t pt-4">
            <div className="text-lg font-semibold">
              Thông tin cơ bản
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Tình trạng
                <span className="text-red-500">*</span>
              </label>
              <Select
                onValueChange={(value) => onFormChange('condition', value)}
                defaultValue="new"
                required
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
              <label className="block text-sm font-medium mb-1">
                Số lượng
                <span className="text-red-500">*</span>
              </label>
              <Input
                name="quantity"
                value={formData.quantity}
                onChange={(e) => onFormChange('quantity', e.target.value)}
                type="number"
                min="1"
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="available"
                checked={formData.available}
                onCheckedChange={(checked) => onFormChange('available', checked)}
              />
              <label
                htmlFor="available"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Tôi muốn trao tặng miễn phí
              </label>
            </div>
          </div>

          <div className="space-y-4 border-t pt-4">
            <div className="text-lg font-semibold">
              Tiêu đề và Mô tả chi tiết
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Tiêu đề tin đăng
                <span className="text-red-500">*</span>
              </label>
              <Input
                name="name"
                value={formData.name}
                onChange={(e) => onFormChange('name', e.target.value)}
                onBlur={onBlurTitle}
                onFocus={onFocusTitle}
                max={50}
                required
              />
              {showGuideTitle && <WritingGuide type="title" />}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Mô tả chi tiết sản phẩm
                <span className="text-red-500">*</span>
              </label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={(e) => onFormChange('description', e.target.value)}
                onBlur={onBlurContent}
                onFocus={onFocusContent}
                required
              />
              {showGuideContent && <WritingGuide type="content" />}
            </div>
          </div>

          <div className="space-y-4 border-t pt-4 mb-20 !mb-20">
            <div className="text-lg font-semibold">
              Thông tin người bán
            </div>

            <div>
              <Input
                value={formData.address}
                readOnly
                placeholder="Phường, Quận/Huyện, Tỉnh/Thành phố"
                onClick={onAddressClick}
                className="mt-2"
              />
            </div>
          </div>

          {/* Form actions */}
          <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t shadow-lg">
            <div className="container mx-auto max-w-4xl flex justify-between space-x-4">
              <Button
                type="button"
                className="w-full bg-white-500 hover:bg-white-600 text-black"
                disabled={isLoading}
              >
                Xem trước bài đăng
              </Button>
              
              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600"
                disabled={isLoading}
              >
                {isLoading ? 'Đang đăng...' : 'Đăng bài'}
              </Button>
            </div>
          </div>
        </>
      )}
    </form>
  )
}