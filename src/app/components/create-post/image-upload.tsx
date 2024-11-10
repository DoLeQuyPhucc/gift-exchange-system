import { useRef } from 'react'
import { Upload } from "lucide-react"
import Image from 'next/image'

interface ImageUploadProps {
  image: string
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const ImageUpload = ({ image, onImageChange }: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <div 
      className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer"
      onClick={() => fileInputRef.current?.click()}
    >
      {image ? (
        <div className="relative w-full aspect-square">
          <Image
            src={image}
            alt="Preview"
            fill
            className="object-cover rounded-lg"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64">
          <Upload className="h-12 w-12 text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">Click để tải ảnh lên</p>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onImageChange}
        className="hidden"
      />
    </div>
  )
}