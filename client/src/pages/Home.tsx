import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { mockTestimonials } from '../../../shared/mockData';
import PropertyCard from '@/components/PropertyCard';
import { Button } from '@/components/ui/button';
import { Star, CheckCircle, Users, TrendingUp, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Property } from '../../../shared/types';

export default function Home() {
  const [, setLocation] = useLocation();
  const [searchType, setSearchType] = useState<'rent' | 'sale'>('sale');
  const [searchCity, setSearchCity] = useState('');
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch featured properties
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('status', 'available')
          .eq('featured', true)
          .limit(3);

        if (error) throw error;

        if (data) {
          const mappedProperties: Property[] = (data as any[]).map((p: any) => ({
            id: p.id,
            title: p.title,
            description: p.description,
            type: p.type,
            operation: p.operation,
            status: p.status,
            price: p.price,
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
          setFeaturedProperties(mappedProperties);
        }

        // Fetch all cities for the search filter
        const { data: cityData, error: cityError } = await supabase
          .from('properties')
          .select('city')
          .eq('status', 'available');

        if (!cityError && cityData) {
          const uniqueCities = Array.from(new Set((cityData as any[]).map((c: any) => c.city))) as string[];
          setCities(uniqueCities);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleSearch = () => {
    setLocation('/imoveis');
  };

  const handleViewDetails = (id: string) => {
    setLocation(`/imovel/${id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section
        className="relative h-screen bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(31, 58, 92, 0.7) 0%, rgba(31, 58, 92, 0.5) 100%), url('https://private-us-east-1.manuscdn.com/sessionFile/dmj3kpFqLtwk655WbvFaya/sandbox/9AB1TyDdoKWFzvQjYTSsLE-img-1_1771424715000_na1fn_aGVyby1jaXR5c2NhcGU.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvZG1qM2twRnFMdHdrNjU1V2J2RmF5YS9zYW5kYm94LzlBQjFUeURkb0tXRnp2UWpZVFNzTEUtaW1nLTFfMTc3MTQyNDcxNTAwMF9uYTFmbl9hR1Z5YnkxamFYUjVjMk5oY0dVLmpwZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=ArrK6WUildyQjeZN-fxGcI7O8T92Z9fnkx4vgXHupvWexM1vlCRPR62EWCuI87vSkcQmD8g8WWd21k3wy2hvAYSSfTu1VMj-LA5rgKyhN4yn8a0V-3uPfoeOSRUjQu0KNe2adDqXlRHyGkWsXRBidHs2WyMBT6tvqfaUfR4tZsvSBkH7iAiM3d2pwYvwK4PURfZQuj8SExgX2Wk5iAOf8MZnTQh~srmp3ciIm97~bNKpak~mPfmJ0Gx05WE6SKuIA0b5LOLj-D-vspWUdEHIIHPkxwLIvOopZvOMhglLoxNGgNsqUEBpzn50Q~cJNnDO2dl5~wH06vCHSQrWjbJM3Q__')`,
        }}
      >
        <div className="container mx-auto px-4 text-center text-primary-foreground">
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            O Seu Novo Lar Começa Aqui
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-primary-foreground/90 max-w-2xl mx-auto">
            Encontre o imóvel perfeito com a Flávio Maia Imóveis. Profissionalismo, confiança e resultados.
          </p>

          {/* Search Box */}
          <div className="bg-card rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Type Selection */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Tipo de Operação</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSearchType('sale')}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${searchType === 'sale'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground hover:bg-muted/80'
                      }`}
                  >
                    Comprar
                  </button>
                  <button
                    onClick={() => setSearchType('rent')}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${searchType === 'rent'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground hover:bg-muted/80'
                      }`}
                  >
                    Alugar
                  </button>
                </div>
              </div>

              {/* City Selection */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Cidade</label>
                <select
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="">Todas as cidades</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Button */}
              <div className="flex items-end">
                <Button
                  onClick={handleSearch}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                >
                  Buscar
                  <ArrowRight size={18} className="ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Imóveis em Destaque
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Conheça nossas melhores oportunidades de investimento e moradia
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>

          <div className="text-center">
            <Button
              onClick={() => setLocation('/imoveis')}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              Ver Todos os Imóveis
              <ArrowRight size={20} className="ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-12 text-center">
            Por Que Escolher a Flávio Maia?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Users size={32} />,
                title: 'Equipe Experiente',
                description: 'Profissionais com mais de 20 anos de experiência no mercado',
              },
              {
                icon: <CheckCircle size={32} />,
                title: 'Transparência',
                description: 'Processos claros e sem surpresas desagradáveis',
              },
              {
                icon: <TrendingUp size={32} />,
                title: 'Melhores Resultados',
                description: 'Vendas e aluguéis realizados com rapidez e segurança',
              },
              {
                icon: <Star size={32} />,
                title: 'Atendimento Premium',
                description: 'Dedicação total ao sucesso de cada negociação',
              },
            ].map((item, index) => (
              <div key={index} className="bg-background rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-accent mb-4 flex justify-center">{item.icon}</div>
                <h3 className="font-display font-bold text-lg text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-12 text-center">
            O Que Nossos Clientes Dizem
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-card rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} size={18} className="fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-foreground mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Pronto para Encontrar seu Imóvel Ideal?
          </h2>
          <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Entre em contato conosco hoje mesmo e deixe nossa equipe ajudar você a realizar seu sonho
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => setLocation('/imoveis')}
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
            >
              Explorar Imóveis
            </Button>
            <a
              href="https://wa.me/5522988129414"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-primary-foreground text-primary rounded-lg font-semibold hover:bg-primary-foreground/90 transition-colors inline-flex items-center justify-center"
            >
              Fale com um Corretor
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
