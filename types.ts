export type Category = 'package' | 'car' | 'cottage';

export interface BaseItem {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: Category;
}

export interface TravelPackage extends BaseItem {
  category: 'package';
  duration: string;
  location: string;
}

export interface Car extends BaseItem {
  category: 'car';
  passengers: number;
  transmission: 'Automatic' | 'Manual';
  fuelType: 'Petrol' | 'Diesel' | 'Electric';
}

export interface Cottage extends BaseItem {
  category: 'cottage';
  guests: number;
  beds: number;
  amenities: string[];
  additionalImages?: string[];
}

export type AnyItem = TravelPackage | Car | Cottage;

export interface Booking {
  id: string;
  itemId: string;
  itemTitle: string;
  category: Category;
  customerName: string;
  phone: string;
  startDate: string;
  endDate?: string;
  pickupLocation?: string;
  timestamp: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface AdminConfig {
  password: string;
  whatsappNumber: string;
}

export interface AppState {
  packages: TravelPackage[];
  cars: Car[];
  cottages: Cottage[];
  bookings: Booking[];
  config: AdminConfig;
}