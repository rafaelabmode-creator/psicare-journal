import { useState, useEffect, useRef } from 'react';
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
import { Switch } from '@/components/ui/switch';
import { usePatients } from '@/hooks/usePatients';
import { useToast } from '@/hooks/use-toast';
import { SessionType, SessionModality, TherapyApproach } from '@/types';
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
  MapPin,
  Clock,
  ClipboardList,
  TrendingUp,
  ArrowRightLeft,
  Target,
  History,
  NotebookPen,
  Plus,
  X,
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
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const documentTypes = [
  { value: 'laudo', label: 'Laudo Psicológico' },
  { value: 'atestado', label: 'Atestado' },
  { value: 'declaracao', label: 'Declaração' },
  { value: 'termo', label: 'Termo de Consentimento' },
  { value: 'relatorio', label: 'Relatório' },
  { value: 'teste', label: 'Teste Psicológico' },
  { value: 'desenho', label: 'Desenho / Material do Paciente' },
  { value: 'outro', label: 'Outro' },
];

const sessionTypes = [
  { value: 'anamnese', label: 'Anamnese (Primeira Consulta)', description: 'Avaliação inicial completa do paciente' },
  { value: 'regular', label: 'Sessão Regular', description: 'Atendimento de acompanhamento' },
  { value: 'encerramento', label: 'Encerramento', description: 'Sessão final do tratamento' },
];

const durationOptions = [
  { value: 30, label: '30 minutos' },
  { value: 45, label: '45 minutos' },
  { value: 50, label: '50 minutos' },
  { value: 60, label: '60 minutos' },
  { value: 90, label: '90 minutos' },
  { value: 120, label: '120 minutos' },
];

export default function SessionForm() {
  const { patientId, sessionId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { getPatient, addSession, sessions, updateSession } = usePatients();
  
  const patient = getPatient(patientId!);
  const existingSession = sessionId ? sessions.find(s => s.id === sessionId) : null;
  const isEditing = !!existingSession;

  const [formData, setFormData] = useState({
    sessionType: (existingSession?.session_type || 'regular') as SessionType,
    date: existingSession?.date || new Date().toISOString().split('T')[0],
    time: existingSession?.time || '',
    durationMinutes: existingSession?.duration_minutes || 50,
    modality: (existingSession?.modality || 'presencial') as SessionModality,
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
    // Campos de evolução clínica
    clinicalObservations: existingSession?.clinical_observations || '',
    clinicalHypotheses: existingSession?.clinical_hypotheses || '',
    observedProgress: existingSession?.observed_progress || '',
    interventions: existingSession?.interventions || '',
    // Encaminhamento
    referralNeeded: existingSession?.referral_needed || false,
    referralTo: existingSession?.referral_to || '',
    referralReason: existingSession?.referral_reason || '',
    // Campos de anamnese
    mainComplaint: existingSession?.main_complaint || '',
    complaintHistory: existingSession?.complaint_history || '',
    relevantHistory: existingSession?.relevant_history || '',
    therapeuticGoals: existingSession?.therapeutic_goals || '',
    treatmentPlan: existingSession?.treatment_plan || '',
    // Observações gerais
    notes: existingSession?.notes || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [customTopicInput, setCustomTopicInput] = useState('');
  const [customTechniqueInput, setCustomTechniqueInput] = useState('');
  const [customTopics, setCustomTopics] = useState<string[]>([]);
  const [customTechniques, setCustomTechniques] = useState<string[]>([]);
  const [pendingFiles, setPendingFiles] = useState<{ file: File; type: string; description: string }[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const addCustomTopic = () => {
    const topic = customTopicInput.trim();
    if (!topic) return;
    if (sessionTopics.includes(topic) || customTopics.includes(topic)) return;
    setCustomTopics([...customTopics, topic]);
    setFormData({ ...formData, topics: [...formData.topics, topic] });
    setCustomTopicInput('');
  };

  const removeCustomTopic = (topic: string) => {
    setCustomTopics(customTopics.filter(t => t !== topic));
    setFormData({ ...formData, topics: formData.topics.filter(t => t !== topic) });
  };

  const addCustomTechnique = () => {
    const technique = customTechniqueInput.trim();
    if (!technique) return;
    const existingTechs = techniquesByApproach[formData.approach] || [];
    if (existingTechs.includes(technique) || customTechniques.includes(technique)) return;
    setCustomTechniques([...customTechniques, technique]);
    setFormData({ ...formData, techniques: [...formData.techniques, technique] });
    setCustomTechniqueInput('');
  };

  const removeCustomTechnique = (technique: string) => {
    setCustomTechniques(customTechniques.filter(t => t !== technique));
    setFormData({ ...formData, techniques: formData.techniques.filter(t => t !== technique) });
  };

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
    
    // Validações específicas por tipo de sessão
    if (formData.sessionType === 'anamnese') {
      if (!formData.mainComplaint) newErrors.mainComplaint = 'Queixa principal é obrigatória para anamnese';
    } else {
      if (formData.topics.length === 0) newErrors.topics = 'Selecione pelo menos um tema';
      if (!formData.sleepPattern) newErrors.sleepPattern = 'Selecione o padrão de sono';
      if (formData.mood.length === 0) newErrors.mood = 'Selecione pelo menos um humor';
      if (!formData.eating) newErrors.eating = 'Selecione o padrão alimentar';
      if (!formData.medicationStatus) newErrors.medicationStatus = 'Selecione o status da medicação';
      if (!formData.approach) newErrors.approach = 'Selecione a abordagem';
    }

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
      session_type: formData.sessionType,
      date: formData.date,
      time: formData.time,
      duration_minutes: formData.durationMinutes,
      modality: formData.modality,
      topics: formData.topics,
      sleep_pattern: formData.sleepPattern || undefined,
      mood: formData.mood,
      eating: formData.eating || undefined,
      medication_status: formData.medicationStatus || undefined,
      medication_new: formData.medicationStatus === 'mudanca' ? formData.newMedication : undefined,
      approach: formData.approach || undefined,
      techniques: formData.techniques,
      dsm_diagnosis: formData.dsmDiagnosis,
      cid_diagnosis: formData.cidDiagnosis,
      clinical_observations: formData.clinicalObservations || undefined,
      clinical_hypotheses: formData.clinicalHypotheses || undefined,
      observed_progress: formData.observedProgress || undefined,
      interventions: formData.interventions || undefined,
      referral_needed: formData.referralNeeded,
      referral_to: formData.referralNeeded ? formData.referralTo : undefined,
      referral_reason: formData.referralNeeded ? formData.referralReason : undefined,
      main_complaint: formData.mainComplaint || undefined,
      complaint_history: formData.complaintHistory || undefined,
      relevant_history: formData.relevantHistory || undefined,
      therapeutic_goals: formData.therapeuticGoals || undefined,
      treatment_plan: formData.treatmentPlan || undefined,
      notes: formData.notes || undefined,
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
      const { error, data: newSession } = await addSession(patientId!, sessionData);
      if (error || !newSession) {
        toast({ title: 'Erro', description: 'Não foi possível registrar a sessão.', variant: 'destructive' });
      } else {
        // Upload arquivos pendentes
        if (pendingFiles.length > 0 && user) {
          setUploadingFiles(true);
          for (const pending of pendingFiles) {
            try {
              const fileExt = pending.file.name.split('.').pop();
              const fileName = `${user.id}/${newSession.id}/${Date.now()}.${fileExt}`;
              const { error: uploadError } = await supabase.storage
                .from('session-documents')
                .upload(fileName, pending.file);
              if (!uploadError) {
                await supabase.from('session_documents').insert({
                  session_id: newSession.id,
                  document_type: pending.type,
                  description: pending.description || pending.file.name,
                  file_path: fileName,
                });
              }
            } catch (e) {
              // continua mesmo se um arquivo falhar
            }
          }
          setUploadingFiles(false);
        }
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

  const isAnamnese = formData.sessionType === 'anamnese';

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
          {/* Tipo de Sessão */}
          <Card className="border-border bg-card shadow-card">
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ClipboardList className="h-5 w-5" />
              </div>
              <CardTitle>Tipo de Sessão</CardTitle>
              <CardDescription>Selecione o tipo de atendimento</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={formData.sessionType}
                onValueChange={(value: SessionType) => setFormData({ ...formData, sessionType: value })}
                className="grid gap-3 sm:grid-cols-3"
              >
                {sessionTypes.map((type) => (
                  <div key={type.value} className="relative">
                    <RadioGroupItem
                      value={type.value}
                      id={`type-${type.value}`}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={`type-${type.value}`}
                      className="flex flex-col gap-1 rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer transition-all"
                    >
                      <span className="font-semibold">{type.label}</span>
                      <span className="text-xs text-muted-foreground">{type.description}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Data, Horário e Duração */}
          <Card className="border-border bg-card shadow-card">
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Calendar className="h-5 w-5" />
              </div>
              <CardTitle>Data, Horário e Duração</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-4">
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
                  <Label htmlFor="duration" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Duração
                  </Label>
                  <Select
                    value={formData.durationMinutes.toString()}
                    onValueChange={(value) => setFormData({ ...formData, durationMinutes: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {durationOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value.toString()}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Modalidade</Label>
                  <RadioGroup
                    value={formData.modality}
                    onValueChange={(value: SessionModality) => 
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

          {/* Campos de Anamnese (apenas para primeira consulta) */}
          {isAnamnese && (
            <Card className="border-border bg-card shadow-card border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <NotebookPen className="h-5 w-5" />
                </div>
                <CardTitle>Anamnese - Avaliação Inicial</CardTitle>
                <CardDescription>Campos específicos para a primeira consulta</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mainComplaint">Queixa Principal *</Label>
                  <Textarea
                    id="mainComplaint"
                    placeholder="Descreva a queixa principal que trouxe o paciente ao atendimento..."
                    value={formData.mainComplaint}
                    onChange={(e) => setFormData({ ...formData, mainComplaint: e.target.value })}
                    rows={3}
                    className={errors.mainComplaint ? 'border-destructive' : ''}
                  />
                  {errors.mainComplaint && (
                    <p className="text-sm text-destructive">{errors.mainComplaint}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="complaintHistory">História da Queixa</Label>
                  <Textarea
                    id="complaintHistory"
                    placeholder="Quando começou, evolução, fatores desencadeantes..."
                    value={formData.complaintHistory}
                    onChange={(e) => setFormData({ ...formData, complaintHistory: e.target.value })}
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="relevantHistory">Histórico Relevante</Label>
                  <Textarea
                    id="relevantHistory"
                    placeholder="Histórico pessoal, familiar, tratamentos anteriores..."
                    value={formData.relevantHistory}
                    onChange={(e) => setFormData({ ...formData, relevantHistory: e.target.value })}
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="therapeuticGoals" className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Objetivos Terapêuticos
                  </Label>
                  <Textarea
                    id="therapeuticGoals"
                    placeholder="Objetivos acordados para o tratamento..."
                    value={formData.therapeuticGoals}
                    onChange={(e) => setFormData({ ...formData, therapeuticGoals: e.target.value })}
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="treatmentPlan">Plano de Tratamento</Label>
                  <Textarea
                    id="treatmentPlan"
                    placeholder="Estratégias, frequência das sessões, duração estimada..."
                    value={formData.treatmentPlan}
                    onChange={(e) => setFormData({ ...formData, treatmentPlan: e.target.value })}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Questões Tratadas (para sessões regulares) */}
          {!isAnamnese && (
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
                  {customTopics.map((topic) => (
                    <Badge
                      key={topic}
                      variant={formData.topics.includes(topic) ? 'default' : 'outline'}
                      className="cursor-pointer transition-all hover:scale-105 pr-1 gap-1"
                    >
                      <span onClick={() => setFormData({ 
                        ...formData, 
                        topics: toggleArrayItem(formData.topics, topic) 
                      })}>{topic}</span>
                      <span
                        onClick={() => removeCustomTopic(topic)}
                        className="ml-1 rounded-full hover:bg-destructive/20 p-0.5"
                        title="Remover"
                      >
                        <X className="h-3 w-3" />
                      </span>
                    </Badge>
                  ))}
                </div>

                {/* Adicionar tema personalizado */}
                <div className="flex gap-2 mt-3">
                  <input
                    type="text"
                    placeholder="Adicionar tema personalizado..."
                    value={customTopicInput}
                    onChange={(e) => setCustomTopicInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomTopic())}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                  <button
                    type="button"
                    onClick={addCustomTopic}
                    className="flex items-center gap-1 px-3 py-1 rounded-md bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Adicionar
                  </button>
                </div>

                {errors.topics && (
                  <p className="mt-2 text-sm text-destructive">{errors.topics}</p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Estado Geral (para sessões regulares) */}
          {!isAnamnese && (
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
          )}

          {/* Medicação (para sessões regulares) */}
          {!isAnamnese && (
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
          )}

          {/* Abordagem e Técnicas */}
          <Card className="border-border bg-card shadow-card">
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Brain className="h-5 w-5" />
              </div>
              <CardTitle>Abordagem e Técnicas {!isAnamnese && '*'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Abordagem Terapêutica {!isAnamnese && '*'}</Label>
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
                    {customTechniques.map((technique) => (
                      <Badge
                        key={technique}
                        variant={formData.techniques.includes(technique) ? 'default' : 'outline'}
                        className="cursor-pointer transition-all hover:scale-105 pr-1 gap-1"
                      >
                        <span onClick={() => setFormData({ 
                          ...formData, 
                          techniques: toggleArrayItem(formData.techniques, technique) 
                        })}>{technique}</span>
                        <span
                          onClick={() => removeCustomTechnique(technique)}
                          className="ml-1 rounded-full hover:bg-destructive/20 p-0.5"
                          title="Remover"
                        >
                          <X className="h-3 w-3" />
                        </span>
                      </Badge>
                    ))}
                  </div>

                  {/* Adicionar técnica personalizada */}
                  <div className="flex gap-2 mt-3">
                    <input
                      type="text"
                      placeholder="Adicionar técnica personalizada..."
                      value={customTechniqueInput}
                      onChange={(e) => setCustomTechniqueInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomTechnique())}
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                    <button
                      type="button"
                      onClick={addCustomTechnique}
                      className="flex items-center gap-1 px-3 py-1 rounded-md bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      Adicionar
                    </button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Evolução Clínica */}
          <Card className="border-border bg-card shadow-card">
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20 text-accent-foreground">
                <TrendingUp className="h-5 w-5" />
              </div>
              <CardTitle>Evolução Clínica</CardTitle>
              <CardDescription>Registre suas observações e hipóteses sobre o caso</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clinicalObservations">Observações Clínicas</Label>
                <Textarea
                  id="clinicalObservations"
                  placeholder="Comportamento observado, expressões, comunicação não-verbal..."
                  value={formData.clinicalObservations}
                  onChange={(e) => setFormData({ ...formData, clinicalObservations: e.target.value })}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="clinicalHypotheses">Hipóteses Clínicas</Label>
                <Textarea
                  id="clinicalHypotheses"
                  placeholder="Suas hipóteses sobre a dinâmica psíquica, padrões identificados..."
                  value={formData.clinicalHypotheses}
                  onChange={(e) => setFormData({ ...formData, clinicalHypotheses: e.target.value })}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="observedProgress">Progresso Observado</Label>
                <Textarea
                  id="observedProgress"
                  placeholder="Mudanças percebidas, avanços no tratamento, áreas de melhora..."
                  value={formData.observedProgress}
                  onChange={(e) => setFormData({ ...formData, observedProgress: e.target.value })}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="interventions">Intervenções Realizadas</Label>
                <Textarea
                  id="interventions"
                  placeholder="Descreva as intervenções específicas realizadas nesta sessão..."
                  value={formData.interventions}
                  onChange={(e) => setFormData({ ...formData, interventions: e.target.value })}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Encaminhamento */}
          <Card className="border-border bg-card shadow-card">
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10 text-warning">
                <ArrowRightLeft className="h-5 w-5" />
              </div>
              <CardTitle>Encaminhamento</CardTitle>
              <CardDescription>Registre necessidade de encaminhamento a outros profissionais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="referralNeeded">Necessita Encaminhamento?</Label>
                  <p className="text-sm text-muted-foreground">
                    Ative se o paciente precisa ser encaminhado a outro profissional
                  </p>
                </div>
                <Switch
                  id="referralNeeded"
                  checked={formData.referralNeeded}
                  onCheckedChange={(checked) => setFormData({ ...formData, referralNeeded: checked })}
                />
              </div>
              
              {formData.referralNeeded && (
                <div className="space-y-4 pt-4 border-t border-border">
                  <div className="space-y-2">
                    <Label htmlFor="referralTo">Encaminhar Para</Label>
                    <Input
                      id="referralTo"
                      placeholder="Ex: Psiquiatra, Neurologista, Nutricionista..."
                      value={formData.referralTo}
                      onChange={(e) => setFormData({ ...formData, referralTo: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="referralReason">Justificativa do Encaminhamento</Label>
                    <Textarea
                      id="referralReason"
                      placeholder="Descreva o motivo do encaminhamento..."
                      value={formData.referralReason}
                      onChange={(e) => setFormData({ ...formData, referralReason: e.target.value })}
                      rows={3}
                    />
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

          {/* Anexos */}
          <Card className="border-border bg-card shadow-card">
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileText className="h-5 w-5" />
              </div>
              <CardTitle>Anexos</CardTitle>
              <CardDescription>Testes, desenhos, documentos e outros arquivos desta sessão</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Arquivos selecionados */}
              {pendingFiles.length > 0 && (
                <div className="space-y-2">
                  {pendingFiles.map((pending, index) => (
                    <div key={index} className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{pending.description || pending.file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {documentTypes.find(t => t.value === pending.type)?.label} • {(pending.file.size / 1024).toFixed(0)}KB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPendingFiles(pendingFiles.filter((_, i) => i !== index))}
                        className="rounded-full p-1 hover:bg-destructive/10 text-destructive"
                        title="Remover"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Formulário para adicionar arquivo */}
              <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4 space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label>Tipo</Label>
                    <select
                      id="newFileType"
                      defaultValue="outro"
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                    >
                      {documentTypes.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <Label>Descrição</Label>
                    <input
                      id="newFileDescription"
                      type="text"
                      placeholder="Ex: Teste Beck, Desenho da família..."
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground"
                    />
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (file.size > 10 * 1024 * 1024) {
                      toast({ title: 'Arquivo muito grande', description: 'Máximo 10MB.', variant: 'destructive' });
                      return;
                    }
                    const typeEl = document.getElementById('newFileType') as HTMLSelectElement;
                    const descEl = document.getElementById('newFileDescription') as HTMLInputElement;
                    setPendingFiles([...pendingFiles, {
                      file,
                      type: typeEl?.value || 'outro',
                      description: descEl?.value || file.name,
                    }]);
                    if (descEl) descEl.value = '';
                    e.target.value = '';
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 rounded-md border border-border bg-background text-sm hover:bg-accent transition-colors w-full justify-center"
                >
                  <Plus className="h-4 w-4" />
                  Selecionar Arquivo
                </button>
                <p className="text-xs text-muted-foreground text-center">PDF, DOC, DOCX, JPG, PNG • Máximo 10MB • Os arquivos serão enviados ao salvar</p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button type="button" variant="outline" asChild className="flex-1">
              <Link to={`/patients/${patientId}`}>Cancelar</Link>
            </Button>
            <Button type="submit" className="flex-1" disabled={uploadingFiles}>
              <Save className="h-4 w-4" />
              {uploadingFiles ? 'Enviando arquivos...' : isEditing ? 'Salvar Alterações' : 'Registrar Sessão'}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
