"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calendar, FileText, CreditCard, Users } from "lucide-react"

const navItems = [
  { name: "Agendamentos", href: "/schedule", icon: Calendar },
  { name: "Relatórios", href: "/reports", icon: FileText },
  { name: "Pagamentos", href: "/", icon: CreditCard },
  { name: "Alunos", href: "/customers", icon: Users },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-semibold text-foreground">
              JPMC English
            </Link>
            <div className="flex gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
