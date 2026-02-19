import { useState, useMemo, useEffect } from 'react';
import PropertyCard from '@/components/PropertyCard';
import { useLocation } from 'wouter';
import { Filter, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { Property, SearchFilters } from '../../../shared/types';

export default function Properties() {
  const [, setLocation] = useLocation();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProperties() {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('status', 'available')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data) {
          const mapped: Property[] = (data as any[]).map((p: any) => ({
            id: p.id,
            title: p.title,
            description: p.description,
            type: p.type,
            operation: p.operation,
            status: p.status,
            price: Number(p.price),
            location: {
              city: p.city,
              neighborhood: p.neighborhood,
              address: p.address
            },
            details: {
              bedrooms: p.bedrooms,
              bathrooms: p.bathrooms,
              garages: p.garages,
              area: p.area,
              features: p.features || []
            },
            images: p.images || [],
            featured: p.featured,
            createdAt: p.created_at,
            updatedAt: p.updated_at
          }));
          setProperties(mapped);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProperties();
  }, []);

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      if (filters.type && property.type !== filters.type) return false;
      if (filters.operation && property.operation !== filters.operation) return false;
      if (filters.city && property.location.city !== filters.city) return false;
      if (filters.minPrice && property.price < filters.minPrice) return false;
      if (filters.maxPrice && property.price > filters.maxPrice) return false;
      if (filters.minBedrooms && property.details.bedrooms < filters.minBedrooms) return false;
      if (filters.minArea && property.details.area < filters.minArea) return false;
      return true;
    });
  }, [filters]);

  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  const handleViewDetails = (id: string) => {
    setLocation(`/imovel/${id}`);
  };

  const cities = useMemo(() => {
    return Array.from(new Set(properties.map((p) => p.location.city)));
  }, [properties]);
  const types = [
    { value: 'apartment', label: 'Apartamento' },
    { value: 'house', label: 'Casa' },
    { value: 'land', label: 'Terreno' },
    { value: 'commercial', label: 'Comercial' },
  ];
  const operations = [
    { value: 'sale', label: 'Venda' },
    { value: 'rent', label: 'Aluguel' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Encontre seu Imóvel Ideal</h1>
          <p className="text-lg text-primary-foreground/90">
            Explore nossa seleção de propriedades premium
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-card rounded-lg p-6 sticky top-24">
              <h2 className="font-display font-bold text-lg mb-6">Filtros</h2>

              {/* Type Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3 text-foreground">Tipo de Imóvel</label>
                <div className="space-y-2">
                  {types.map((type) => (
                    <label key={type.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.type === type.value}
                        onChange={(e) =>
                          handleFilterChange({
                            ...filters,
                            type: e.target.checked ? (type.value as any) : undefined,
                          })
                        }
                        className="w-4 h-4 rounded border-border"
                      />
                      <span className="text-sm text-foreground">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Operation Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3 text-foreground">Tipo de Operação</label>
                <div className="space-y-2">
                  {operations.map((op) => (
                    <label key={op.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.operation === op.value}
                        onChange={(e) =>
                          handleFilterChange({
                            ...filters,
                            operation: e.target.checked ? (op.value as any) : undefined,
                          })
                        }
                        className="w-4 h-4 rounded border-border"
                      />
                      <span className="text-sm text-foreground">{op.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* City Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3 text-foreground">Cidade</label>
                <select
                  value={filters.city || ''}
                  onChange={(e) => handleFilterChange({ ...filters, city: e.target.value || undefined })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
                >
                  <option value="">Todas as cidades</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3 text-foreground">Preço Mínimo</label>
                <input
                  type="number"
                  placeholder="R$ 0"
                  value={filters.minPrice || ''}
                  onChange={(e) =>
                    handleFilterChange({
                      ...filters,
                      minPrice: e.target.value ? parseInt(e.target.value) : undefined,
                    })
                  }
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
                />
              </div>

              {/* Clear Filters */}
              {Object.keys(filters).length > 0 && (
                <Button
                  onClick={() => setFilters({})}
                  variant="outline"
                  className="w-full text-sm"
                >
                  Limpar Filtros
                </Button>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-6">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
              >
                <Filter size={20} />
                {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
              </Button>
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <div className="lg:hidden bg-card rounded-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-display font-bold text-lg">Filtros</h2>
                  <button onClick={() => setShowFilters(false)} className="p-1 hover:bg-muted rounded">
                    <X size={20} />
                  </button>
                </div>

                {/* Type Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-3">Tipo de Imóvel</label>
                  <div className="space-y-2">
                    {types.map((type) => (
                      <label key={type.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.type === type.value}
                          onChange={(e) =>
                            handleFilterChange({
                              ...filters,
                              type: e.target.checked ? (type.value as any) : undefined,
                            })
                          }
                          className="w-4 h-4 rounded border-border"
                        />
                        <span className="text-sm">{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Operation Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-3">Tipo de Operação</label>
                  <div className="space-y-2">
                    {operations.map((op) => (
                      <label key={op.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.operation === op.value}
                          onChange={(e) =>
                            handleFilterChange({
                              ...filters,
                              operation: e.target.checked ? (op.value as any) : undefined,
                            })
                          }
                          className="w-4 h-4 rounded border-border"
                        />
                        <span className="text-sm">{op.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-muted-foreground">
                Mostrando <span className="font-semibold text-foreground">{filteredProperties.length}</span> imóvel
                {filteredProperties.length !== 1 ? 'is' : ''}
              </p>
            </div>

            {/* Properties Grid */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="animate-spin text-primary mb-4" size={48} />
                <p className="text-muted-foreground">Carregando imóveis...</p>
              </div>
            ) : filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-card rounded-lg p-12 text-center">
                <p className="text-muted-foreground text-lg">Nenhum imóvel encontrado com esses filtros.</p>
                <Button
                  onClick={() => setFilters({})}
                  variant="outline"
                  className="mt-4"
                >
                  Limpar Filtros
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
