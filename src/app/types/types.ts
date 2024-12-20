export interface Product {
  id: string;
  name: string;
  description: string;
  category: {
    id: string;
    parentId: string;
    name: string;
  };
  desiredCategory: {
    id: string;
    parentId: string;
    name: string;
  } | null;
  condition: string;
  isGift: boolean;
  availableTime: string;
  owner_Name: string;
  owner_id: string;
  profilePicture: string;
  available: boolean;
  createdAt: string;
  expiresAt: string;
  updatedAt: string | null;
  images: string[];
  video: string | null;
  quantity: number;
  dateRemaining: number;
  status: string;
  address: Address;
  itemRequestTo: number;
  requestForItem: number;
}

interface Address {
  addressId: string;
  address: string;
  addressCoordinates: string;
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
  charitarianItem: {
    itemId: string;
    itemName: string;
    itemImages: string[];
    itemQuantity: number;
    itemVideo: string | null;
  };
  createdAt: string;
  reportReasons: string;
  reported: {
    id: string;
    name: string;
    image: string;
  };
  reporter: {
    id: string;
    name: string;
    image: string;
  };
  requesterItem: {
    itemId: string;
    itemName: string;
    itemImages: string[];
    itemQuantity: number;
    itemVideo: string | null;
  } | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  transactionId: string;
}

export interface TimeRange {
  day: string;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
}
