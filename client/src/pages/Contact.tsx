import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to a server
    console.log('Form submitted:', formData);
    alert('Obrigado! Sua mensagem foi enviada com sucesso. Entraremos em contato em breve!');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Entre em Contato</h1>
          <p className="text-lg text-primary-foreground/90">
            Estamos aqui para ajudar você a encontrar o imóvel perfeito
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="font-display text-3xl font-bold text-foreground mb-8">Envie uma Mensagem</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Seu nome"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-foreground mb-2">
                  Telefone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="(22) 98812-9414"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-foreground mb-2">
                  Mensagem
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Conte-nos como podemos ajudar..."
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3"
              >
                Enviar Mensagem
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="font-display text-3xl font-bold text-foreground mb-8">Informações de Contato</h2>

            <div className="space-y-8">
              {/* Phone */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-accent text-accent-foreground">
                    <Phone size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">Telefone</h3>
                  <p className="text-muted-foreground mb-1">(22) 2537-1394</p>
                  <p className="text-muted-foreground">(22) 98812-9414 (WhatsApp)</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-accent text-accent-foreground">
                    <Mail size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">Email</h3>
                  <a
                    href="mailto:contato@flaviomaia.com.br"
                    className="text-primary hover:underline"
                  >
                    contato@flaviomaia.com.br
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-accent text-accent-foreground">
                    <MapPin size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">Localização</h3>
                  <p className="text-muted-foreground">Carmo, Rio de Janeiro - RJ</p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-accent text-accent-foreground">
                    <Clock size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">Horário de Atendimento</h3>
                  <p className="text-muted-foreground">Segunda a Sexta: 9:00 - 18:00</p>
                  <p className="text-muted-foreground">Sábado: 9:00 - 13:00</p>
                  <p className="text-muted-foreground">Domingo: Fechado</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-12 p-6 bg-card rounded-lg border border-border">
              <h3 className="font-semibold text-lg text-foreground mb-3">Prefere conversar agora?</h3>
              <p className="text-muted-foreground mb-4">
                Clique no botão abaixo para conversar conosco no WhatsApp
              </p>
              <a
                href="https://wa.me/5522988129414"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors font-semibold"
              >
                Abrir WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
