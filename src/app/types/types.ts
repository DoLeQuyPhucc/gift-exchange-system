export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  condition: string;
  owner_id: string;
  email: string;
  profilePicture: string;
  images: string[];
  available: boolean;
  createdAt: string;
  updatedAt: string;
  itemAttributeValues: ProductAttribute[];
  quantity: number;
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
  condition: string;
  image: string;
  quantity: string;
  available: boolean;
  attributes: Record<string, any>;
  province: string;
  district: string;
  ward: string;
  specificAddress: string;
  address: string;
}

export interface CategoryAttribute {
  id: string;
  category_id: string;
  attribute_name: string;
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
