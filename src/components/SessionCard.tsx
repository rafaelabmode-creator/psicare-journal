import { Session } from '@/types';
import { Calendar, Clock, Monitor, MapPin, ChevronRight, Brain, Pill, Moon, Utensils, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { therapyApproaches, sleepPatterns, moods, eatingPatterns } from '@/data/psychologyData';

interface SessionCardProps {
  session: Session;
  onClick?: () => void;
}

export function SessionCard({ session, onClick }: SessionCardProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getApproachLabel = (value: string) => {
    return therapyApproaches.find(a => a.value === value)?.label || value;
  };

  const getSleepLabel = (value: string) => {
    return sleepPatterns.find(s => s.value === value)?.label || value;
  };

  const getMoodLabels = (values: string[]) => {
    return values.map(v => moods.find(m => m.value === v)?.label || v);
  };

  const getEatingLabel = (value: string) => {
    return eatingPatterns.find(e => e.value === value)?.label || value;
  };

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
                <span>{session.time}</span>
              </div>
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
            </div>

            {/* Topics */}
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

            {/* Quick Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Brain className="h-4 w-4 text-primary" />
                <span>{getApproachLabel(session.approach)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Moon className="h-4 w-4" />
                <span>{getSleepLabel(session.sleepPattern)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Heart className="h-4 w-4" />
                <span>{getMoodLabels(session.mood).slice(0, 2).join(', ')}</span>
              </div>
            </div>
          </div>

          <ChevronRight className="h-5 w-5 text-muted-foreground/50 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
        </div>
      </CardContent>
    </Card>
  );
}
