import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Users,
  Shield,
  Clock,
  CheckCircle,
  Star,
  Smartphone,
  Lock,
  HeartHandshake,
  ArrowRight,
  Brain,
  ClipboardList,
  TrendingUp,
} from "lucide-react";

const PAYMENT_LINK = "https://www.asaas.com/c/luabavl3hwy2fuft";

export default function Sales() {
  const handleBuyClick = () => {
    window.open(PAYMENT_LINK, "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">PsicoGestão</span>
          </div>
          <Button onClick={handleBuyClick} variant="hero" size="sm">
            Começar Agora
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm">
              🎉 Oferta Especial de Lançamento
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Prontuário Eletrônico
              <span className="block text-primary">Completo para Psicólogos</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Organize seus atendimentos, mantenha prontuários seguros e em conformidade com o CFP. 
              Tudo em um só lugar, acessível de qualquer dispositivo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button onClick={handleBuyClick} variant="hero" size="lg" className="text-lg px-8 py-6">
                Quero Começar Agora
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span>Acesso Vitalício</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span>Sem Mensalidades</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span>Suporte Incluso</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Você ainda usa planilhas ou papel para seus prontuários?
            </h2>
            <p className="text-lg text-muted-foreground">
              Sabemos como é difícil manter tudo organizado enquanto cuida dos seus pacientes.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="border-destructive/20 bg-destructive/5">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">😰</div>
                <h3 className="font-semibold text-foreground mb-2">Medo de perder dados</h3>
                <p className="text-sm text-muted-foreground">
                  Arquivos no computador ou papéis podem ser perdidos, roubados ou danificados.
                </p>
              </CardContent>
            </Card>
            <Card className="border-destructive/20 bg-destructive/5">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">⏰</div>
                <h3 className="font-semibold text-foreground mb-2">Tempo perdido</h3>
                <p className="text-sm text-muted-foreground">
                  Horas gastas organizando papéis e procurando informações de pacientes.
                </p>
              </CardContent>
            </Card>
            <Card className="border-destructive/20 bg-destructive/5">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">⚠️</div>
                <h3 className="font-semibold text-foreground mb-2">Risco de não conformidade</h3>
                <p className="text-sm text-muted-foreground">
                  Prontuários incompletos ou desorganizados podem gerar problemas com o CFP.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Badge variant="outline" className="mb-4">A Solução</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              PsicoGestão: Seu consultório organizado em minutos
            </h2>
            <p className="text-lg text-muted-foreground">
              Um sistema completo desenvolvido especificamente para psicólogos que valorizam 
              a organização e a segurança dos seus pacientes.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="group hover:shadow-lg transition-all duration-300 border-primary/10 hover:border-primary/30">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Gestão de Pacientes</h3>
                <p className="text-sm text-muted-foreground">
                  Cadastro completo com dados pessoais, contatos e responsáveis. Tudo organizado e fácil de encontrar.
                </p>
              </CardContent>
            </Card>
            <Card className="group hover:shadow-lg transition-all duration-300 border-primary/10 hover:border-primary/30">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <ClipboardList className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Prontuários Completos</h3>
                <p className="text-sm text-muted-foreground">
                  Registre sessões com todas as informações clínicas: queixa, humor, técnicas, diagnósticos CID/DSM.
                </p>
              </CardContent>
            </Card>
            <Card className="group hover:shadow-lg transition-all duration-300 border-primary/10 hover:border-primary/30">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Relatórios em PDF</h3>
                <p className="text-sm text-muted-foreground">
                  Gere relatórios profissionais para encaminhamentos, laudos e documentação clínica.
                </p>
              </CardContent>
            </Card>
            <Card className="group hover:shadow-lg transition-all duration-300 border-primary/10 hover:border-primary/30">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Segurança Total</h3>
                <p className="text-sm text-muted-foreground">
                  Dados criptografados e protegidos. Apenas você tem acesso aos seus prontuários.
                </p>
              </CardContent>
            </Card>
            <Card className="group hover:shadow-lg transition-all duration-300 border-primary/10 hover:border-primary/30">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Smartphone className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Acesse de Qualquer Lugar</h3>
                <p className="text-sm text-muted-foreground">
                  Funciona no celular, tablet ou computador. Seus dados sempre com você.
                </p>
              </CardContent>
            </Card>
            <Card className="group hover:shadow-lg transition-all duration-300 border-primary/10 hover:border-primary/30">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Acompanhe a Evolução</h3>
                <p className="text-sm text-muted-foreground">
                  Histórico completo de sessões e status do tratamento para cada paciente.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge variant="outline" className="mb-4">Por que escolher o PsicoGestão?</Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Feito por quem entende a rotina clínica
                </h2>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-success" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Conforme com o CFP</h4>
                      <p className="text-sm text-muted-foreground">Estrutura de prontuário alinhada às exigências do Conselho Federal de Psicologia.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-success" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Interface Intuitiva</h4>
                      <p className="text-sm text-muted-foreground">Simples de usar, mesmo se você não é familiarizado com tecnologia.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-success" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Suporte Humanizado</h4>
                      <p className="text-sm text-muted-foreground">Dúvidas? Nossa equipe está pronta para ajudar você.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-success" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Atualizações Gratuitas</h4>
                      <p className="text-sm text-muted-foreground">Novas funcionalidades adicionadas regularmente, sem custo extra.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <Card className="p-8 bg-background shadow-xl">
                  <div className="text-center">
                    <div className="inline-flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <blockquote className="text-lg text-foreground mb-4 italic">
                      "Finalmente um sistema que entende as necessidades do psicólogo. 
                      Organizo meus prontuários em minutos e me sinto segura com a proteção dos dados."
                    </blockquote>
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-xl">👩‍⚕️</span>
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-foreground">Dra. Ana Silva</div>
                        <div className="text-sm text-muted-foreground">Psicóloga Clínica - CRP 06/12345</div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20" id="preco">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <Badge variant="secondary" className="mb-4">Oferta Especial</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Invista uma única vez, use para sempre
            </h2>
            <p className="text-lg text-muted-foreground">
              Sem mensalidades, sem surpresas. Pagamento único com acesso vitalício.
            </p>
          </div>
          <div className="max-w-lg mx-auto">
            <Card className="relative overflow-hidden border-2 border-primary shadow-xl">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 text-sm font-medium">
                Mais Popular
              </div>
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-foreground mb-2">Acesso Vitalício</h3>
                  <p className="text-muted-foreground mb-6">Tudo que você precisa para organizar seu consultório</p>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-lg text-muted-foreground line-through">R$ 297</span>
                    <span className="text-5xl font-bold text-primary">R$ 97</span>
                    <span className="text-muted-foreground">,90</span>
                  </div>
                  <p className="text-sm text-success mt-2 font-medium">Economia de R$ 199,10</p>
                </div>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-foreground">Cadastro ilimitado de pacientes</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-foreground">Prontuários completos e detalhados</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-foreground">Relatórios em PDF profissionais</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-foreground">Acesso de qualquer dispositivo</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-foreground">Dados seguros e criptografados</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-foreground">Suporte por e-mail</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-foreground">Atualizações gratuitas para sempre</span>
                  </div>
                </div>
                <Button onClick={handleBuyClick} variant="hero" size="lg" className="w-full text-lg py-6">
                  Quero Garantir Meu Acesso
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
                  <Lock className="w-4 h-4" />
                  <span>Pagamento 100% seguro</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Guarantee Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Card className="border-success/30 bg-success/5">
              <CardContent className="p-8 flex flex-col md:flex-row items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                  <HeartHandshake className="w-12 h-12 text-success" />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold text-foreground mb-2">Garantia de 7 Dias</h3>
                  <p className="text-muted-foreground">
                    Se por qualquer motivo você não ficar satisfeito com o PsicoGestão, 
                    devolvemos 100% do seu investimento. Sem perguntas, sem burocracia. 
                    Sua satisfação é nossa prioridade.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Perguntas Frequentes
              </h2>
            </div>
            <div className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h4 className="font-semibold text-foreground mb-2">Preciso instalar algum programa?</h4>
                  <p className="text-muted-foreground">
                    Não! O PsicoGestão funciona direto no navegador. Basta acessar pelo computador, 
                    tablet ou celular. Também pode ser instalado como aplicativo no seu dispositivo.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h4 className="font-semibold text-foreground mb-2">Meus dados ficam seguros?</h4>
                  <p className="text-muted-foreground">
                    Sim! Utilizamos criptografia de ponta e servidores seguros. 
                    Apenas você tem acesso aos seus prontuários com sua senha pessoal.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h4 className="font-semibold text-foreground mb-2">Existe limite de pacientes?</h4>
                  <p className="text-muted-foreground">
                    Não! Com o acesso vitalício, você pode cadastrar quantos pacientes precisar, 
                    sem nenhuma limitação.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h4 className="font-semibold text-foreground mb-2">E se eu tiver dúvidas?</h4>
                  <p className="text-muted-foreground">
                    Oferecemos suporte por e-mail para ajudar você com qualquer dúvida ou dificuldade. 
                    Estamos aqui para garantir que você aproveite ao máximo o sistema.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h4 className="font-semibold text-foreground mb-2">Posso testar antes de comprar?</h4>
                  <p className="text-muted-foreground">
                    Oferecemos garantia de 7 dias! Se não gostar, devolvemos seu dinheiro integralmente.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Pronto para organizar seu consultório?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Junte-se a centenas de psicólogos que já transformaram sua rotina clínica.
            </p>
            <Button onClick={handleBuyClick} variant="hero" size="lg" className="text-lg px-10 py-6">
              Garantir Meu Acesso por R$ 97,90
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <span>Pagamento Seguro</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Acesso Imediato</span>
              </div>
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-4 h-4" />
                <span>Garantia 7 Dias</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <Brain className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">PsicoGestão</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              © 2025 PsicoGestão. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
