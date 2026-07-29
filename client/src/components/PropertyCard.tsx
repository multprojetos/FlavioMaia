import { Property } from '@shared/types';
import { Heart, MapPin, Bed, Bath, Maximize2, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface PropertyCardProps {
  property: Property;
  onViewDetails: (id: string) => void;
}

export default function PropertyCard({ property, onViewDetails }: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const operationLabel = property.operation === 'rent' ? 'Aluguel' : 'Venda';

  const handleWhatsAppContact = (e: React.MouseEvent) => {
    e.stopPropagation();
    const phone = '5522988129414'; // WhatsApp da Flávio Maia Imóveis
    const message = `Olá! Tenho interesse no imóvel: ${property.title} - ${formatPrice(property.price)}`;
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden bg-muted">
        <img
          src={property.images[0]}
          alt={property.title}
          loading="lazy"
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-t from-black/30 to-transparent" />

        {/* Badge */}
        <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
          {operationLabel}
        </div>

        {/* Favorite Button */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
        >
          <Heart
            size={20}
            className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}
          />
        </button>

        {/* Featured Badge */}
        {property.featured && (
          <div className="absolute bottom-4 left-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-semibold">
            ⭐ Em Destaque
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Price */}
        <div className="mb-3">
          <p className="text-2xl font-bold text-primary">{formatPrice(property.price)}</p>
          <p className="text-sm text-muted-foreground">
            {property.operation === 'rent' ? 'por mês' : 'preço total'}
          </p>
        </div>

        {/* Title */}
        <h3 className="font-display text-lg font-semibold text-foreground mb-2 line-clamp-2">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-start gap-2 mb-3">
          <MapPin size={16} className="text-accent mt-0.5 flex-shrink-0" />
          <div className="text-sm text-muted-foreground">
            <p>{property.location.neighborhood}</p>
            <p className="text-xs">{property.location.city}</p>
          </div>
        </div>

        {/* Details */}
        <div className="flex gap-4 mb-4 text-sm text-muted-foreground border-t pt-3">
          {property.details.bedrooms > 0 && (
            <div className="flex items-center gap-1">
              <Bed size={16} />
              <span>{property.details.bedrooms}</span>
            </div>
          )}
          {property.details.bathrooms > 0 && (
            <div className="flex items-center gap-1">
              <Bath size={16} />
              <span>{property.details.bathrooms}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Maximize2 size={16} />
            <span>{property.details.area} m²</span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex gap-2">
          <Button
            onClick={() => onViewDetails(property.id)}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            Ver Detalhes
          </Button>
          <Button
            onClick={handleWhatsAppContact}
            className="bg-green-600 hover:bg-green-700 text-white px-3"
            title="Contato via WhatsApp"
          >
            <MessageCircle size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}
