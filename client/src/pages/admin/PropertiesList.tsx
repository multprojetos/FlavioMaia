import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Property } from '../../../../shared/types';
import { Plus, Search, Edit, Trash2, Eye, EyeOff, Home, LogOut } from 'lucide-react';
import { toast } from 'sonner';

export default function PropertiesList() {
  const [, setLocation] = useLocation();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      setLocation('/admin/login');
      return;
    }

    fetchProperties();
  }, []);

  useEffect(() => {
    filterProperties();
  }, [properties, searchTerm, statusFilter, typeFilter]);

  const fetchProperties = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/properties', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Não autorizado');

      const data = await response.json();
      setProperties(data);
    } catch (error) {
      console.error('Erro ao carregar imóveis:', error);
      toast.error('Erro ao carregar imóveis');
      setLocation('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const filterProperties = () => {
    let filtered = [...properties];

    // Filtro de busca
    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.location.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro de status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    // Filtro de tipo
    if (typeFilter !== 'all') {
      filtered = filtered.filter((p) => p.type === typeFilter);
    }

    setFilteredProperties(filtered);
  };

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/properties/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Erro ao deletar');

      toast.success('Imóvel deletado com sucesso');
      fetchProperties();
    } catch (error) {
      toast.error('Erro ao deletar imóvel');
    } finally {
      setDeleteId(null);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/properties/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Erro ao atualizar status');

      toast.success('Status atualizado com sucesso');
      fetchProperties();
    } catch (error) {
      toast.error('Erro ao atualizar status');
    }
  };

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
            <h1 className="text-2xl font-bold">Gerenciar Imóveis</h1>
            <p className="text-sm text-muted-foreground">{properties.length} imóveis cadastrados</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setLocation('/admin/dashboard')} variant="outline">
              <Home size={18} className="mr-2" />
              Dashboard
            </Button>
            <Button onClick={() => setLocation('/admin/imoveis/novo')} className="gap-2">
              <Plus size={18} />
              Novo Imóvel
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                localStorage.removeItem('admin_token');
                setLocation('/admin/login');
              }}
            >
              <LogOut size={18} />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por título ou endereço..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="available">Disponível</SelectItem>
                  <SelectItem value="rented">Alugado</SelectItem>
                  <SelectItem value="sold">Vendido</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Tipos</SelectItem>
                  <SelectItem value="apartment">Apartamento</SelectItem>
                  <SelectItem value="house">Casa</SelectItem>
                  <SelectItem value="commercial">Comercial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Properties List */}
        {filteredProperties.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Home size={48} className="mx-auto mb-4 opacity-20" />
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                  ? 'Nenhum imóvel encontrado com os filtros aplicados'
                  : 'Nenhum imóvel cadastrado ainda'}
              </p>
              <Button onClick={() => setLocation('/admin/imoveis/novo')}>
                Cadastrar Primeiro Imóvel
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredProperties.map((property) => (
              <Card key={property.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    {/* Image */}
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-48 h-32 object-cover rounded-lg"
                    />

                    {/* Content */}
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

                        <div className="flex gap-2">
                          {/* Status Quick Change */}
                          <Select
                            value={property.status || 'available'}
                            onValueChange={(value) => handleStatusChange(property.id, value)}
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="available">Disponível</SelectItem>
                              <SelectItem value="rented">Alugado</SelectItem>
                              <SelectItem value="sold">Vendido</SelectItem>
                            </SelectContent>
                          </Select>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setLocation(`/admin/imoveis/${property.id}/editar`)}
                          >
                            <Edit size={16} className="mr-2" />
                            Editar
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeleteId(property.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este imóvel? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-destructive hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
