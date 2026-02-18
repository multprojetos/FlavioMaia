import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Property } from '../../../../shared/types';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';
import { toast } from 'sonner';

export default function PropertyForm() {
  const [, setLocation] = useLocation();
  const params = useParams();
  const isEdit = !!params.id;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Property>>({
    title: '',
    description: '',
    type: 'apartment',
    operation: 'rent',
    status: 'available',
    price: 0,
    location: {
      city: 'Carmo',
      neighborhood: '',
      address: '',
    },
    details: {
      bedrooms: 1,
      bathrooms: 1,
      garages: 0,
      area: 0,
      features: [],
    },
    images: [],
    featured: false,
  });

  const [newFeature, setNewFeature] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

  useEffect(() => {
    if (isEdit) {
      fetchProperty();
    }
  }, [params.id]);

  const fetchProperty = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/properties/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Erro ao carregar imóvel');

      const data = await response.json();
      setFormData(data);
    } catch (error) {
      toast.error('Erro ao carregar imóvel');
      setLocation('/admin/imoveis');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('admin_token');
      const url = isEdit
        ? `/api/admin/properties/${params.id}`
        : '/api/admin/properties';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          createdAt: formData.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error('Erro ao salvar imóvel');

      toast.success(isEdit ? 'Imóvel atualizado com sucesso' : 'Imóvel cadastrado com sucesso');
      setLocation('/admin/imoveis');
    } catch (error) {
      toast.error('Erro ao salvar imóvel');
    } finally {
      setLoading(false);
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        details: {
          ...formData.details!,
          features: [...(formData.details?.features || []), newFeature.trim()],
        },
      });
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      details: {
        ...formData.details!,
        features: formData.details!.features.filter((_, i) => i !== index),
      },
    });
  };

  const addImage = () => {
    if (newImageUrl.trim()) {
      setFormData({
        ...formData,
        images: [...(formData.images || []), newImageUrl.trim()],
      });
      setNewImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images!.filter((_, i) => i !== index),
    });
  };

  const commonFeatures = [
    'Área de Serviço',
    'Garagem',
    'Piscina',
    'Quintal',
    'Varanda',
    'Portaria 24h',
    'Elevador',
    'Mobiliado',
    'Pet Friendly',
    'Ar Condicionado',
    'Churrasqueira',
    'Suíte',
    'Cozinha Planejada',
    'Armários Embutidos',
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => setLocation('/admin/imoveis')}>
              <ArrowLeft size={18} />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">
                {isEdit ? 'Editar Imóvel' : 'Novo Imóvel'}
              </h1>
              <p className="text-sm text-muted-foreground">
                Preencha todos os campos obrigatórios
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Apartamento 2 Quartos no Centro"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva o imóvel com detalhes..."
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="type">Tipo *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: any) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Apartamento</SelectItem>
                      <SelectItem value="house">Casa</SelectItem>
                      <SelectItem value="commercial">Comercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="operation">Operação *</Label>
                  <Select
                    value={formData.operation}
                    onValueChange={(value: any) => setFormData({ ...formData, operation: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rent">Aluguel</SelectItem>
                      <SelectItem value="sale">Venda</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Disponível</SelectItem>
                      <SelectItem value="rented">Alugado</SelectItem>
                      <SelectItem value="sold">Vendido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="price">Preço (R$) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Localização */}
          <Card>
            <CardHeader>
              <CardTitle>Localização</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">Cidade *</Label>
                  <Input
                    id="city"
                    value={formData.location?.city}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: { ...formData.location!, city: e.target.value },
                      })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="neighborhood">Bairro *</Label>
                  <Input
                    id="neighborhood"
                    value={formData.location?.neighborhood}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: { ...formData.location!, neighborhood: e.target.value },
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Endereço Completo *</Label>
                <Input
                  id="address"
                  value={formData.location?.address}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: { ...formData.location!, address: e.target.value },
                    })
                  }
                  placeholder="Rua, número, complemento"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Detalhes */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhes do Imóvel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="bedrooms">Quartos *</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    value={formData.details?.bedrooms}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        details: { ...formData.details!, bedrooms: Number(e.target.value) },
                      })
                    }
                    min="0"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="bathrooms">Banheiros *</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    value={formData.details?.bathrooms}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        details: { ...formData.details!, bathrooms: Number(e.target.value) },
                      })
                    }
                    min="0"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="garages">Garagens *</Label>
                  <Input
                    id="garages"
                    type="number"
                    value={formData.details?.garages}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        details: { ...formData.details!, garages: Number(e.target.value) },
                      })
                    }
                    min="0"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="area">Área (m²) *</Label>
                  <Input
                    id="area"
                    type="number"
                    value={formData.details?.area}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        details: { ...formData.details!, area: Number(e.target.value) },
                      })
                    }
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              {/* Features */}
              <div>
                <Label>Características</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Digite uma característica"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  />
                  <Button type="button" onClick={addFeature}>
                    Adicionar
                  </Button>
                </div>

                {/* Common Features */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {commonFeatures.map((feature) => (
                    <Button
                      key={feature}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (!formData.details?.features.includes(feature)) {
                          setFormData({
                            ...formData,
                            details: {
                              ...formData.details!,
                              features: [...(formData.details?.features || []), feature],
                            },
                          });
                        }
                      }}
                      disabled={formData.details?.features.includes(feature)}
                    >
                      {feature}
                    </Button>
                  ))}
                </div>

                {/* Selected Features */}
                <div className="flex flex-wrap gap-2">
                  {formData.details?.features.map((feature, index) => (
                    <div
                      key={index}
                      className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="hover:bg-primary-foreground/20 rounded-full p-0.5"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Imagens</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Cole a URL da imagem"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
                />
                <Button type="button" onClick={addImage}>
                  <Upload size={18} className="mr-2" />
                  Adicionar
                </Button>
              </div>

              <p className="text-sm text-muted-foreground">
                Dica: Use Unsplash, Imgur ou Cloudinary para hospedar as imagens
              </p>

              {/* Image Preview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images?.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Imagem ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs">
                        Capa
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Options */}
          <Card>
            <CardHeader>
              <CardTitle>Opções</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="featured">Imóvel em Destaque</Label>
                  <p className="text-sm text-muted-foreground">
                    Aparecerá na página inicial do site
                  </p>
                </div>
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setLocation('/admin/imoveis')}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              <Save size={18} className="mr-2" />
              {loading ? 'Salvando...' : isEdit ? 'Atualizar' : 'Cadastrar'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
