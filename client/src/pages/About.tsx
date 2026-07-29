import { mockTeamMembers } from '../../../shared/mockData';
import { CheckCircle, Award, Users, Target } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Sobre a Flávio Maia Imóveis</h1>
          <p className="text-lg text-primary-foreground/90">
            Mais de 20 anos de experiência no mercado imobiliário
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Our Story */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-4xl font-bold text-foreground mb-6">Nossa História</h2>
              <p className="text-foreground text-lg leading-relaxed mb-4">
                A Flávio Maia Imóveis foi fundada com a missão de transformar o mercado imobiliário através de profissionalismo, transparência e dedicação aos nossos clientes.
              </p>
              <p className="text-foreground text-lg leading-relaxed mb-4">
                Com mais de duas décadas de experiência, nos tornamos referência na região, sendo conhecidos por nossas negociações bem-sucedidas e atendimento personalizado.
              </p>
              <p className="text-foreground text-lg leading-relaxed">
                Hoje, continuamos inovando para oferecer a melhor experiência possível a nossos clientes, combinando conhecimento de mercado com tecnologia de ponta.
              </p>
            </div>
            <div className="bg-card rounded-lg p-8 shadow-lg">
              <div className="space-y-6">
                {[
                  { icon: Award, title: 'Experiência', value: '20+ anos' },
                  { icon: Users, title: 'Clientes Satisfeitos', value: '1000+' },
                  { icon: Target, title: 'Imóveis Negociados', value: '500+' },
                  { icon: CheckCircle, title: 'Taxa de Sucesso', value: '98%' },
                ].map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <Icon size={32} className="text-accent" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Mission, Vision, Values */}
        <section className="mb-16">
          <h2 className="font-display text-4xl font-bold text-foreground mb-12 text-center">Nossos Valores</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Missão',
                description: 'Conectar pessoas aos imóveis ideais através de profissionalismo, transparência e dedicação.',
                icon: '🎯',
              },
              {
                title: 'Visão',
                description: 'Ser a imobiliária mais confiável e inovadora da região, reconhecida pela excelência no atendimento.',
                icon: '🔭',
              },
              {
                title: 'Valores',
                description: 'Integridade, profissionalismo, transparência, compromisso com resultados e satisfação do cliente.',
                icon: '💎',
              },
            ].map((item, index) => (
              <div key={index} className="bg-card rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="font-display font-bold text-2xl text-foreground mb-4">{item.title}</h3>
                <p className="text-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section>
          <h2 className="font-display text-4xl font-bold text-foreground mb-12 text-center">Nossa Equipe</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {mockTeamMembers.map((member) => (
              <div key={member.id} className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="h-48 bg-muted flex items-center justify-center">
                  <div className="text-6xl">👤</div>
                </div>
                <div className="p-6">
                  <h3 className="font-display font-bold text-xl text-foreground mb-2">{member.name}</h3>
                  <p className="text-accent font-semibold mb-3">{member.role}</p>
                  <p className="text-foreground text-sm leading-relaxed mb-4">{member.bio}</p>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>
                      <span className="font-semibold text-foreground">Telefone:</span> {member.phone}
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Email:</span> {member.email}
                    </p>
                    {member.creci && (
                      <p>
                        <span className="font-semibold text-foreground">CRECI:</span> {member.creci}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
