import { useParams, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import ImageGallery from '@/components/ImageGallery';
import { MapPin, Bed, Bath, Maximize2, Phone, MessageCircle, Share2, Heart, Car, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Property } from '../../../shared/types';
import { toast } from 'sonner';

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [isFavorite, setIsFavorite] = useState(false);
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProperty() {
      if (!id) return;
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        if (data) {
          const mapped: Property = {
            id: data.id,
            title: data.title,
            description: data.description,
            type: data.type,
            operation: data.operation,
            status: data.status,
            price: Number(data.price),
            location: {
              city: data.city,
              neighborhood: data.neighborhood,
              address: data.address
            },
            details: {
              bedrooms: data.bedrooms,
              bathrooms: data.bathrooms,
              garages: data.garages,
              area: data.area,
              features: data.features || []
            },
            images: data.images || [],
            featured: data.featured,
            createdAt: data.created_at,
            updatedAt: data.updated_at
          };
          setProperty(mapped);
        }
      } catch (err) {
        console.error('Error:', err);
        toast.error('Imóvel não encontrado');
      } finally {
        setLoading(false);
      }
    }
    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-primary mb-4" size={48} />
        <p className="text-muted-foreground">Carregando detalhes do imóvel...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-4xl font-bold text-foreground mb-4">Imóvel não encontrado</h1>
          <Button onClick={() => setLocation('/imoveis')} className="bg-primary hover:bg-primary/90">
            Voltar para Imóveis
          </Button>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const operationLabel = property.operation === 'rent' ? 'Aluguel' : 'Venda';

  const handleWhatsAppContact = () => {
    const phone = '5522988129414';
    const message = `Olá! Tenho interesse no imóvel: ${property.title} - ${formatPrice(property.price)}`;
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleShare = async () => {
    const shareData = {
      title: property.title,
      text: `Confira este imóvel: ${property.title}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Erro ao compartilhar:', err);
      }
    } else {
      // Fallback: copiar URL
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado para a área de transferência!');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <div className="bg-card border-b border-border sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4">
          <Button
            onClick={() => setLocation('/imoveis')}
            variant="outline"
            className="text-sm"
          >
            ← Voltar para Imóveis
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="mb-8">
              <ImageGallery images={property.images} title={property.title} />
            </div>

            {/* Property Info */}
            <div className="mb-8">
              <div className="flex items-start justify-between mb-4">
                <h1 className="font-display text-4xl font-bold text-foreground">{property.title}</h1>
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="bg-muted rounded-full p-3 hover:bg-muted/80 transition-colors"
                >
                  <Heart
                    size={24}
                    className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}
                  />
                </button>
              </div>

              {/* Location */}
              <div className="flex items-start gap-2 mb-6">
                <MapPin size={20} className="text-accent mt-1 flex-shrink-0" />
                <div>
                  <p className="text-lg font-semibold text-foreground">{property.location.address}</p>
                  <p className="text-muted-foreground">
                    {property.location.neighborhood}, {property.location.city}
                  </p>
                </div>
              </div>

              {/* Price */}
              <div className="mb-8 pb-8 border-b border-border">
                <p className="text-sm text-muted-foreground mb-2">Preço</p>
                <p className="text-4xl font-bold text-primary">{formatPrice(property.price)}</p>
                {property.operation === 'rent' && <p className="text-muted-foreground">por mês</p>}
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 pb-8 border-b border-border">
                {property.details.bedrooms > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Bed size={20} className="text-accent" />
                      <span className="text-sm text-muted-foreground">Quartos</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{property.details.bedrooms}</p>
                  </div>
                )}
                {property.details.bathrooms > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Bath size={20} className="text-accent" />
                      <span className="text-sm text-muted-foreground">Banheiros</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{property.details.bathrooms}</p>
                  </div>
                )}
                {property.details.garages > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Car size={20} className="text-accent" />
                      <span className="text-sm text-muted-foreground">Garagens</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{property.details.garages}</p>
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Maximize2 size={20} className="text-accent" />
                    <span className="text-sm text-muted-foreground">Área</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{property.details.area} m²</p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">Descrição</h2>
                <p className="text-foreground leading-relaxed mb-6">{property.description}</p>
              </div>

              {/* Features */}
              {property.details.features.length > 0 && (
                <div className="mb-8">
                  <h2 className="font-display text-2xl font-bold text-foreground mb-4">Características</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {property.details.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 bg-muted p-3 rounded-lg">
                        <div className="w-2 h-2 bg-accent rounded-full" />
                        <span className="text-foreground text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Contact CTA */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg p-6 shadow-md sticky top-32">
              <h3 className="font-display font-bold text-lg text-foreground mb-6">Interessado neste imóvel?</h3>

              {/* Contact Buttons */}
              <div className="space-y-3 mb-6">
                <a
                  href="tel:+5522253713394"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
                >
                  <Phone size={20} />
                  Ligar
                </a>
                <button
                  onClick={handleWhatsAppContact}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                >
                  <MessageCircle size={20} />
                  WhatsApp
                </button>
              </div>

              {/* Share Button */}
              <button
                onClick={handleShare}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-border rounded-lg hover:bg-muted transition-colors font-semibold text-foreground"
              >
                <Share2 size={20} />
                Compartilhar
              </button>

              {/* Info Box */}
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground mb-4">
                  Tem dúvidas? Nossa equipe está pronta para ajudar!
                </p>
                <div className="space-y-2 text-sm">
                  <p className="text-foreground">
                    <span className="font-semibold">Telefone:</span> (22) 2537-1394
                  </p>
                  <p className="text-foreground">
                    <span className="font-semibold">WhatsApp:</span> (22) 98812-9414
                  </p>
                  <p className="text-foreground">
                    <span className="font-semibold">Email:</span> contato@flaviomaia.com.br
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
