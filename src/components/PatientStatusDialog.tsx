import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePatients } from '@/hooks/usePatients';
import { useToast } from '@/hooks/use-toast';
import { TreatmentStatus, PatientStatusHistory } from '@/types';
import { Activity, Clock, FileText } from 'lucide-react';

interface PatientStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientId: string;
  currentStatus: TreatmentStatus;
}

const statusOptions: { value: TreatmentStatus; label: string; description: string }[] = [
  { value: 'ativo', label: 'Ativo', description: 'Paciente em tratamento regular' },
  { value: 'alta', label: 'Alta', description: 'Tratamento concluído com sucesso' },
  { value: 'abandono', label: 'Abandono', description: 'Paciente abandonou o tratamento' },
  { value: 'encaminhado', label: 'Encaminhado', description: 'Encaminhado a outro profissional' },
  { value: 'suspenso', label: 'Suspenso', description: 'Tratamento temporariamente suspenso' },
];

const statusColors: Record<TreatmentStatus, string> = {
  ativo: 'bg-green-500/10 text-green-700 border-green-200',
  alta: 'bg-blue-500/10 text-blue-700 border-blue-200',
  abandono: 'bg-red-500/10 text-red-700 border-red-200',
  encaminhado: 'bg-yellow-500/10 text-yellow-700 border-yellow-200',
  suspenso: 'bg-gray-500/10 text-gray-700 border-gray-200',
};

export function PatientStatusDialog({
  open,
  onOpenChange,
  patientId,
  currentStatus,
}: PatientStatusDialogProps) {
  const { updatePatientStatus, getPatientStatusHistory } = usePatients();
  const { toast } = useToast();
  
  const [newStatus, setNewStatus] = useState<TreatmentStatus>(currentStatus);
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [history, setHistory] = useState<PatientStatusHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    if (open) {
      setNewStatus(currentStatus);
      setReason('');
      setNotes('');
      loadHistory();
    }
  }, [open, patientId, currentStatus]);

  const loadHistory = async () => {
    setLoadingHistory(true);
    const { data } = await getPatientStatusHistory(patientId);
    if (data) {
      setHistory(data);
    }
    setLoadingHistory(false);
  };

  const handleSubmit = async () => {
    if (newStatus === currentStatus) {
      toast({
        title: 'Status não alterado',
        description: 'Selecione um status diferente do atual.',
        variant: 'destructive',
      });
      return;
    }

    if (!reason.trim()) {
      toast({
        title: 'Justificativa obrigatória',
        description: 'Informe o motivo da mudança de status.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    const { error } = await updatePatientStatus(patientId, newStatus, reason.trim(), notes.trim() || undefined);
    setLoading(false);

    if (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível alterar o status.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Status atualizado',
        description: `Status alterado para "${statusOptions.find(s => s.value === newStatus)?.label}".`,
      });
      onOpenChange(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Gerenciar Status do Paciente
          </DialogTitle>
          <DialogDescription>
            Altere o status do tratamento e registre o motivo
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Status */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Status atual:</span>
            <Badge variant="outline" className={`${statusColors[currentStatus]} border`}>
              {statusOptions.find(s => s.value === currentStatus)?.label}
            </Badge>
          </div>

          {/* New Status */}
          <div className="space-y-2">
            <Label htmlFor="newStatus">Novo Status *</Label>
            <Select value={newStatus} onValueChange={(v) => setNewStatus(v as TreatmentStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex flex-col">
                      <span>{option.label}</span>
                      <span className="text-xs text-muted-foreground">{option.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">Motivo da Alteração *</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Descreva o motivo da mudança de status..."
              rows={2}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Observações Adicionais</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observações complementares (opcional)..."
              rows={2}
            />
          </div>

          {/* History */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Histórico de Alterações
            </Label>
            <ScrollArea className="h-32 rounded-md border bg-muted/30 p-3">
              {loadingHistory ? (
                <div className="text-sm text-muted-foreground">Carregando...</div>
              ) : history.length === 0 ? (
                <div className="text-sm text-muted-foreground">Nenhum histórico registrado</div>
              ) : (
                <div className="space-y-3">
                  {history.map((item) => (
                    <div key={item.id} className="border-b border-border pb-2 last:border-0">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`${statusColors[item.status]} border text-xs`}>
                          {statusOptions.find(s => s.value === item.status)?.label}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDateTime(item.changed_at)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-foreground">{item.reason}</p>
                      {item.notes && (
                        <p className="mt-1 text-xs text-muted-foreground flex items-start gap-1">
                          <FileText className="h-3 w-3 mt-0.5" />
                          {item.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading || newStatus === currentStatus}>
            {loading ? 'Salvando...' : 'Salvar Alteração'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
