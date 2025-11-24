
export interface SeatInfo {
  total: number;
  available: number;
}

export interface DetailedSeats {
  total: SeatInfo;
  outlet: SeatInfo;
  window: SeatInfo;
  noAc: SeatInfo;
}

export type MenuCategory = '咖啡' | '茶飲' | '輕食' | '甜點';

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: MenuCategory;
  description: string;
}

export interface Review {
  id: number;
  author: string;
  rating: number;
  comment: string;
}

export interface Cafe {
  id: number;
  name: string;
  address: string;
  hours: string;
  imageUrl: string;
  description: string;
  seats: DetailedSeats;
  menu: MenuItem[];
  reviews: Review[];
  averageRating: number;
  reviewGrowth: number; // e.g., 0.1 for 10%
  tags: string[];
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface ChatMessage {
  id: number;
  sender: 'user' | 'assistant';
  text: string;
  recommendations?: Cafe[];
}