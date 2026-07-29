import { ShoppingCart, Home, Key, Briefcase, TrendingUp, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

export default function Services() {
  const [, setLocation] = useLocation();

  const services = [
    {
      icon: ShoppingCart,
      title: 'Compra e Venda',
      description: 'Ajudamos você a encontrar o imóvel ideal para comprar ou vender com segurança e transparência.',
      features: ['Avaliação de imóveis', 'Negociação especializada', 'Documentação completa', 'Acompanhamento total'],
    },
    {
      icon: Key,
      title: 'Aluguel',
      description: 'Oferecemos soluções completas para quem deseja alugar ou disponibilizar seu imóvel.',
      features: ['Locação rápida', 'Gestão de contratos', 'Análise de inquilinos', 'Suporte contínuo'],
    },
    {
      icon: Home,
      title: 'Administração de Imóveis',
      description: 'Gerenciamos seu imóvel alugado com profissionalismo e eficiência.',
      features: ['Cobrança de aluguel', 'Manutenção e reparos', 'Atendimento ao inquilino', 'Relatórios mensais'],
    },
    {
      icon: TrendingUp,
      title: 'Consultoria Imobiliária',
      description: 'Orientação especializada para investimentos e decisões no mercado imobiliário.',
      features: ['Análise de mercado', 'Potencial de investimento', 'Estratégia de negócio', 'Planejamento financeiro'],
    },
    {
      icon: Briefcase,
      title: 'Gestão de Propriedades',
      description: 'Solução completa para proprietários que desejam terceirizar a administração.',
      features: ['Gestão financeira', 'Documentação', 'Manutenção preventiva', 'Relatórios detalhados'],
    },
    {
      icon: FileText,
      title: 'Avaliação de Imóveis',
      description: 'Avaliação profissional e precisa do valor de mercado do seu imóvel.',
      features: ['Análise comparativa', 'Relatório técnico', 'Parecer especializado', 'Documentação oficial'],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Nossos Serviços</h1>
          <p className="text-lg text-primary-foreground/90">
            Soluções completas para todas as suas necessidades imobiliárias
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div key={index} className="bg-card rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow">
                <div className="mb-4">
                  <Icon size={40} className="text-accent" />
                </div>
                <h3 className="font-display font-bold text-xl text-foreground mb-3">{service.title}</h3>
                <p className="text-foreground text-sm leading-relaxed mb-6">{service.description}</p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2 text-sm text-foreground">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full mt-1.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Why Choose Us */}
        <section className="bg-card rounded-lg p-12 mb-16">
          <h2 className="font-display text-3xl font-bold text-foreground mb-8 text-center">
            Por Que Escolher Nossos Serviços?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Experiência',
                description: 'Mais de 20 anos atuando no mercado imobiliário',
              },
              {
                title: 'Profissionalismo',
                description: 'Equipe qualificada e comprometida com resultados',
              },
              {
                title: 'Transparência',
                description: 'Comunicação clara em todas as etapas do processo',
              },
              {
                title: 'Resultado',
                description: '98% de taxa de sucesso em negociações',
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-accent text-accent-foreground rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                  ✓
                </div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary text-primary-foreground rounded-lg p-12 text-center">
          <h2 className="font-display text-3xl font-bold mb-6">Pronto para Começar?</h2>
          <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Entre em contato conosco hoje mesmo e descubra como podemos ajudar você com seus objetivos imobiliários.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => setLocation('/contato')}
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
              size="lg"
            >
              Solicitar Consulta
            </Button>
            <a
              href="https://wa.me/5522988129414"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-primary-foreground text-primary rounded-lg font-semibold hover:bg-primary-foreground/90 transition-colors inline-flex items-center justify-center"
            >
              Conversar no WhatsApp
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
