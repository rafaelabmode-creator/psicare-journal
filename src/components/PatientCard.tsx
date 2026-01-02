import { Link } from 'react-router-dom';
import { Patient } from '@/types';
import { Calendar, User, FileText, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PatientCardProps {
  patient: Patient;
  sessionCount: number;
}

export function PatientCard({ patient, sessionCount }: PatientCardProps) {
  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  return (
    <Link to={`/patients/${patient.id}`}>
      <Card className="group cursor-pointer border-border bg-card shadow-card transition-all duration-300 hover:shadow-card-hover hover:border-primary/30">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                <User className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {patient.name}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="font-mono">{formatCPF(patient.cpf)}</span>
                  <span className="hidden sm:inline">•</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{formatDate(patient.birthDate)}</span>
                  </div>
                  <Badge variant="secondary" className="font-medium">
                    {calculateAge(patient.birthDate)} anos
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {sessionCount} {sessionCount === 1 ? 'sessão' : 'sessões'}
                  </span>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground/50 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
