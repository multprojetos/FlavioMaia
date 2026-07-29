import { Property, Testimonial, BlogPost, TeamMember } from './types';

export const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Apartamento Térreo no Centro - 1 Quarto',
    description: 'Apartamento térreo no Centro com 1 quarto, sala, cozinha, banheiro e área interna.',
    type: 'apartment',
    operation: 'rent',
    price: 500,
    location: { city: 'Carmo', neighborhood: 'Centro', address: 'Centro, Carmo - RJ' },
    details: { bedrooms: 1, bathrooms: 1, garages: 0, area: 45, features: ['Entrada Independente'] },
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
    featured: true,
    createdAt: '2026-02-10',
    updatedAt: '2026-02-18',
  },
];

export const mockTestimonials: Testimonial[] = [];
export const mockBlogPosts: BlogPost[] = [];
export const mockTeamMembers: TeamMember[] = [];
