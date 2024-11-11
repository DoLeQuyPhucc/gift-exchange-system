import { useRef } from 'react';
import { Upload } from "lucide-react";
import Image from 'next/image';

interface ImageUploadProps {
  imageUrls: string[];
  onImageUpload: (files: File[]) => void;
}

export const ImageUpload = ({ imageUrls, onImageUpload }: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onImageUpload(Array.from(e.target.files));
    }
  };

  return (
    <div
      className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer"
      onClick={() => fileInputRef.current?.click()}
    >
      {imageUrls.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {imageUrls.map((url, index) => (
            <div key={index} className="relative w-full aspect-square">
              <Image
                src={url}
                alt={`Image ${index}`}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          ))}
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
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};