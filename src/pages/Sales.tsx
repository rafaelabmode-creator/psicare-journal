import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Users,
  Shield,
  CheckCircle,
  ArrowRight,
  ClipboardList,
  FileText,
  Monitor,
  ShieldCheck,
  MessageCircle,
} from "lucide-react";

const PAYMENT_LINK = "https://www.asaas.com/c/luabavl3hwy2fuft";
const WHATSAPP_LINK =
  "https://wa.me/5516991215432?text=Olá!%20Tenho%20interesse%20no%20PsiProntuário%20e%20gostaria%20de%20saber%20mais.";

export default function Sales() {
  const handleBuyClick = () => {
    window.open(PAYMENT_LINK, "_blank");
  };

  const scrollToPrice = () => {
    document.getElementById("preco")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen" style={{ background: "#F0FDFA" }}>
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur-sm" style={{ borderColor: "#E5E7EB" }}>
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#0D9488" }}>
              <ClipboardList className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold" style={{ color: "#1F2937" }}>PsiProntuário</span>
          </div>
          <Button
            onClick={scrollToPrice}
            className="rounded-lg text-sm font-medium text-white"
            style={{ background: "#0D9488" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#0F766E")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#0D9488")}
          >
            Começar Agora
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span
              className="inline-block mb-6 px-4 py-2 text-sm font-medium rounded-full"
              style={{ background: "#CCFBF1", color: "#0D9488" }}
            >
              Desenvolvido por psicóloga, para psicólogos
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6" style={{ color: "#1F2937" }}>
              Prontuário que respeita seu tempo —{" "}
              <span style={{ color: "#0D9488" }}>e seus pacientes</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto" style={{ color: "#6B7280" }}>
              Organize seus atendimentos, mantenha prontuários completos e em conformidade com o CFP. Simples, bonito e sem mensalidade.
            </p>
            <Button
              onClick={scrollToPrice}
              size="lg"
              className="text-lg px-8 py-6 rounded-xl text-white"
              style={{ background: "#0D9488" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#0F766E")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#0D9488")}
            >
              Quero Organizar Meu Consultório
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm" style={{ color: "#6B7280" }}>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" style={{ color: "#0D9488" }} />
                <span>Acesso Vitalício</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" style={{ color: "#0D9488" }} />
                <span>Sem Mensalidades</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" style={{ color: "#0D9488" }} />
                <span>Funciona Offline</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* O Problema */}
      <section className="py-20" style={{ background: "#ffffff" }}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "#1F2937" }}>
              Você ainda usa caderno, Word ou planilha para seus prontuários?
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { emoji: "📋", text: "Perder tempo procurando informações de sessões antigas" },
              { emoji: "🔒", text: "Preocupação com sigilo e conformidade com o CFP" },
              { emoji: "💸", text: "Pagar caro todo mês por sistemas complicados demais" },
            ].map((item, i) => (
              <Card key={i} className="border" style={{ borderColor: "#E5E7EB" }}>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{item.emoji}</div>
                  <p className="text-sm font-medium" style={{ color: "#1F2937" }}>{item.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* A Solução */}
      <section className="py-20" style={{ background: "#F0FDFA" }}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Badge variant="outline" className="mb-4">A Solução</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "#1F2937" }}>
              PsiProntuário: seu consultório organizado em minutos
            </h2>
            <p className="text-lg" style={{ color: "#6B7280" }}>
              Desenvolvido por uma psicóloga em exercício, pensado para quem quer algo simples que funcione — sem precisar de suporte técnico.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              { icon: Users, title: "Gestão de Pacientes", desc: "Cadastro completo com dados pessoais, contatos e responsável legal para menores de idade." },
              { icon: FileText, title: "Prontuários Completos", desc: "Registre sessões com todos os dados clínicos: humor, sono, medicação, técnicas, hipóteses e evolução." },
              { icon: Shield, title: "Dados Seguros", desc: "Seus dados ficam protegidos. Você é a única pessoa com acesso às informações dos seus pacientes." },
              { icon: Monitor, title: "Funciona Offline", desc: "Não depende de internet para funcionar. Instale no seu computador e use onde quiser." },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <Card key={i} className="border bg-white" style={{ borderColor: "#E5E7EB" }}>
                  <CardContent className="p-6">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                      style={{ background: "#CCFBF1" }}
                    >
                      <Icon className="w-6 h-6" style={{ color: "#0D9488" }} />
                    </div>
                    <h3 className="font-semibold mb-2" style={{ color: "#1F2937" }}>{item.title}</h3>
                    <p className="text-sm" style={{ color: "#6B7280" }}>{item.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Por que escolher */}
      <section className="py-20" style={{ background: "#ffffff" }}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4">Por que escolher o PsiProntuário?</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: "#1F2937" }}>
              Feito por quem vive a rotina clínica
            </h2>
            <p className="mb-8" style={{ color: "#6B7280" }}>
              O PsiProntuário foi desenvolvido por uma psicóloga com CRP ativo, que sentiu na pele a falta de um sistema simples, bonito e acessível. Não é um software genérico adaptado para psicólogos — foi pensado do zero para a nossa realidade.
            </p>
            <div className="space-y-4">
              {[
                { title: "Conforme com o CFP", desc: "Estrutura de prontuário alinhada às Resoluções CFP 001/2009 e 006/2019" },
                { title: "Sem mensalidade", desc: "Pague uma vez, use para sempre" },
                { title: "Sem internet obrigatória", desc: "Seus dados ficam no seu computador" },
                { title: "Suporte humanizado", desc: "Fale diretamente com quem desenvolveu" },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "#CCFBF1" }}
                  >
                    <CheckCircle className="w-4 h-4" style={{ color: "#0D9488" }} />
                  </div>
                  <div>
                    <h4 className="font-semibold" style={{ color: "#1F2937" }}>{item.title}</h4>
                    <p className="text-sm" style={{ color: "#6B7280" }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Preço */}
      <section className="py-20" id="preco" style={{ background: "#F0FDFA" }}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "#1F2937" }}>
              Invista uma única vez, use para sempre
            </h2>
            <p className="text-lg" style={{ color: "#6B7280" }}>
              Sem mensalidades, sem surpresas. Pagamento único com acesso vitalício.
            </p>
          </div>
          <div className="max-w-lg mx-auto">
            <Card className="relative overflow-hidden border-2 bg-white shadow-xl" style={{ borderColor: "#0D9488" }}>
              <div className="absolute top-0 right-0 px-4 py-1 text-sm font-medium text-white" style={{ background: "#0D9488" }}>
                Oferta de Lançamento
              </div>
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2" style={{ color: "#1F2937" }}>Acesso Vitalício</h3>
                  <p className="mb-6" style={{ color: "#6B7280" }}>Tudo que você precisa para organizar seu consultório</p>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-lg line-through" style={{ color: "#6B7280" }}>R$ 297</span>
                    <span className="text-5xl font-bold" style={{ color: "#0D9488" }}>R$ 97</span>
                    <span style={{ color: "#6B7280" }}>,90</span>
                  </div>
                  <p className="text-sm mt-2 font-medium" style={{ color: "#0D9488" }}>Economia de R$ 199,10</p>
                </div>
                <div className="space-y-4 mb-8">
                  {[
                    "Cadastro ilimitado de pacientes",
                    "Prontuários completos e detalhados",
                    "Funciona offline no seu computador",
                    "Dados seguros e privados",
                    "Atualizações inclusas no primeiro ano",
                    "Suporte via WhatsApp",
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: "#0D9488" }} />
                      <span style={{ color: "#1F2937" }}>{text}</span>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={handleBuyClick}
                  size="lg"
                  className="w-full text-lg py-6 rounded-xl text-white"
                  style={{ background: "#0D9488" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#0F766E")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#0D9488")}
                >
                  Garantir Meu Acesso por R$ 97,90
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Garantia */}
      <section className="py-16" style={{ background: "#ffffff" }}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Card className="border bg-white" style={{ borderColor: "#E5E7EB" }}>
              <CardContent className="p-8 flex flex-col md:flex-row items-center gap-6">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "#CCFBF1" }}
                >
                  <ShieldCheck className="w-10 h-10" style={{ color: "#0D9488" }} />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold mb-2" style={{ color: "#1F2937" }}>Garantia de 15 dias</h3>
                  <p style={{ color: "#6B7280" }}>
                    Se você configurar seu perfil, registrar pelo menos uma sessão e não ficar satisfeita com o PsiProntuário, devolvemos 100% do seu investimento. Sem perguntas, sem burocracia.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20" style={{ background: "#F0FDFA" }}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold" style={{ color: "#1F2937" }}>
                Perguntas Frequentes
              </h2>
            </div>
            <Accordion type="single" collapsible className="space-y-3">
              {[
                {
                  q: "Preciso instalar algum programa?",
                  a: "Sim. O PsiProntuário é instalado no seu computador e funciona offline, sem depender de internet. A instalação é simples e rápida.",
                },
                {
                  q: "Meus dados ficam seguros?",
                  a: "Sim. Seus dados ficam armazenados no seu próprio computador — não em servidores de terceiros. Só você tem acesso.",
                },
                {
                  q: "Funciona em Mac e Windows?",
                  a: "Sim, o PsiProntuário funciona em Windows e Mac.",
                },
                {
                  q: "Como funciona a garantia de 15 dias?",
                  a: "Após a compra, você tem 15 dias para experimentar. Se configurar seu perfil e registrar pelo menos uma sessão e não ficar satisfeita, basta entrar em contato pelo WhatsApp e devolvemos 100% do valor.",
                },
                {
                  q: "Como recebo o programa após a compra?",
                  a: "Após a confirmação do pagamento, você receberá um e-mail com o link de download e sua chave de ativação.",
                },
              ].map((item, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="bg-white rounded-lg border px-4" style={{ borderColor: "#E5E7EB" }}>
                  <AccordionTrigger className="text-left font-semibold" style={{ color: "#1F2937" }}>
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent style={{ color: "#6B7280" }}>
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20" style={{ background: "#ffffff" }}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "#1F2937" }}>
              Pronto para organizar seu consultório?
            </h2>
            <p className="text-lg mb-8" style={{ color: "#6B7280" }}>
              Seja uma das primeiras psicólogas a usar o PsiProntuário.
            </p>
            <Button
              onClick={handleBuyClick}
              size="lg"
              className="text-lg px-10 py-6 rounded-xl text-white"
              style={{ background: "#0D9488" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#0F766E")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#0D9488")}
            >
              Garantir Meu Acesso por R$ 97,90
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm" style={{ color: "#6B7280" }}>
              <span>🔒 Pagamento Seguro</span>
              <span>⚡ Acesso Imediato</span>
              <span>🛡️ Garantia 15 Dias</span>
            </div>
          </div>
        </div>
      </section>

      {/* Rodapé */}
      <footer className="py-8 border-t" style={{ borderColor: "#E5E7EB", background: "#F0FDFA" }}>
        <div className="container mx-auto px-4 text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#0D9488" }}>
              <ClipboardList className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold" style={{ color: "#1F2937" }}>PsiProntuário</span>
          </div>
          <p className="text-sm" style={{ color: "#6B7280" }}>
            © 2025 PsiProntuário · Psico-Cogni Psicologia
          </p>
          <p className="text-xs" style={{ color: "#9CA3AF" }}>
            Desenvolvido por psicóloga, para psicólogos.
          </p>
        </div>
      </footer>

      {/* Botão Flutuante WhatsApp */}
      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        title="Fale com a gente"
        className="fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg transition-transform duration-200 hover:scale-105"
        style={{ boxShadow: "0 4px 14px rgba(0,0,0,0.15)" }}
      >
        <MessageCircle className="w-7 h-7" style={{ color: "#25D366" }} />
      </a>
    </div>
  );
}
