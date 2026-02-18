import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock } from 'lucide-react';

export default function AdminLogin() {
  const handleLogin = () => {
    const fakeToken = 'demo-token-' + Date.now();
    const fakeUser = { 
      id: '1', 
      username: 'admin', 
      email: 'admin@flaviomaia.com.br', 
      role: 'admin' 
    };
    
    localStorage.setItem('admin_token', fakeToken);
    localStorage.setItem('admin_user', JSON.stringify(fakeUser));
    
    // Usar window.location para garantir navegação no Vercel
    window.location.href = '/admin/dashboard';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Painel Administrativo</CardTitle>
          <CardDescription>Flávio Maia Imóveis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="bg-blue-50 border-blue-200">
            <AlertDescription className="text-blue-800">
              <strong>Modo Demonstração:</strong> Clique em "Entrar" para acessar o painel admin.
              A autenticação será implementada após o deploy funcionar corretamente.
            </AlertDescription>
          </Alert>

          <Button onClick={handleLogin} className="w-full" size="lg">
            Entrar no Painel Admin
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            <p>Versão de demonstração</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
