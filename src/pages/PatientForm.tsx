import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePatients } from '@/hooks/usePatients';
import { ArrowLeft, Save, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function PatientForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { patients, addPatient, updatePatient, getPatient } = usePatients();
  
  const existingPatient = id ? getPatient(id) : null;
  const isEditing = !!existingPatient;

  const [formData, setFormData] = useState({
    name: existingPatient?.name || '',
    cpf: existingPatient?.cpf || '',
    birthDate: existingPatient?.birthDate || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  const validateCPF = (cpf: string) => {
    const numbers = cpf.replace(/\D/g, '');
    return numbers.length === 11;
  };

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (!validateCPF(formData.cpf)) {
      newErrors.cpf = 'CPF inválido';
    }
    
    if (!formData.birthDate) {
      newErrors.birthDate = 'Data de nascimento é obrigatória';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const cpfNumbers = formData.cpf.replace(/\D/g, '');
    
    if (isEditing) {
      updatePatient(id!, { ...formData, cpf: cpfNumbers });
      toast({
        title: 'Paciente atualizado',
        description: 'Os dados do paciente foram atualizados com sucesso.',
      });
    } else {
      const newPatient = addPatient({ ...formData, cpf: cpfNumbers });
      toast({
        title: 'Paciente cadastrado',
        description: 'O paciente foi cadastrado com sucesso.',
      });
      navigate(`/patients/${newPatient.id}`);
      return;
    }
    
    navigate(`/patients/${id}`);
  };

  const age = calculateAge(formData.birthDate);

  return (
    <Layout>
      <div className="mx-auto max-w-2xl space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to={isEditing ? `/patients/${id}` : '/patients'}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isEditing ? 'Editar Paciente' : 'Novo Paciente'}
            </h1>
            <p className="text-muted-foreground">
              {isEditing ? 'Atualize os dados do paciente' : 'Preencha os dados do paciente'}
            </p>
          </div>
        </div>

        {/* Form */}
        <Card className="border-border bg-card shadow-card">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <User className="h-6 w-6" />
            </div>
            <CardTitle>Dados do Paciente</CardTitle>
            <CardDescription>
              Informações básicas para identificação do paciente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  placeholder="Digite o nome completo do paciente"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    setErrors({ ...errors, name: '' });
                  }}
                  className={errors.name ? 'border-destructive' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpf">CPF *</Label>
                <Input
                  id="cpf"
                  placeholder="000.000.000-00"
                  value={formatCPF(formData.cpf)}
                  onChange={(e) => {
                    setFormData({ ...formData, cpf: e.target.value });
                    setErrors({ ...errors, cpf: '' });
                  }}
                  className={errors.cpf ? 'border-destructive' : ''}
                />
                {errors.cpf && (
                  <p className="text-sm text-destructive">{errors.cpf}</p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Data de Nascimento *</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => {
                      setFormData({ ...formData, birthDate: e.target.value });
                      setErrors({ ...errors, birthDate: '' });
                    }}
                    className={errors.birthDate ? 'border-destructive' : ''}
                  />
                  {errors.birthDate && (
                    <p className="text-sm text-destructive">{errors.birthDate}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Idade</Label>
                  <div className="flex h-10 items-center rounded-lg border border-input bg-muted px-3">
                    <span className="text-foreground">
                      {age !== null ? `${age} anos` : '—'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" asChild className="flex-1">
                  <Link to={isEditing ? `/patients/${id}` : '/patients'}>
                    Cancelar
                  </Link>
                </Button>
                <Button type="submit" className="flex-1">
                  <Save className="h-4 w-4" />
                  {isEditing ? 'Salvar Alterações' : 'Cadastrar Paciente'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
