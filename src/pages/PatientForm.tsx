import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { usePatients } from '@/hooks/usePatients';
import { ArrowLeft, Save, User, MapPin, Phone, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const brazilStates = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 
  'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 
  'SP', 'SE', 'TO'
];

export default function PatientForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { patients, addPatient, updatePatient, getPatient, loading } = usePatients();
  
  const existingPatient = id ? getPatient(id) : null;
  const isEditing = !!existingPatient;

  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    birth_date: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    phone: '',
    email: '',
    profession: '',
    is_minor: false,
    guardian_name: '',
    guardian_cpf: '',
    guardian_phone: '',
    guardian_relationship: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (existingPatient) {
      setFormData({
        name: existingPatient.name || '',
        cpf: existingPatient.cpf || '',
        birth_date: existingPatient.birth_date || '',
        address: existingPatient.address || '',
        city: existingPatient.city || '',
        state: existingPatient.state || '',
        zip_code: existingPatient.zip_code || '',
        phone: existingPatient.phone || '',
        email: existingPatient.email || '',
        profession: existingPatient.profession || '',
        is_minor: existingPatient.is_minor || false,
        guardian_name: existingPatient.guardian_name || '',
        guardian_cpf: existingPatient.guardian_cpf || '',
        guardian_phone: existingPatient.guardian_phone || '',
        guardian_relationship: existingPatient.guardian_relationship || '',
      });
    }
  }, [existingPatient]);

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return numbers.slice(0, 11).replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.slice(0, 8).replace(/(\d{5})(\d{3})/, '$1-$2');
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

  const handleSubmit = async (e: React.FormEvent) => {
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
    
    if (!formData.birth_date) {
      newErrors.birth_date = 'Data de nascimento é obrigatória';
    }

    if (formData.is_minor && !formData.guardian_name) {
      newErrors.guardian_name = 'Nome do responsável é obrigatório para menores';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const cpfNumbers = formData.cpf.replace(/\D/g, '');
    const guardianCpfNumbers = formData.guardian_cpf.replace(/\D/g, '');
    const phoneNumbers = formData.phone.replace(/\D/g, '');
    const guardianPhoneNumbers = formData.guardian_phone.replace(/\D/g, '');
    const zipNumbers = formData.zip_code.replace(/\D/g, '');
    
    const patientData = {
      ...formData,
      cpf: cpfNumbers,
      guardian_cpf: guardianCpfNumbers || undefined,
      phone: phoneNumbers || undefined,
      guardian_phone: guardianPhoneNumbers || undefined,
      zip_code: zipNumbers || undefined,
    };
    
    if (isEditing) {
      const { error } = await updatePatient(id!, patientData);
      if (error) {
        toast({
          title: 'Erro',
          description: 'Não foi possível atualizar o paciente.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Paciente atualizado',
          description: 'Os dados do paciente foram atualizados com sucesso.',
        });
        navigate(`/patients/${id}`);
      }
    } else {
      const { error, data } = await addPatient(patientData);
      if (error) {
        toast({
          title: 'Erro',
          description: 'Não foi possível cadastrar o paciente.',
          variant: 'destructive',
        });
      } else if (data) {
        toast({
          title: 'Paciente cadastrado',
          description: 'O paciente foi cadastrado com sucesso.',
        });
        navigate(`/patients/${data.id}`);
      }
    }
  };

  const age = calculateAge(formData.birth_date);

  // Auto-detect if minor
  useEffect(() => {
    if (age !== null && age < 18) {
      setFormData(prev => ({ ...prev, is_minor: true }));
    }
  }, [age]);

  if (loading && isEditing) {
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
      <div className="mx-auto max-w-3xl space-y-6 animate-fade-in">
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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados Pessoais */}
          <Card className="border-border bg-card shadow-card">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <User className="h-6 w-6" />
              </div>
              <CardTitle>Dados Pessoais</CardTitle>
              <CardDescription>
                Informações básicas para identificação do paciente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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

              <div className="grid gap-4 sm:grid-cols-2">
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

                <div className="space-y-2">
                  <Label htmlFor="birth_date">Data de Nascimento *</Label>
                  <Input
                    id="birth_date"
                    type="date"
                    value={formData.birth_date}
                    onChange={(e) => {
                      setFormData({ ...formData, birth_date: e.target.value });
                      setErrors({ ...errors, birth_date: '' });
                    }}
                    className={errors.birth_date ? 'border-destructive' : ''}
                  />
                  {errors.birth_date && (
                    <p className="text-sm text-destructive">{errors.birth_date}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Idade</Label>
                  <div className="flex h-10 items-center rounded-lg border border-input bg-muted px-3">
                    <span className="text-foreground">
                      {age !== null ? `${age} anos` : '—'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="profession">Profissão</Label>
                  <Input
                    id="profession"
                    placeholder="Ex: Engenheiro, Estudante..."
                    value={formData.profession}
                    onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contato */}
          <Card className="border-border bg-card shadow-card">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/20 text-accent-foreground">
                <Phone className="h-6 w-6" />
              </div>
              <CardTitle>Contato</CardTitle>
              <CardDescription>
                Informações de contato do paciente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    placeholder="(00) 00000-0000"
                    value={formatPhone(formData.phone)}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@exemplo.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Endereço */}
          <Card className="border-border bg-card shadow-card">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                <MapPin className="h-6 w-6" />
              </div>
              <CardTitle>Endereço</CardTitle>
              <CardDescription>
                Endereço residencial do paciente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  placeholder="Rua, número, complemento"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    placeholder="Cidade"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">Estado</Label>
                  <Select
                    value={formData.state}
                    onValueChange={(value) => setFormData({ ...formData, state: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {brazilStates.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip_code">CEP</Label>
                  <Input
                    id="zip_code"
                    placeholder="00000-000"
                    value={formatCEP(formData.zip_code)}
                    onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Responsável Legal */}
          <Card className="border-border bg-card shadow-card">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 text-success">
                <Users className="h-6 w-6" />
              </div>
              <CardTitle>Responsável Legal</CardTitle>
              <CardDescription>
                Dados do responsável legal (obrigatório para menores de 18 anos)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_minor"
                  checked={formData.is_minor}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, is_minor: checked as boolean })
                  }
                />
                <Label htmlFor="is_minor" className="cursor-pointer">
                  Paciente é menor de idade
                </Label>
              </div>

              {formData.is_minor && (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="guardian_name">Nome do Responsável *</Label>
                      <Input
                        id="guardian_name"
                        placeholder="Nome completo do responsável"
                        value={formData.guardian_name}
                        onChange={(e) => {
                          setFormData({ ...formData, guardian_name: e.target.value });
                          setErrors({ ...errors, guardian_name: '' });
                        }}
                        className={errors.guardian_name ? 'border-destructive' : ''}
                      />
                      {errors.guardian_name && (
                        <p className="text-sm text-destructive">{errors.guardian_name}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="guardian_relationship">Parentesco</Label>
                      <Input
                        id="guardian_relationship"
                        placeholder="Ex: Mãe, Pai, Avó..."
                        value={formData.guardian_relationship}
                        onChange={(e) => setFormData({ ...formData, guardian_relationship: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="guardian_cpf">CPF do Responsável</Label>
                      <Input
                        id="guardian_cpf"
                        placeholder="000.000.000-00"
                        value={formatCPF(formData.guardian_cpf)}
                        onChange={(e) => setFormData({ ...formData, guardian_cpf: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="guardian_phone">Telefone do Responsável</Label>
                      <Input
                        id="guardian_phone"
                        placeholder="(00) 00000-0000"
                        value={formatPhone(formData.guardian_phone)}
                        onChange={(e) => setFormData({ ...formData, guardian_phone: e.target.value })}
                      />
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
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
      </div>
    </Layout>
  );
}
