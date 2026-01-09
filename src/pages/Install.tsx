import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Smartphone, Monitor, CheckCircle2, Wifi, WifiOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const Install = () => {
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if running as standalone (installed)
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    setIsInstalled(isStandalone);

    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    // Listen for app installed
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    // Listen for online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">PsiProntuário</h1>
          <p className="text-muted-foreground">
            Instale o aplicativo para acesso rápido e funcionalidade offline
          </p>
        </div>

        {/* Status de Conexão */}
        <Card className={isOnline ? "border-green-500/30" : "border-orange-500/30"}>
          <CardContent className="flex items-center gap-3 py-4">
            {isOnline ? (
              <>
                <Wifi className="h-5 w-5 text-green-500" />
                <span className="text-sm">Você está online</span>
              </>
            ) : (
              <>
                <WifiOff className="h-5 w-5 text-orange-500" />
                <span className="text-sm">Você está offline - dados em cache disponíveis</span>
              </>
            )}
          </CardContent>
        </Card>

        {isInstalled ? (
          <Card className="border-green-500/30 bg-green-50/50 dark:bg-green-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                <CheckCircle2 className="h-6 w-6" />
                Aplicativo Instalado!
              </CardTitle>
              <CardDescription>
                O PsiProntuário já está instalado no seu dispositivo.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/")} className="w-full">
                Abrir Aplicativo
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Instalação Android/Desktop */}
            {deferredPrompt && !isIOS && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5 text-primary" />
                    Instalar Aplicativo
                  </CardTitle>
                  <CardDescription>
                    Clique no botão abaixo para instalar o PsiProntuário
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={handleInstall} className="w-full" size="lg">
                    <Download className="mr-2 h-4 w-4" />
                    Instalar Agora
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Instruções iOS */}
            {isIOS && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5 text-primary" />
                    Instalar no iPhone/iPad
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                    <li>Toque no botão <strong>Compartilhar</strong> (ícone de quadrado com seta)</li>
                    <li>Role para baixo e toque em <strong>"Adicionar à Tela de Início"</strong></li>
                    <li>Toque em <strong>"Adicionar"</strong> no canto superior direito</li>
                  </ol>
                </CardContent>
              </Card>
            )}

            {/* Instruções Desktop (quando não tem prompt) */}
            {!deferredPrompt && !isIOS && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="h-5 w-5 text-primary" />
                    Instalar no Computador
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Para instalar o aplicativo no seu computador:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                    <li><strong>Chrome:</strong> Clique no ícone de instalação na barra de endereço</li>
                    <li><strong>Edge:</strong> Clique nos três pontos → "Aplicativos" → "Instalar este site"</li>
                    <li><strong>Firefox:</strong> Use a extensão PWA ou acesse pelo Chrome</li>
                  </ol>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Benefícios */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Benefícios do Aplicativo</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                <div>
                  <span className="font-medium">Acesso Rápido</span>
                  <p className="text-sm text-muted-foreground">Abra diretamente da tela inicial</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                <div>
                  <span className="font-medium">Funciona Offline</span>
                  <p className="text-sm text-muted-foreground">Acesse dados em cache sem internet</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                <div>
                  <span className="font-medium">Experiência Nativa</span>
                  <p className="text-sm text-muted-foreground">Interface em tela cheia, como um app nativo</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button variant="ghost" onClick={() => navigate("/")}>
            Continuar no navegador
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Install;
