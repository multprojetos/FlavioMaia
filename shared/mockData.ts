import { Property, Testimonial, BlogPost, TeamMember } from './types';

export const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Apartamento Térreo no Centro - 1 Quarto',
    description: 'Apartamento térreo localizado no coração de Carmo. Ideal para solteiros ou casais. Possui 1 quarto ventilado, sala de estar aconchegante, cozinha prática, banheiro social e uma charmosa área interna privativa.',
    type: 'apartment',
    operation: 'rent',
    price: 500,
    status: 'available',
    location: { city: 'Carmo', neighborhood: 'Centro', address: 'Centro, Carmo - RJ' },
    details: { bedrooms: 1, bathrooms: 1, garages: 0, area: 45, features: ['Entrada Independente', 'Área de Serviço', 'Centro da Cidade'] },
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200'],
    featured: true,
    createdAt: '2026-02-10',
    updatedAt: '2026-02-18',
  },
  {
    id: '2',
    title: 'Casa Duplex Moderna no Bairro Nobre',
    description: 'Espetacular casa duplex com acabamento de alto padrão. 3 suítes amplas, sendo uma com closet e hidromassagem. Sala em 3 ambientes com pé direito duplo, cozinha em ilha integrada à área gourmet e piscina.',
    type: 'house',
    operation: 'sale',
    price: 850000,
    status: 'available',
    location: { city: 'Carmo', neighborhood: 'Bairro Nobre', address: 'Rua Principal, Bairro Nobre - Carmo - RJ' },
    details: { bedrooms: 3, bathrooms: 4, garages: 2, area: 220, features: ['Piscina', 'Área Gourmet', 'Suíte com Closet', 'Segurança 24h'] },
    images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200'],
    featured: true,
    createdAt: '2026-02-12',
    updatedAt: '2026-02-18',
  },
  {
    id: '3',
    title: 'Loja Comercial Ampla em Ponto Estratégico',
    description: 'Excelente oportunidade para o seu negócio. Loja com 80m², vitrine ampla em vidro temperado, pé direito alto, mezanino para escritório e 2 banheiros. Localizada no fluxo principal de pedestres e veículos.',
    type: 'commercial',
    operation: 'rent',
    price: 2500,
    status: 'available',
    location: { city: 'Carmo', neighborhood: 'Centro', address: 'Av. Brasil, Centro - Carmo - RJ' },
    details: { bedrooms: 0, bathrooms: 2, garages: 0, area: 80, features: ['Mezanino', 'Vitrine', 'Ar Condicionado', 'Ponto Nobre'] },
    images: ['https://images.unsplash.com/photo-1556740734-7f158223d58c?w=1200'],
    featured: true,
    createdAt: '2026-02-14',
    updatedAt: '2026-02-18',
  },
  {
    id: '4',
    title: 'Apartamento Luxo Vista Panorâmica',
    description: 'Apartamento de alto luxo com vista definitiva para as montanhas. Varanda gourmet envidraçada, 2 quartos (1 suíte), móveis planejados em todos os cômodos e acabamento em porcelanato.',
    type: 'apartment',
    operation: 'sale',
    price: 420000,
    status: 'available',
    location: { city: 'Cantagalo', neighborhood: 'Centro', address: 'Rua das Flores, Cantagalo - RJ' },
    details: { bedrooms: 2, bathrooms: 2, garages: 1, area: 75, features: ['Varanda Gourmet', 'Móveis Planejados', 'Vista Livre', 'Elevador'] },
    images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200'],
    featured: false,
    createdAt: '2026-02-15',
    updatedAt: '2026-02-18',
  },
  {
    id: '5',
    title: 'Casa de Campo com Pomar Formado',
    description: 'O refúgio perfeito para os finais de semana. Casa estilo rústico com varandão, fogão a lenha, diversas árvores frutíferas e pequeno riacho nos fundos. Terreno de 2.000m² totalmente cercado.',
    type: 'house',
    operation: 'sale',
    price: 350000,
    status: 'available',
    location: { city: 'Carmo', neighborhood: 'Zona Rural', address: 'Estrada da Batalha, Carmo - RJ' },
    details: { bedrooms: 2, bathrooms: 1, garages: 5, area: 120, features: ['Fogão a Lenha', 'Pomar', 'Riacho', 'Muita Natureza'] },
    images: ['https://images.unsplash.com/photo-1500382017468-9049fee74a62?w=1200'],
    featured: false,
    createdAt: '2026-02-16',
    updatedAt: '2026-02-18',
  }
];

export const mockTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Ricardo Silva',
    role: 'Comprador',
    content: 'O atendimento da Flávio Maia Imóveis foi excepcional. Encontrei a casa dos meus sonhos em menos de um mês e todo o processo burocrático foi guiado com muita transparência.',
    rating: 5,
  },
  {
    id: '2',
    name: 'Ana Oliveira',
    role: 'Locatária',
    content: 'Sempre tive receio de alugar imóveis, mas a equipe me passou total segurança. O apartamento é exatamente como mostravam as fotos e o suporte pós-venda é excelente.',
    rating: 5,
  },
  {
    id: '3',
    name: 'Marcos Santos',
    role: 'Investidor',
    content: 'Excelente consultoria imobiliária. Me ajudaram a identificar as melhores oportunidades de investimento na região serrana. Recomendo fortemente!',
    rating: 5,
  },
];

export const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: '5 Dicas para Valorizar seu Imóvel antes da Venda',
    excerpt: 'Pequenas reformas e cuidados que podem aumentar significativamente o valor de mercado da sua propriedade.',
    content: '...',
    author: 'Flávio Maia',
    publishedAt: '2026-02-10',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
  }
];

export const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Flávio Maia',
    role: 'Corretor & Gestor',
    bio: 'Mais de 20 anos de experiência no mercado imobiliário da região serrana.',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400',
    phone: '5522988129414',
    email: 'contato@flaviomaia.com.br',
    creci: '12345/RJ',
  }
];
