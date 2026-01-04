import { Session, SessionType } from '@/types';
import { Calendar, Clock, Monitor, MapPin, ChevronRight, Brain, Moon, Heart, FileText, ClipboardList, ArrowRightLeft, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { therapyApproaches, sleepPatterns, moods } from '@/data/psychologyData';

interface SessionCardProps {
  session: Session;
  onClick?: () => void;
}

const sessionTypeLabels: Record<SessionType, string> = {
  anamnese: 'Primeira Consulta',
  regular: 'Sessão Regular',
  encerramento: 'Encerramento',
};

const sessionTypeColors: Record<SessionType, string> = {
  anamnese: 'bg-purple-500/10 text-purple-700 border-purple-200',
  regular: 'bg-primary/10 text-primary border-primary/20',
  encerramento: 'bg-orange-500/10 text-orange-700 border-orange-200',
};

export function SessionCard({ session, onClick }: SessionCardProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getApproachLabel = (value: string | null) => {
    if (!value) return 'Não especificada';
    return therapyApproaches.find(a => a.value === value)?.label || value;
  };

  const getSleepLabel = (value: string | null) => {
    if (!value) return 'Não informado';
    return sleepPatterns.find(s => s.value === value)?.label || value;
  };

  const getMoodLabels = (values: string[]) => {
    return values.map(v => moods.find(m => m.value === v)?.label || v);
  };

  const hasEvolutionNotes = session.clinical_observations || session.clinical_hypotheses || session.observed_progress || session.interventions;

  return (
    <Card 
      className="group cursor-pointer border-border bg-card shadow-card transition-all duration-300 hover:shadow-card-hover hover:border-primary/30"
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-4">
            {/* Header */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-foreground">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="font-semibold">{formatDate(session.date)}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{session.time} ({session.duration_minutes}min)</span>
              </div>
              <Badge 
                variant="outline"
                className={`${sessionTypeColors[session.session_type]} border`}
              >
                {session.session_type === 'anamnese' ? (
                  <ClipboardList className="h-3 w-3 mr-1" />
                ) : (
                  <FileText className="h-3 w-3 mr-1" />
                )}
                {sessionTypeLabels[session.session_type]}
              </Badge>
              <Badge 
                variant={session.modality === 'presencial' ? 'default' : 'secondary'}
                className="flex items-center gap-1"
              >
                {session.modality === 'presencial' ? (
                  <MapPin className="h-3 w-3" />
                ) : (
                  <Monitor className="h-3 w-3" />
                )}
                {session.modality === 'presencial' ? 'Presencial' : 'Online'}
              </Badge>
              {session.referral_needed && (
                <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                  <ArrowRightLeft className="h-3 w-3 mr-1" />
                  Encaminhamento
                </Badge>
              )}
            </div>

            {/* Topics */}
            {session.topics.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {session.topics.slice(0, 4).map((topic) => (
                  <Badge key={topic} variant="outline" className="text-xs">
                    {topic}
                  </Badge>
                ))}
                {session.topics.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{session.topics.length - 4}
                  </Badge>
                )}
              </div>
            )}

            {/* Anamnese preview for first consultation */}
            {session.session_type === 'anamnese' && session.main_complaint && (
              <div className="text-sm text-muted-foreground line-clamp-2">
                <span className="font-medium text-foreground">Queixa principal:</span> {session.main_complaint}
              </div>
            )}

            {/* Quick Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {session.approach && (
                <div className="flex items-center gap-1.5">
                  <Brain className="h-4 w-4 text-primary" />
                  <span>{getApproachLabel(session.approach)}</span>
                </div>
              )}
              {session.sleep_pattern && (
                <div className="flex items-center gap-1.5">
                  <Moon className="h-4 w-4" />
                  <span>{getSleepLabel(session.sleep_pattern)}</span>
                </div>
              )}
              {session.mood.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <Heart className="h-4 w-4" />
                  <span>{getMoodLabels(session.mood).slice(0, 2).join(', ')}</span>
                </div>
              )}
              {hasEvolutionNotes && (
                <div className="flex items-center gap-1.5 text-primary">
                  <TrendingUp className="h-4 w-4" />
                  <span>Evolução registrada</span>
                </div>
              )}
            </div>
          </div>

          <ChevronRight className="h-5 w-5 text-muted-foreground/50 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
        </div>
      </CardContent>
    </Card>
  );
}
