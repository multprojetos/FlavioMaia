import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Image as ImageIcon, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { mockProperties } from '../../../../shared/mockData';
import { Property } from '../../../../shared/types';

export default function PropertyForm() {
  const [, setLocation] = useLocation();
  const { id } = useParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState<Partial<Property>>({
    title: '',
    description: '',
    type: 'apartment',
    operation: 'sale',
    status: 'available',
    price: 0,
    location: { city: 'Carmo', neighborhood: '', address: '' },
    details: { bedrooms: 0, bathrooms: 0, garages: 0, area: 0, features: [] },
    images: [],
    featured: false
  });

  const [newFeature, setNewFeature] = useState('');
  const [newImage, setNewImage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      window.location.href = '/admin/login';
      return;
    }

    if (isEditing) {
      const property = mockProperties.find(p => p.id === id);
      if (property) {
        setFormData(property);
      } else {
        toast.error('Imóvel não encontrado');
        setLocation('/admin/imoveis');
      }
    }
  }, [id, isEditing, setLocation]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulação de salvamento
    toast.success(isEditing ? 'Imóvel atualizado com sucesso!' : 'Imóvel cadastrado com sucesso!', {
      description: 'Como estamos em modo demonstração, as alterações não serão persistidas no banco de dados.',
      duration: 5000,
    });

    setTimeout(() => {
      setLocation('/admin/imoveis');
    }, 2000);
  };

  const addFeature = () => {
    if (newFeature && !formData.details?.features.includes(newFeature)) {
      setFormData({
        ...formData,
        details: {
          ...formData.details!,
          features: [...formData.details!.features, newFeature]
        }
      });
      setNewFeature('');
    }
  };

  const removeFeature = (feature: string) => {
    setFormData({
      ...formData,
      details: {
        ...formData.details!,
        features: formData.details!.features.filter(f => f !== feature)
      }
    });
  };

  const addImage = () => {
    if (newImage && !formData.images?.includes(newImage)) {
      setFormData({
        ...formData,
        images: [...formData.images!, newImage]
      });
      setNewImage('');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-12">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => setLocation('/admin/imoveis')}>
              <ArrowLeft size={18} />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">
                {isEditing ? 'Editar Imóvel' : 'Novo Imóvel'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isEditing ? `Editando: ${formData.title}` : 'Cadastre uma nova propriedade'}
              </p>
            </div>
          </div>
          <Button onClick={handleSave} className="gap-2">
            <Save size={18} />
            Salvar Alterações
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título do Anúncio</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Apartamento 2 quartos no Centro"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição Completa</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descreva os detalhes do imóvel..."
                    className="h-32"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tipo de Imóvel</Label>
                    <Select
                      value={formData.type}
                      onValueChange={v => setFormData({ ...formData, type: v as any })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apartment">Apartamento</SelectItem>
                        <SelectItem value="house">Casa</SelectItem>
                        <SelectItem value="commercial">Comercial</SelectItem>
                        <SelectItem value="land">Terreno</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Operação</Label>
                    <Select
                      value={formData.operation}
                      onValueChange={v => setFormData({ ...formData, operation: v as any })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Venda ou Aluguel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sale">Venda</SelectItem>
                        <SelectItem value="rent">Aluguel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Localização</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      value={formData.location?.city}
                      onChange={e => setFormData({
                        ...formData,
                        location: { ...formData.location!, city: e.target.value }
                      })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="neighborhood">Bairro</Label>
                    <Input
                      id="neighborhood"
                      value={formData.location?.neighborhood}
                      onChange={e => setFormData({
                        ...formData,
                        location: { ...formData.location!, neighborhood: e.target.value }
                      })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Endereço Completo (Opcional)</Label>
                  <Input
                    id="address"
                    value={formData.location?.address}
                    onChange={e => setFormData({
                      ...formData,
                      location: { ...formData.location!, address: e.target.value }
                    })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Imagens</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newImage}
                    onChange={e => setNewImage(e.target.value)}
                    placeholder="URL da imagem (Unsplash, etc)"
                  />
                  <Button type="button" onClick={addImage} variant="outline" className="gap-2">
                    <Plus size={18} />
                    Adicionar
                  </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images?.map((url, idx) => (
                    <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border">
                      <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setFormData({
                          ...formData,
                          images: formData.images!.filter((_, i) => i !== idx)
                        })}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  <div className="aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer">
                    <ImageIcon size={24} className="mb-2" />
                    <span className="text-xs">Upload</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Preço e Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Valor (R$)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status de Disponibilidade</Label>
                  <Select
                    value={formData.status}
                    onValueChange={v => setFormData({ ...formData, status: v as any })}
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
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <Label htmlFor="featured" className="cursor-pointer">Destacar na Home</Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detalhes Técnicos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">Quartos</Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      value={formData.details?.bedrooms}
                      onChange={e => setFormData({
                        ...formData,
                        details: { ...formData.details!, bedrooms: parseInt(e.target.value) }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bathrooms">Banheiros</Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      value={formData.details?.bathrooms}
                      onChange={e => setFormData({
                        ...formData,
                        details: { ...formData.details!, bathrooms: parseInt(e.target.value) }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="area">Área (m²)</Label>
                    <Input
                      id="area"
                      type="number"
                      value={formData.details?.area}
                      onChange={e => setFormData({
                        ...formData,
                        details: { ...formData.details!, area: parseInt(e.target.value) }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="garages">Vagas</Label>
                    <Input
                      id="garages"
                      type="number"
                      value={formData.details?.garages}
                      onChange={e => setFormData({
                        ...formData,
                        details: { ...formData.details!, garages: parseInt(e.target.value) }
                      })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Diferenciais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newFeature}
                    onChange={e => setNewFeature(e.target.value)}
                    placeholder="Adicionar recurso..."
                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  />
                  <Button type="button" onClick={addFeature} size="icon" variant="outline">
                    <Plus size={18} />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.details?.features.map(feature => (
                    <Badge key={feature} variant="secondary" className="gap-1 px-2 py-1">
                      {feature}
                      <button type="button" onClick={() => removeFeature(feature)}>
                        <Trash2 size={12} className="text-muted-foreground hover:text-destructive" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex gap-3">
              <CheckCircle2 className="text-primary shrink-0" />
              <p className="text-xs text-primary/80">
                Lembre-se: em modo de demonstração, as imagens e dados são salvos apenas localmente nesta sessão.
              </p>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
