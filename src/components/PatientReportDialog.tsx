import { useState } from 'react';
import { Session, Patient } from '@/types';
import { generatePatientReport } from '@/utils/sessionNarrative';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FileUser, Copy, Check, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PatientReportDialogProps {
  session: Session;
  patient: Patient;
}

export function PatientReportDialog({ session, patient }: PatientReportDialogProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  const report = generatePatientReport(session, patient);
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(report);
      setCopied(true);
      toast({
        title: 'Copiado!',
        description: 'Relatório copiado para a área de transferência.',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: 'Erro',
        description: 'Não foi possível copiar o texto.',
        variant: 'destructive',
      });
    }
  };
  
  const handleDownload = () => {
    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio_${patient.name.replace(/\s+/g, '_')}_${session.date}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Download iniciado',
      description: 'O relatório está sendo baixado.',
    });
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FileUser className="h-4 w-4" />
          Relatório para Paciente
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Relatório para o Paciente</DialogTitle>
          <DialogDescription>
            Relatório simplificado para envio ao paciente, conforme normas do CFP.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto">
          <Textarea
            value={report}
            readOnly
            className="min-h-[300px] resize-none font-mono text-sm"
          />
        </div>
        
        <div className="flex gap-2 pt-4 border-t">
          <Button onClick={handleCopy} variant="outline" className="gap-2">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copiado!' : 'Copiar'}
          </Button>
          <Button onClick={handleDownload} className="gap-2">
            <Download className="h-4 w-4" />
            Baixar TXT
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
