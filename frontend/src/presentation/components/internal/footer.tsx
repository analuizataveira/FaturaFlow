import { Wallet, Github, Mail, Heart } from "lucide-react"
import { Button } from "../ui"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="w-full px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Wallet className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">FaturaFlow</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Gerencie suas finanças pessoais de forma simples e eficiente.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Recursos</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/invoices" className="hover:text-foreground transition-colors">
                  Importar Dados
                </a>
              </li>
              <li>
                <a href="/invoices" className="hover:text-foreground transition-colors">
                  Registrar Despesa
                </a>
              </li>
              <li>
                <a href="/history" className="hover:text-foreground transition-colors">
                  Histórico
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Suporte</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Central de Ajuda
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Documentação
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Contato
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Conecte-se</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="h-9 w-9 bg-transparent">
                <Github className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-9 w-9 bg-transparent">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">© {currentYear} FaturaFlow. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
