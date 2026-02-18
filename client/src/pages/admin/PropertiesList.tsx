import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Property } from '../../../../shared/types';
import { properties as mockProperties } from '../../../../shared/mockData';
import { Plus, Edit, Home, LogOut } from 'lucide-react';

export default function PropertiesList() {
  const [properties] = useState<Property[]>(mockProperties);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      window.location.href = '/admin/login';
    }
  }, []);

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-600">Disponível</Badge>;
      case 'rented':
        return <Badge className="bg-blue-600">Alugado</Badge>;
      case 'sold':
        return <Badge className="bg-purple-600">Vendido</Badge>;
      default:
        return <Badge className="bg-green-600">Disponível</Badge>;
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'apartment':
        return 'Apartamento';
      case 'house':
        return 'Casa';
      case 'commercial':
        return 'Comercial';
      default:
        return type;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Gerenciar Imóveis</h1>
            <p className="text-sm text-muted-foreground">{properties.length} imóveis cadastrados</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => window.location.href = '/admin/dashboard'} variant="outline">
              <Home size={18} className="mr-2" />
              Dashboard
            </Button>
            <Button onClick={() => window.location.href = '/admin/imoveis/novo'} className="gap-2">
              <Plus size={18} />
              Novo Imóvel
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                localStorage.removeItem('admin_token');
                window.location.href = '/admin/login';
              }}
            >
              <LogOut size={18} />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-4">
          {properties.map((property) => (
            <Card key={property.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex gap-6">
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-48 h-32 object-cover rounded-lg"
                  />

                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-bold mb-1">{property.title}</h3>
                        <p className="text-sm text-muted-foreground">{property.location.address}</p>
                      </div>
                      <div className="flex gap-2">
                        {getStatusBadge(property.status)}
                        {property.featured && <Badge variant="outline">Destaque</Badge>}
                      </div>
                    </div>

                    <div className="flex gap-4 text-sm text-muted-foreground mb-3">
                      <span>{getTypeName(property.type)}</span>
                      <span>•</span>
                      <span>{property.details.bedrooms} quartos</span>
                      <span>•</span>
                      <span>{property.details.bathrooms} banheiros</span>
                      <span>•</span>
                      <span>{property.details.area}m²</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-2xl font-bold text-primary">
                        R$ {property.price.toLocaleString('pt-BR')}
                        <span className="text-sm font-normal text-muted-foreground ml-2">
                          / {property.operation === 'rent' ? 'mês' : 'venda'}
                        </span>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.location.href = `/admin/imoveis/${property.id}/editar`}
                      >
                        <Edit size={16} className="mr-2" />
                        Editar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
