import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, FileText, Home, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Início' },
    { path: '/patients', icon: Users, label: 'Pacientes' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-hero shadow-glow">
              <Brain className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">PsiProntuário</h1>
              <p className="text-xs text-muted-foreground">Gestão de Prontuários</p>
            </div>
          </Link>

          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || 
                (item.path !== '/' && location.pathname.startsWith(item.path));
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Conforme as normas do Conselho Federal de Psicologia
          </p>
        </div>
      </footer>
    </div>
  );
}
