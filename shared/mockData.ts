import { Property, Testimonial, BlogPost, TeamMember } from './types';

export const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Apartamento Térreo no Centro',
    description: 'Apartamento térreo localizado no coração de Carmo. Ideal para solteiros ou casais. Possui 1 quarto ventilado, sala de estar aconchegante, cozinha prática, banheiro social e uma charmosa área interna privativa.',
    type: 'apartment',
    operation: 'rent',
    price: 650,
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
    title: 'Casa Familiar Confortável',
    description: 'Casa de um andar muito bem conservada, com quintal gramado e portão manual. 3 quartos sendo uma suíte simples. Localizada em rua tranquila com bons vizinhos. Perfeita para quem busca sossego.',
    type: 'house',
    operation: 'sale',
    price: 280000,
    status: 'available',
    location: { city: 'Carmo', neighborhood: 'Cordeiro', address: 'Rua das Palmeiras, Cordeiro - Carmo - RJ' },
    details: { bedrooms: 3, bathrooms: 2, garages: 1, area: 110, features: ['Quintal', 'Murada', 'Rua calçada'] },
    images: ['https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1200'],
    featured: true,
    createdAt: '2026-02-12',
    updatedAt: '2026-02-18',
  },
  {
    id: '3',
    title: 'Casa de Vila charmosa em Cantagalo',
    description: 'Excelente opção de baixo custo. Casa pequena e funcional em vila fechada. Sala, cozinha, quarto amplo e pequena área de serviço. Excelente estado de pintura e conservação.',
    type: 'house',
    operation: 'rent',
    price: 800,
    status: 'available',
    location: { city: 'Cantagalo', neighborhood: 'Centro', address: 'Rua Getúlio Vargas, Centro - Cantagalo - RJ' },
    details: { bedrooms: 1, bathrooms: 1, garages: 0, area: 55, features: ['Segurança', 'Vila Calma', 'Próximo ao comércio'] },
    images: ['https://images.unsplash.com/photo-1449844908441-8829872d2607?w=1200'],
    featured: true,
    createdAt: '2026-02-14',
    updatedAt: '2026-02-18',
  },
  {
    id: '4',
    title: 'Casa Padrão com Garagem Coberta',
    description: 'Imóvel clássico de bairro. Sala ampla, 2 quartos, cozinha com armários simples e área externa nos fundos. Garagem coberta para um carro. Pronta para morar.',
    type: 'house',
    operation: 'sale',
    price: 215000,
    status: 'available',
    location: { city: 'Carmo', neighborhood: 'Bela Vista', address: 'Rua Principal, Bela Vista - Carmo - RJ' },
    details: { bedrooms: 2, bathrooms: 1, garages: 1, area: 90, features: ['Garagem Coberta', 'Área de Serviço', 'Próximo a Escola'] },
    images: ['https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=1200'],
    featured: false,
    createdAt: '2026-02-15',
    updatedAt: '2026-02-18',
  },
  {
    id: '5',
    title: 'Casa de Campo rústica e simples',
    description: 'Para quem busca contato com a natureza sem ostentação. Casa rústica com varanda, telhado colonial e fogão a lenha. Amplo terreno com árvores frutíferas já produzindo.',
    type: 'house',
    operation: 'sale',
    price: 320000,
    status: 'available',
    location: { city: 'Carmo', neighborhood: 'Zona Rural', address: 'Estrada da Batalha, Carmo - RJ' },
    details: { bedrooms: 2, bathrooms: 1, garages: 5, area: 120, features: ['Fogão a Lenha', 'Pomar', 'Cercada', 'Poço Artesiano'] },
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
