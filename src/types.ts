export interface ProductVariant {
  name: string;
  price: number;
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating?: number;
  soldCount?: string;
  isBestseller?: boolean;
  variants?: ProductVariant[];
  optionGroups?: OptionGroup[];
}

export interface OptionChoice {
  name: string;
  priceDelta: number;
}

export interface OptionGroup {
  name: string;
  required: boolean;
  multiple: boolean;
  choices: OptionChoice[];
}

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: string;
  categories: string[];
  distance: string;
  deliveryTime: string;
  deliveryFee: string;
  address: string;
  isPromo?: boolean;
  menu: FoodItem[];
}

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  restaurantName: string;
  restaurantImage: string;
  date: string;
  items: OrderItem[];
  total: number;
  status: 'DELIVERING' | 'COMPLETED' | 'CANCELLED';
  eta?: string;
  paymentMethod?: string;
}
