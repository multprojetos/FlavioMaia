export type PropertyType = 'apartment' | 'house' | 'commercial';
export type PropertyOperation = 'rent' | 'sale';
export type PropertyStatus = 'available' | 'rented' | 'sold';

export interface Property {
  id: string;
  title: string;
  description: string;
  type: PropertyType;
  operation: PropertyOperation;
  status?: PropertyStatus;
  price: number;
  location: {
    city: string;
    neighborhood: string;
    address: string;
  };
  details: {
    bedrooms: number;
    bathrooms: number;
    garages: number;
    area: number;
    features: string[];
  };
  images: string[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  image: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  phone: string;
  email: string;
  creci: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'editor';
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface SearchFilters {
  type?: PropertyType;
  operation?: PropertyOperation;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  minArea?: number;
}
