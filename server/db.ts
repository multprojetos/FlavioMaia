import { Property } from '../shared/types';

// Simulação de banco de dados em memória (será substituído por PostgreSQL)
let properties: Property[] = [];
let users = [
  {
    id: '1',
    username: 'admin',
    password: '$2a$10$rKZLvXZnJx5z5Z5Z5Z5Z5u', // senha: admin123 (será hash real)
    email: 'admin@flaviomaia.com.br',
    role: 'admin',
  },
];

export const db = {
  properties: {
    findMany: async (filter?: any) => {
      if (filter?.status === 'available') {
        return properties.filter(p => p.status === 'available');
      }
      return properties;
    },
    findById: async (id: string) => {
      return properties.find(p => p.id === id);
    },
    create: async (data: Property) => {
      properties.push(data);
      return data;
    },
    update: async (id: string, data: Partial<Property>) => {
      const index = properties.findIndex(p => p.id === id);
      if (index !== -1) {
        properties[index] = { ...properties[index], ...data, updatedAt: new Date().toISOString() };
        return properties[index];
      }
      return null;
    },
    delete: async (id: string) => {
      const index = properties.findIndex(p => p.id === id);
      if (index !== -1) {
        properties.splice(index, 1);
        return true;
      }
      return false;
    },
  },
  users: {
    findByUsername: async (username: string) => {
      return users.find(u => u.username === username);
    },
  },
};
