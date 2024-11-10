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
