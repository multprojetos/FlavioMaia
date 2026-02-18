import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function PropertyForm() {
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      window.location.href = '/admin/login';
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => window.location.href = '/admin/imoveis'}>
              <ArrowLeft size={18} />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Formulário de Imóvel</h1>
              <p className="text-sm text-muted-foreground">Modo demonstração</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Funcionalidade em Desenvolvimento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="bg-blue-50 border-blue-200">
              <AlertDescription className="text-blue-800">
                <strong>Modo Demonstração:</strong> O formulário de cadastro/edição de imóveis 
                será implementado após a configuração completa do backend com Supabase.
                <br /><br />
                Por enquanto, você pode visualizar os 15 imóveis já cadastrados no sistema.
              </AlertDescription>
            </Alert>

            <div className="flex gap-4">
              <Button onClick={() => window.location.href = '/admin/imoveis'}>
                Ver Lista de Imóveis
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/admin/dashboard'}>
                Voltar ao Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
