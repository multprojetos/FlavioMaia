import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, TrendingUp, DollarSign, Eye, Plus, LogOut } from 'lucide-react';
import { Property } from '../../../../shared/types';
import { mockProperties } from '../../../../shared/mockData';

export default function AdminDashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      window.location.href = '/admin/login';
      return;
    }

    // Usar dados mockados por enquanto (modo demonstração)
    setProperties(mockProperties);
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    window.location.href = '/admin/login';
  };

  const stats = {
    total: properties.length,
    available: properties.filter(p => p.status === 'available').length,
    rented: properties.filter(p => p.status === 'rented').length,
    sold: properties.filter(p => p.status === 'sold').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Painel Administrativo</h1>
            <p className="text-sm text-muted-foreground">Flávio Maia Imóveis</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => window.location.href = '/admin/imoveis/novo'} className="gap-2">
              <Plus size={18} />
              Novo Imóvel
            </Button>
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut size={18} />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Imóveis
              </CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">Cadastrados no sistema</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Disponíveis
              </CardTitle>
              <Eye className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.available}</div>
              <p className="text-xs text-muted-foreground mt-1">Visíveis no site</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Alugados
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.rented}</div>
              <p className="text-xs text-muted-foreground mt-1">Ocultos do site</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Vendidos
              </CardTitle>
              <DollarSign className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{stats.sold}</div>
              <p className="text-xs text-muted-foreground mt-1">Ocultos do site</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-24 flex flex-col gap-2"
              onClick={() => window.location.href = '/admin/imoveis'}
            >
              <Home size={24} />
              <span>Gerenciar Imóveis</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex flex-col gap-2"
              onClick={() => window.location.href = '/admin/imoveis/novo'}
            >
              <Plus size={24} />
              <span>Adicionar Imóvel</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex flex-col gap-2"
              onClick={() => window.location.href = '/'}
            >
              <Eye size={24} />
              <span>Ver Site Público</span>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Properties */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Últimos Imóveis Cadastrados</CardTitle>
          </CardHeader>
          <CardContent>
            {properties.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Home size={48} className="mx-auto mb-4 opacity-20" />
                <p>Nenhum imóvel cadastrado ainda</p>
                <Button className="mt-4" onClick={() => window.location.href = '/admin/imoveis/novo'}>
                  Cadastrar Primeiro Imóvel
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {properties.slice(0, 5).map((property) => (
                  <div
                    key={property.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <h3 className="font-semibold">{property.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          R$ {property.price.toLocaleString('pt-BR')} •{' '}
                          <span className={`
                            ${property.status === 'available' ? 'text-green-600' : ''}
                            ${property.status === 'rented' ? 'text-blue-600' : ''}
                            ${property.status === 'sold' ? 'text-purple-600' : ''}
                          `}>
                            {property.status === 'available' && 'Disponível'}
                            {property.status === 'rented' && 'Alugado'}
                            {property.status === 'sold' && 'Vendido'}
                          </span>
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.href = `/admin/imoveis/${property.id}/editar`}
                    >
                      Editar
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
