import { useRef } from 'react';
import { Upload } from "lucide-react";
import * as Tooltip from '@radix-ui/react-tooltip';
import Image from 'next/image';
import LoadingSpinner from '../spinner-loading/spinnerLoading';


interface ImageUploadProps {
  imageUrls: string[];
  onImageUpload: (files: File[]) => void;
  onDeleteImage: (index: number) => void;
  isLoading: boolean;
  isDisabled?: boolean;
}

export const ImageUpload = ({ imageUrls, onImageUpload, onDeleteImage, isLoading, isDisabled }: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onImageUpload(Array.from(e.target.files));
    }
  };

  const getImageLabel = (index: number) => {
    if (index === 0) return "Hình bìa";
    return `Hình ${index + 1}`;
  };

  const UploadBox = () => (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <div 
            className={`border-2 border-dashed rounded-lg p-4 text-center 
              ${isDisabled 
                ? 'border-gray-200 cursor-not-allowed bg-gray-50' 
                : 'border-gray-300 cursor-pointer hover:border-gray-400'
              }`}
            style={{ width: '150px', height: '150px' }}
            onClick={() => !isDisabled && fileInputRef.current?.click()}
          >
            <div className="flex flex-col items-center justify-center h-full">
              <Upload className={`h-8 w-8 mb-2 ${isDisabled ? 'text-gray-300' : 'text-gray-400'}`} />
              <p className={`text-xs ${isDisabled ? 'text-gray-400' : 'text-gray-600'}`}>
                {isDisabled 
                  ? 'Vui lòng chọn danh mục trước'
                  : 'Click để tải ảnh lên'
                }
              </p>
            </div>
          </div>
        </Tooltip.Trigger>
        {isDisabled && (
          <Tooltip.Portal>
            <Tooltip.Content
              className="bg-black text-white text-xs rounded px-2 py-1"
              sideOffset={5}
            >
              Vui lòng chọn danh mục trước khi tải ảnh lên
              <Tooltip.Arrow className="fill-black" />
            </Tooltip.Content>
          </Tooltip.Portal>
        )}
      </Tooltip.Root>
    </Tooltip.Provider>
  );

  return (
    <div className="grid grid-cols-[150px_1fr] gap-4">
      <div>
        {isLoading ? (
          <div className="flex items-center justify-center" style={{ width: '150px', height: '150px' }}>
            <LoadingSpinner width="8" height="8" color="orange-500" />
          </div>
        ) : (
          <UploadBox />
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

      <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4">
        {imageUrls.map((url, index) => (
          <div 
            key={index}
            className="relative"
            style={{ width: '150px', height: '150px' }}
          >
            <Image
              src={url}
              alt={`Uploaded Image ${index + 1}`}
              layout="fill"
              className="object-cover rounded-lg"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteImage(index);
              }}
              className="absolute top-0 right-0 m-2 p-1 bg-black bg-opacity-50 rounded-full text-white text-xs"
            >
              X
            </button>
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-bl-lg rounded-br-lg">
              {getImageLabel(index)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};