import { Button } from "@/components/ui/button"
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import * as Dialog from '@radix-ui/react-dialog'
import { FormData } from "@/app/types/form"

interface LocationDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  formData: FormData
  provinces: Array<{ code: string; name: string }>
  districts: Array<{ code: string; name: string }>
  wards: Array<{ code: string; name: string }>
  onFormChange: (name: string, value: string) => void
  onSave: () => void
}

export const LocationDialog = ({
  isOpen,
  onOpenChange,
  formData,
  provinces,
  districts,
  wards,
  onFormChange,
  onSave,
}: LocationDialogProps) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>                       
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <Dialog.Title className="text-lg font-bold">Thông tin người bán</Dialog.Title>
          
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tỉnh, thành phố</label>
              <Select onValueChange={(value) => onFormChange('province', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn tỉnh/thành phố" />
                </SelectTrigger>
                <SelectContent>
                  {provinces.map((province) => (
                    <SelectItem key={province.code} value={province.code}>
                      {province.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Quận, huyện, thị xã</label>
              <Select onValueChange={(value) => onFormChange('district', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn quận/huyện" />
                </SelectTrigger>
                <SelectContent>
                  {districts.map((district) => (
                    <SelectItem key={district.code} value={district.code}>
                      {district.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phường, xã, thị trấn</label>
              <Select onValueChange={(value) => onFormChange('ward', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn phường/xã" />
                </SelectTrigger>
                <SelectContent>
                  {wards.map((ward) => (
                    <SelectItem key={ward.code} value={ward.code}>
                      {ward.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Địa chỉ cụ thể</label>
              <Input
                name="specificAddress"
                value={formData.specificAddress}
                onChange={(e) => onFormChange('specificAddress', e.target.value)}
                placeholder="Số nhà, tên đường..."
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-2">
            <Button variant="secondary" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button onClick={() => onOpenChange(false)}>
              Lưu
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}