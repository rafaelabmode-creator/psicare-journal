import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { User, Save, LogOut, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { profile, loading, updateProfile } = useProfile();
  const { signOut } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    full_name: '',
    crp: '',
    email: '',
    phone: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        crp: profile.crp || '',
        email: profile.email || '',
        phone: profile.phone || '',
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await updateProfile({
      full_name: formData.full_name,
      crp: formData.crp,
      phone: formData.phone || null,
    });

    setSaving(false);

    if (error) {
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível atualizar o perfil.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Perfil atualizado',
        description: 'Suas informações foram salvas com sucesso.',
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20">
          <div className="animate-pulse text-muted-foreground">Carregando...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-2xl space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <User className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Meu Perfil</h1>
            <p className="text-muted-foreground">Gerencie suas informações profissionais</p>
          </div>
        </div>

        {/* Form */}
        <Card className="border-border bg-card shadow-card">
          <CardHeader>
            <CardTitle>Informações do Psicólogo</CardTitle>
            <CardDescription>
              Dados que aparecerão nos prontuários e documentos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Nome Completo *</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Dr. João da Silva"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="crp">Registro CRP *</Label>
                <Input
                  id="crp"
                  value={formData.crp}
                  onChange={(e) => setFormData({ ...formData, crp: e.target.value })}
                  placeholder="CRP 00/00000"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  O e-mail não pode ser alterado
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={saving}>
                  <Save className="h-4 w-4" />
                  {saving ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Logout */}
        <Card className="border-border bg-card shadow-card">
          <CardHeader>
            <CardTitle className="text-destructive">Sair da Conta</CardTitle>
            <CardDescription>
              Encerrar sua sessão neste dispositivo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
