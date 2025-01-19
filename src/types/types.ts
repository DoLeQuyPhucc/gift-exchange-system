export interface Product {
  id: string;
  name: string;
  description: string;
  category: {
    id: string;
    parentId: string;
    parentName: string;
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
  checking: {
    badWordsInName: string[];
    badWordsInDescription: string[];
    imageTags: {
      [key: string]: Array<{
        confidence: number;
        tag: {
          en: string;
        };
        isMatchingCategory: boolean;
      }>;
    };
  };
  requester: User | null;
  charitarian: User | null;
  transactionRequestIdOfItem: string | null;
  itemPendingRequestTo: number;
  pendingRequestForItem: number;
  rejectMessage: string | null;
}

interface User {
  id: string;
  name: string;
  image: string;
}

interface Address {
  addressId: string;
  address: string;
  addressCoordinates: string;
}

// interface SubInfoAddress {
//   addressId: string;
//   address: string;
//   addressCoordinates: AddressCoordinates;
// }

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
  transactionId: string;
  reporter: {
    id: string;
    name: string;
    image: string;
  };
  reported: {
    id: string;
    name: string;
    image: string;
  };
  reportReasons: ReportReason[];
  createdAt: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  requesterItem: {
    itemId: string;
    itemName: string;
    itemImages: string[];
    itemQuantity: number;
    itemVideo: string | null;
  };
  charitarianItem: {
    itemId: string;
    itemName: string;
    itemImages: string[];
    itemQuantity: number;
    itemVideo: string | null;
  };
}

export interface TimeRange {
  day: string;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
}

export interface TransactionResponse {
  isSuccess: boolean;
  code: number;
  data: Transaction[];
  message: string;
}

export interface Transaction {
  id: string;
  status: string;
  requestId: string;
  requestNote: string;
  requester: User;
  requesterItem: TransactionItem;
  charitarian: User;
  charitarianItem: TransactionItem;
  createdAt: string;
  updateAt: string;
  appointmentDate: string;
  requesterAddress: Address;
  requesterPhone: string;
  charitarianAddress: Address;
  charitarianPhone: string;
  rejectMessage: string | null;
  transactionImages: string[];
}

interface TransactionItem {
  itemId: string;
  itemName: string;
  itemVideo: string | null;
  itemImages: string[];
  itemQuantity: number;
}
export interface ReportResponse {
  isSuccess: boolean;
  code: number;
  data: ReportDetail;
  message: string;
}

export interface ReportDetail {
  id: string;
  transactionId: string;
  reporter: User;
  reported: User;
  reportReasons: ReportReason[];
  createdAt: string;
  status: string;
  requesterItem: TransactionItem | null;
  charitarianItem: TransactionItem | null;
}

interface ReportReason {
  id: string;
  parentId: string;
  reason: string;
  point: number;
}

export interface LoginResponse {
  isSuccess: boolean;
  code: number;
  data: {
    userId: string;
    username: string;
    email: string;
    role: string;
    token: string;
    refreshToken: string;
    profileURL: string;
  };
  message: string;
}

export interface Campaign {
  id: string;
  name: string;
  bannerPicture: string;
  startDate: string;
  endDate: string;
  status: string;
}

export interface CampaignResponse {
  isSuccess: boolean;
  code: number;
  data: {
    totalItems: number;
    pageSize: number;
    currentPage: number;
    data: Campaign[];
    totalPage: number;
  };
  message: string;
}

export interface CategoryCampaign {
  id: string;
  parentId: string;
  parentName: string;
  name: string;
}

export interface CampaignDetail {
  id: string;
  name: string;
  description: string;
  bannerPicture: string;
  startDate: string;
  endDate: string;
  status: string;
  createdAt: string;
  updateddAt: string | null;
  images: string[];
  categories: CategoryCampaign[];
}
