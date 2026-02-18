# 🔄 Como Mudar para o Novo Repositório

## Situação Atual
- ✅ Repositório remoto alterado para: https://github.com/multprojetos/FlavioMaia.git
- ❌ Git está usando credenciais da conta antiga (prribeiro1)

## Solução: Atualizar Credenciais do Git

### Opção 1: Usar Git Credential Manager (Recomendado)

1. **Limpar credenciais antigas:**
```bash
git credential-manager erase https://github.com
```

2. **Fazer push novamente:**
```bash
git push -u origin master
```

3. Uma janela do navegador vai abrir pedindo login
4. Faça login com a nova conta (multprojetos)
5. Autorize o acesso
6. Pronto!

### Opção 2: Usar Token de Acesso Pessoal

1. **Criar token no GitHub:**
   - Acesse: https://github.com/settings/tokens
   - Clique em "Generate new token" → "Generate new token (classic)"
   - Dê um nome: "FlavioMaia Deploy"
   - Marque: `repo` (acesso completo aos repositórios)
   - Clique em "Generate token"
   - **COPIE O TOKEN** (você só verá uma vez!)

2. **Usar o token no push:**
```bash
git push https://TOKEN@github.com/multprojetos/FlavioMaia.git master
```

Substitua `TOKEN` pelo token que você copiou.

3. **Configurar para sempre usar o token:**
```bash
git remote set-url origin https://TOKEN@github.com/multprojetos/FlavioMaia.git
git push -u origin master
```

### Opção 3: Usar GitHub CLI (Mais Fácil)

1. **Instalar GitHub CLI:**
   - Baixe em: https://cli.github.com/
   - Ou use: `winget install GitHub.cli`

2. **Fazer login:**
```bash
gh auth login
```

3. **Seguir as instruções:**
   - Escolha: GitHub.com
   - Escolha: HTTPS
   - Escolha: Login with a web browser
   - Copie o código e cole no navegador
   - Faça login com a conta multprojetos

4. **Fazer push:**
```bash
git push -u origin master
```

### Opção 4: Remover Credenciais do Windows

1. **Abrir Gerenciador de Credenciais do Windows:**
   - Pressione `Win + R`
   - Digite: `control /name Microsoft.CredentialManager`
   - Enter

2. **Remover credenciais do GitHub:**
   - Procure por "github.com"
   - Clique em cada uma e depois em "Remover"

3. **Fazer push novamente:**
```bash
git push -u origin master
```

4. Uma janela vai pedir suas credenciais
5. Use a nova conta (multprojetos)

## Verificar se Funcionou

Após fazer o push com sucesso:

```bash
git remote -v
```

Deve mostrar:
```
origin  https://github.com/multprojetos/FlavioMaia.git (fetch)
origin  https://github.com/multprojetos/FlavioMaia.git (push)
```

E o código deve estar visível em:
https://github.com/multprojetos/FlavioMaia

## Deploy no Vercel

Depois que o código estiver no novo repositório:

1. **Acesse Vercel com a nova conta**
2. **Clique em "Add New Project"**
3. **Conecte o GitHub** (autorize a conta multprojetos)
4. **Selecione o repositório** FlavioMaia
5. **Configure:**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist/public`
6. **Adicione as variáveis de ambiente** (se já tiver Supabase configurado)
7. **Clique em "Deploy"**

## Dica: Sobre Fotos e Limites

Você está certo em se preocupar com o limite! Aqui estão as opções:

### Cloudinary (Recomendado para Fotos)
- **Free Tier**: 25GB de storage, 25GB de bandwidth/mês
- **Perfeito para imóveis**: ~100-200 imóveis com 5 fotos cada
- **Otimização automática**: Reduz tamanho das imagens
- **CDN global**: Carregamento rápido
- **Custo**: Gratuito até o limite, depois ~$89/mês

### Supabase Storage
- **Free Tier**: 1GB de storage
- **Suficiente para**: ~20-30 imóveis com fotos
- **Custo**: $0.021/GB adicional

### Imgur
- **Gratuito**: Ilimitado para uso pessoal
- **Limitação**: Pode remover imagens inativas
- **Bom para**: Testes e protótipos

### Recomendação
Use **Cloudinary** para produção. O free tier é generoso e você pode cobrar do cliente se ultrapassar.

## Problemas Comuns

### "Permission denied"
- Você está usando credenciais da conta errada
- Siga uma das opções acima para atualizar

### "Repository not found"
- Verifique se o repositório existe: https://github.com/multprojetos/FlavioMaia
- Verifique se você tem acesso com a conta multprojetos

### "Authentication failed"
- Token expirado ou inválido
- Gere um novo token

## Precisa de Ajuda?

Se nenhuma opção funcionar, me avise qual erro aparece!
