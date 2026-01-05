import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { SessionDocument } from '@/types';
import { Upload, FileText, Trash2, Download, File, Loader2 } from 'lucide-react';

interface SessionDocumentsProps {
  sessionId: string;
}

const documentTypes = [
  { value: 'laudo', label: 'Laudo Psicológico' },
  { value: 'atestado', label: 'Atestado' },
  { value: 'declaracao', label: 'Declaração' },
  { value: 'termo', label: 'Termo de Consentimento' },
  { value: 'relatorio', label: 'Relatório' },
  { value: 'outro', label: 'Outro' },
];

export function SessionDocuments({ sessionId }: SessionDocumentsProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [documents, setDocuments] = useState<SessionDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedType, setSelectedType] = useState('outro');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchDocuments();
  }, [sessionId]);

  const fetchDocuments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('session_documents')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setDocuments(data as SessionDocument[]);
    }
    setLoading(false);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'Arquivo muito grande',
        description: 'O tamanho máximo permitido é 10MB.',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);

    try {
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${sessionId}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('session-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Create document record
      const { error: dbError } = await supabase
        .from('session_documents')
        .insert({
          session_id: sessionId,
          document_type: selectedType,
          description: description.trim() || file.name,
          file_path: fileName,
        });

      if (dbError) throw dbError;

      toast({
        title: 'Documento enviado',
        description: 'O arquivo foi salvo com sucesso.',
      });

      // Reset form and refresh
      setSelectedType('outro');
      setDescription('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      fetchDocuments();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Erro no upload',
        description: 'Não foi possível enviar o arquivo.',
        variant: 'destructive',
      });
    }

    setUploading(false);
  };

  const handleDownload = async (doc: SessionDocument) => {
    if (!doc.file_path) return;

    try {
      const { data, error } = await supabase.storage
        .from('session-documents')
        .download(doc.file_path);

      if (error) throw error;

      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.description || 'documento';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: 'Erro no download',
        description: 'Não foi possível baixar o arquivo.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (doc: SessionDocument) => {
    try {
      // Delete from storage
      if (doc.file_path) {
        await supabase.storage
          .from('session-documents')
          .remove([doc.file_path]);
      }

      // Delete record
      const { error } = await supabase
        .from('session_documents')
        .delete()
        .eq('id', doc.id);

      if (error) throw error;

      toast({
        title: 'Documento removido',
        description: 'O arquivo foi excluído.',
      });

      fetchDocuments();
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: 'Erro ao excluir',
        description: 'Não foi possível remover o arquivo.',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTypeLabel = (type: string) => {
    return documentTypes.find(t => t.value === type)?.label || type;
  };

  return (
    <Card className="border-border bg-card shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Documentos Complementares
        </CardTitle>
        <CardDescription>
          Laudos, termos, relatórios e outros documentos desta sessão
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Form */}
        <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="docType">Tipo de Documento</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descrição do documento..."
              />
            </div>

            <div className="space-y-2">
              <Label>Arquivo</Label>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <Button
                variant="outline"
                className="w-full"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Selecionar Arquivo
                  </>
                )}
              </Button>
            </div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Formatos aceitos: PDF, DOC, DOCX, JPG, PNG. Máximo 10MB.
          </p>
        </div>

        {/* Documents List */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <File className="h-10 w-10 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              Nenhum documento anexado a esta sessão
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between rounded-lg border border-border bg-background p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{doc.description || 'Documento'}</p>
                    <p className="text-xs text-muted-foreground">
                      {getTypeLabel(doc.document_type)} • {formatDate(doc.created_at)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDownload(doc)}
                    title="Baixar"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10"
                        title="Excluir"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir documento?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação não pode ser desfeita. O arquivo será permanentemente removido.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(doc)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
