import { useState, useEffect, useRef } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { User, Save, LogOut, ArrowLeft, Upload, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export default function Profile() {
  const { profile, loading, updateProfile } = useProfile();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    full_name: '',
    crp: '',
    email: '',
    phone: '',
    clinic_address: '',
  });
  const [saving, setSaving] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        crp: profile.crp || '',
        email: profile.email || '',
        phone: profile.phone || '',
        clinic_address: profile.clinic_address || '',
      });
      setLogoUrl(profile.logo_url || null);
    }
  }, [profile]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith('image/')) {
      toast({ title: 'Formato inválido', description: 'Envie uma imagem PNG ou JPG.', variant: 'destructive' });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: 'Arquivo muito grande', description: 'O tamanho máximo é 2MB.', variant: 'destructive' });
      return;
    }

    setUploading(true);
    const ext = file.name.split('.').pop();
    const filePath = `${user.id}/logo.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('profile-logos')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast({ title: 'Erro no upload', description: 'Não foi possível enviar a imagem.', variant: 'destructive' });
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from('profile-logos').getPublicUrl(filePath);
    const url = urlData.publicUrl + '?t=' + Date.now();
    
    await updateProfile({ logo_url: url } as any);
    setLogoUrl(url);
    setUploading(false);
    toast({ title: 'Logo enviada', description: 'Sua logo foi salva com sucesso.' });
  };

  const handleRemoveLogo = async () => {
    if (!user) return;
    await updateProfile({ logo_url: null } as any);
    setLogoUrl(null);
    toast({ title: 'Logo removida' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await updateProfile({
      full_name: formData.full_name,
      crp: formData.crp,
      phone: formData.phone || null,
      clinic_address: formData.clinic_address || null,
    } as any);

    setSaving(false);

    if (error) {
      toast({ title: 'Erro ao salvar', description: 'Não foi possível atualizar o perfil.', variant: 'destructive' });
    } else {
      toast({ title: 'Perfil atualizado', description: 'Suas informações foram salvas com sucesso.' });
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
      <div className="mx-auto max-w-2xl space-y-6">
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
              {/* Logo Upload */}
              <div className="space-y-2">
                <Label>Logo do Consultório (opcional)</Label>
                <div className="flex items-center gap-4">
                  {logoUrl ? (
                    <div className="relative">
                      <img src={logoUrl} alt="Logo" className="h-16 w-16 rounded-lg object-contain border border-border" />
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="h-16 w-16 rounded-lg border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
                    >
                      <Upload className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                  <div className="text-sm text-muted-foreground">
                    {uploading ? 'Enviando...' : 'PNG ou JPG, máx. 2MB'}
                  </div>
                </div>
              </div>

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

              <div className="space-y-2">
                <Label htmlFor="clinic_address">Endereço do Consultório</Label>
                <Textarea
                  id="clinic_address"
                  value={formData.clinic_address}
                  onChange={(e) => setFormData({ ...formData, clinic_address: e.target.value })}
                  placeholder="Rua Exemplo, 123 - Sala 45 - Centro - São Paulo/SP"
                  rows={2}
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
