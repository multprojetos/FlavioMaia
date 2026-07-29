import { Link } from 'wouter';
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="font-display font-bold text-lg mb-4">Flávio Maia Imóveis</h3>
            <p className="text-sm text-primary-foreground/80 mb-4">
              Sua melhor escolha no mercado imobiliário. Profissionalismo, confiança e resultados.
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/">
                  <a className="hover:text-accent transition-colors">Início</a>
                </Link>
              </li>
              <li>
                <Link href="/imoveis">
                  <a className="hover:text-accent transition-colors">Imóveis</a>
                </Link>
              </li>
              <li>
                <Link href="/servicos">
                  <a className="hover:text-accent transition-colors">Serviços</a>
                </Link>
              </li>
              <li>
                <Link href="/quem-somos">
                  <a className="hover:text-accent transition-colors">Quem Somos</a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">Serviços</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Compra e Venda
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Aluguel
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Administração
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Consultoria
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contato</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Phone size={16} className="mt-0.5 flex-shrink-0" />
                <div>
                  <p>(22) 2537-1394</p>
                  <p>(22) 98812-9414</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Mail size={16} className="mt-0.5 flex-shrink-0" />
                <a href="mailto:contato@flaviomaia.com.br" className="hover:text-accent transition-colors">
                  contato@flaviomaia.com.br
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                <p>Carmo, RJ</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/80">
          <p>&copy; {currentYear} Flávio Maia Imóveis. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary-foreground transition-colors">
              Política de Privacidade
            </a>
            <a href="#" className="hover:text-primary-foreground transition-colors">
              Termos de Uso
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
