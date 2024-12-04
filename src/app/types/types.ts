export interface Product {
  id: string;
  name: string;
  description: string;
  subCategory: {
    id: string;
    subCategoryName: string;
    category: {
      id: string;
      name: string;
    };
  };
  desiredSubCategory?: {
    id?: string;
    subCategoryName?: string;
    category?: {
      id?: string;
      name?: string;
    };
  };
  condition: string;
  isGift: boolean;
  availableTime: string;
  owner_Name: string;
  owner_id: string;
  profilePicture: string;
  available: boolean;
  createdAt: string;
  expiresAt: string;
  updatedAt: string;
  images: string[];
  quantity: number;
  dateRemaining: number;
  status: string;
  address?: SubInfoAddress;
}

interface SubInfoAddress {
  addressId: string;
  address: string;
  addressCoordinates: AddressCoordinates;
}

export interface AddressCoordinates {
  latitude: string;
  longitude: string;
}

export interface ProductAttribute {
  id: string;
  productId: string;
  attributeId: string;
  value: string;
}

export interface ApiResponse {
  isSuccess: boolean;
  code: number;
  data: Product;
  message: string;
}

export interface FormData {
  [key: string]: any;
  name: string;
  description: string;
  category: string;
  categoryId: string;
  condition: string;
  image: string;
  quantity: number;
  available: boolean;
  attributes: Record<string, any>;
  province: string;
  district: string;
  ward: string;
  specificAddress: string;
  address: string;
  itemAttribute: {
    attributeId: string;
    value: string;
  }[];
  images: string[];
}

export interface CategoryAttribute {
  id: string;
  categoryId: string;
  attributeName: string;
  data_type: string;
  is_required: boolean;
}

export interface Category {
  id: string;
  name: string;
}

export interface AttributeValue {
  id: string;
  product_id: string;
  attribute_id: string;
  value: string;
}

export interface Report {
  id: string;
  reporterName: string;
  reportedName: string;
  reportReasons: string;
  createdAt: string;
}
