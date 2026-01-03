import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { usePatients } from '@/hooks/usePatients';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Save, 
  Calendar,
  Brain,
  Moon,
  Heart,
  Utensils,
  Pill,
  Stethoscope,
  FileText,
  Monitor,
  MapPin
} from 'lucide-react';
import {
  sessionTopics,
  sleepPatterns,
  moods,
  eatingPatterns,
  medicationStatus,
  therapyApproaches,
  techniquesByApproach,
  dsmDiagnoses,
  cidDiagnoses,
} from '@/data/psychologyData';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function SessionForm() {
  const { patientId, sessionId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getPatient, addSession, sessions, updateSession } = usePatients();
  
  const patient = getPatient(patientId!);
  const existingSession = sessionId ? sessions.find(s => s.id === sessionId) : null;
  const isEditing = !!existingSession;

  const [formData, setFormData] = useState({
    date: existingSession?.date || new Date().toISOString().split('T')[0],
    time: existingSession?.time || '',
    modality: existingSession?.modality || 'presencial' as 'presencial' | 'online',
    topics: existingSession?.topics || [] as string[],
    sleepPattern: existingSession?.sleep_pattern || '',
    mood: existingSession?.mood || [] as string[],
    eating: existingSession?.eating || '',
    medicationStatus: existingSession?.medication_status || '',
    newMedication: existingSession?.medication_new || '',
    approach: existingSession?.approach || '',
    techniques: existingSession?.techniques || [] as string[],
    dsmDiagnosis: existingSession?.dsm_diagnosis || [] as string[],
    cidDiagnosis: existingSession?.cid_diagnosis || [] as string[],
    notes: existingSession?.notes || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item)
      ? array.filter((i) => i !== item)
      : [...array, item];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!formData.date) newErrors.date = 'Data é obrigatória';
    if (!formData.time) newErrors.time = 'Horário é obrigatório';
    if (formData.topics.length === 0) newErrors.topics = 'Selecione pelo menos um tema';
    if (!formData.sleepPattern) newErrors.sleepPattern = 'Selecione o padrão de sono';
    if (formData.mood.length === 0) newErrors.mood = 'Selecione pelo menos um humor';
    if (!formData.eating) newErrors.eating = 'Selecione o padrão alimentar';
    if (!formData.medicationStatus) newErrors.medicationStatus = 'Selecione o status da medicação';
    if (!formData.approach) newErrors.approach = 'Selecione a abordagem';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha todos os campos obrigatórios.',
        variant: 'destructive',
      });
      return;
    }

    const sessionData = {
      patient_id: patientId!,
      session_type: 'regular' as const,
      date: formData.date,
      time: formData.time,
      duration_minutes: 50,
      modality: formData.modality,
      topics: formData.topics,
      sleep_pattern: formData.sleepPattern,
      mood: formData.mood,
      eating: formData.eating,
      medication_status: formData.medicationStatus,
      medication_new: formData.medicationStatus === 'mudanca' ? formData.newMedication : undefined,
      approach: formData.approach,
      techniques: formData.techniques,
      dsm_diagnosis: formData.dsmDiagnosis,
      cid_diagnosis: formData.cidDiagnosis,
      notes: formData.notes,
      referral_needed: false,
    };

    if (isEditing) {
      const { error } = await updateSession(sessionId!, sessionData);
      if (error) {
        toast({ title: 'Erro', description: 'Não foi possível atualizar a sessão.', variant: 'destructive' });
      } else {
        toast({ title: 'Sessão atualizada', description: 'Os dados da sessão foram atualizados com sucesso.' });
        navigate(`/patients/${patientId}`);
      }
    } else {
      const { error } = await addSession(patientId!, sessionData);
      if (error) {
        toast({ title: 'Erro', description: 'Não foi possível registrar a sessão.', variant: 'destructive' });
      } else {
        toast({ title: 'Sessão registrada', description: 'A sessão foi registrada com sucesso.' });
        navigate(`/patients/${patientId}`);
      }
    }
  };

  if (!patient) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h2 className="text-xl font-semibold text-foreground">Paciente não encontrado</h2>
          <Button className="mt-6" asChild>
            <Link to="/patients">Voltar para Pacientes</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-4xl space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/patients/${patientId}`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isEditing ? 'Editar Sessão' : 'Nova Sessão'}
            </h1>
            <p className="text-muted-foreground">
              Paciente: <span className="font-medium text-foreground">{patient.name}</span>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Data e Horário */}
          <Card className="border-border bg-card shadow-card">
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Calendar className="h-5 w-5" />
              </div>
              <CardTitle>Data e Modalidade</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="date">Data da Sessão *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className={errors.date ? 'border-destructive' : ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Horário *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className={errors.time ? 'border-destructive' : ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Modalidade</Label>
                  <RadioGroup
                    value={formData.modality}
                    onValueChange={(value: 'presencial' | 'online') => 
                      setFormData({ ...formData, modality: value })
                    }
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="presencial" id="presencial" />
                      <Label htmlFor="presencial" className="flex items-center gap-1.5 cursor-pointer">
                        <MapPin className="h-4 w-4" />
                        Presencial
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="online" id="online" />
                      <Label htmlFor="online" className="flex items-center gap-1.5 cursor-pointer">
                        <Monitor className="h-4 w-4" />
                        Online
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Questões Tratadas */}
          <Card className="border-border bg-card shadow-card">
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20 text-accent-foreground">
                <FileText className="h-5 w-5" />
              </div>
              <CardTitle>Questões Tratadas *</CardTitle>
              <CardDescription>Selecione os temas abordados na sessão</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {sessionTopics.map((topic) => (
                  <Badge
                    key={topic}
                    variant={formData.topics.includes(topic) ? 'default' : 'outline'}
                    className="cursor-pointer transition-all hover:scale-105"
                    onClick={() => setFormData({ 
                      ...formData, 
                      topics: toggleArrayItem(formData.topics, topic) 
                    })}
                  >
                    {topic}
                  </Badge>
                ))}
              </div>
              {errors.topics && (
                <p className="mt-2 text-sm text-destructive">{errors.topics}</p>
              )}
            </CardContent>
          </Card>

          {/* Estado Geral */}
          <Card className="border-border bg-card shadow-card">
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 text-success">
                <Heart className="h-5 w-5" />
              </div>
              <CardTitle>Estado Geral do Paciente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Sono */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Moon className="h-4 w-4 text-primary" />
                  Padrão do Sono *
                </Label>
                <RadioGroup
                  value={formData.sleepPattern}
                  onValueChange={(value) => setFormData({ ...formData, sleepPattern: value })}
                  className="flex flex-wrap gap-3"
                >
                  {sleepPatterns.map((pattern) => (
                    <div key={pattern.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={pattern.value} id={`sleep-${pattern.value}`} />
                      <Label htmlFor={`sleep-${pattern.value}`} className="cursor-pointer">
                        {pattern.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                {errors.sleepPattern && (
                  <p className="text-sm text-destructive">{errors.sleepPattern}</p>
                )}
              </div>

              {/* Humor */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-primary" />
                  Humor * (selecione todos que se aplicam)
                </Label>
                <div className="flex flex-wrap gap-2">
                  {moods.map((mood) => (
                    <Badge
                      key={mood.value}
                      variant={formData.mood.includes(mood.value) ? 'default' : 'outline'}
                      className="cursor-pointer transition-all hover:scale-105"
                      onClick={() => setFormData({ 
                        ...formData, 
                        mood: toggleArrayItem(formData.mood, mood.value) 
                      })}
                    >
                      {mood.label}
                    </Badge>
                  ))}
                </div>
                {errors.mood && (
                  <p className="text-sm text-destructive">{errors.mood}</p>
                )}
              </div>

              {/* Alimentação */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Utensils className="h-4 w-4 text-primary" />
                  Alimentação *
                </Label>
                <RadioGroup
                  value={formData.eating}
                  onValueChange={(value) => setFormData({ ...formData, eating: value })}
                  className="flex flex-wrap gap-3"
                >
                  {eatingPatterns.map((pattern) => (
                    <div key={pattern.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={pattern.value} id={`eating-${pattern.value}`} />
                      <Label htmlFor={`eating-${pattern.value}`} className="cursor-pointer">
                        {pattern.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                {errors.eating && (
                  <p className="text-sm text-destructive">{errors.eating}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Medicação */}
          <Card className="border-border bg-card shadow-card">
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                <Pill className="h-5 w-5" />
              </div>
              <CardTitle>Medicação *</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={formData.medicationStatus}
                onValueChange={(value) => setFormData({ ...formData, medicationStatus: value })}
                className="space-y-2"
              >
                {medicationStatus.map((status) => (
                  <div key={status.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={status.value} id={`med-${status.value}`} />
                    <Label htmlFor={`med-${status.value}`} className="cursor-pointer">
                      {status.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {errors.medicationStatus && (
                <p className="text-sm text-destructive">{errors.medicationStatus}</p>
              )}

              {formData.medicationStatus === 'mudanca' && (
                <div className="mt-4 space-y-2">
                  <Label htmlFor="newMedication">Nova Terapêutica Médica</Label>
                  <Textarea
                    id="newMedication"
                    placeholder="Descreva a nova medicação..."
                    value={formData.newMedication}
                    onChange={(e) => setFormData({ ...formData, newMedication: e.target.value })}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Abordagem e Técnicas */}
          <Card className="border-border bg-card shadow-card">
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Brain className="h-5 w-5" />
              </div>
              <CardTitle>Abordagem e Técnicas *</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Abordagem Terapêutica *</Label>
                <Select
                  value={formData.approach}
                  onValueChange={(value) => setFormData({ 
                    ...formData, 
                    approach: value,
                    techniques: [] // Reset techniques when approach changes
                  })}
                >
                  <SelectTrigger className={errors.approach ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Selecione a abordagem" />
                  </SelectTrigger>
                  <SelectContent>
                    {therapyApproaches.map((approach) => (
                      <SelectItem key={approach.value} value={approach.value}>
                        {approach.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.approach && (
                <div className="space-y-2">
                  <Label>Técnicas Utilizadas</Label>
                  <div className="flex flex-wrap gap-2">
                    {techniquesByApproach[formData.approach]?.map((technique) => (
                      <Badge
                        key={technique}
                        variant={formData.techniques.includes(technique) ? 'default' : 'outline'}
                        className="cursor-pointer transition-all hover:scale-105"
                        onClick={() => setFormData({ 
                          ...formData, 
                          techniques: toggleArrayItem(formData.techniques, technique) 
                        })}
                      >
                        {technique}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Diagnósticos */}
          <Card className="border-border bg-card shadow-card">
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20 text-accent-foreground">
                <Stethoscope className="h-5 w-5" />
              </div>
              <CardTitle>Classificação Diagnóstica</CardTitle>
              <CardDescription>Opcional - Selecione se aplicável ao caso</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" className="w-full">
                <AccordionItem value="dsm">
                  <AccordionTrigger>DSM-5-TR</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {dsmDiagnoses.map((diag) => (
                        <Badge
                          key={diag.code}
                          variant={formData.dsmDiagnosis.includes(diag.code) ? 'default' : 'outline'}
                          className="cursor-pointer transition-all hover:scale-105"
                          onClick={() => setFormData({ 
                            ...formData, 
                            dsmDiagnosis: toggleArrayItem(formData.dsmDiagnosis, diag.code) 
                          })}
                        >
                          {diag.code} - {diag.name}
                        </Badge>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="cid">
                  <AccordionTrigger>CID-10</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {cidDiagnoses.map((diag) => (
                        <Badge
                          key={diag.code}
                          variant={formData.cidDiagnosis.includes(diag.code) ? 'default' : 'outline'}
                          className="cursor-pointer transition-all hover:scale-105"
                          onClick={() => setFormData({ 
                            ...formData, 
                            cidDiagnosis: toggleArrayItem(formData.cidDiagnosis, diag.code) 
                          })}
                        >
                          {diag.code} - {diag.name}
                        </Badge>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Observações */}
          <Card className="border-border bg-card shadow-card">
            <CardHeader>
              <CardTitle>Observações Adicionais</CardTitle>
              <CardDescription>Anotações livres sobre a sessão</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Digite observações adicionais sobre a sessão..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button type="button" variant="outline" asChild className="flex-1">
              <Link to={`/patients/${patientId}`}>Cancelar</Link>
            </Button>
            <Button type="submit" className="flex-1">
              <Save className="h-4 w-4" />
              {isEditing ? 'Salvar Alterações' : 'Registrar Sessão'}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
