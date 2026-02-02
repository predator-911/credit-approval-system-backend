import { Link, useLocation } from "wouter";
import { LayoutDashboard, Users, UserPlus, Calculator, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Register Customer', href: '/register', icon: UserPlus },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Loan Calculator', href: '/calculator', icon: Calculator },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-border bg-card px-6 pb-4">
        <div className="flex h-24 shrink-0 items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/25 text-white">
            <Wallet className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-foreground">CreditFlow</h1>
            <p className="text-xs text-muted-foreground font-medium">Loan Management</p>
          </div>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-2">
                {navigation.map((item) => {
                  const isActive = location === item.href;
                  return (
                    <li key={item.name}>
                      <Link href={item.href} className={cn(
                        isActive 
                          ? 'bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20' 
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                        'group flex gap-x-3 rounded-xl p-3 text-sm font-semibold leading-6 transition-all duration-200 ease-out'
                      )}>
                        <item.icon
                          className={cn(
                            isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground',
                            'h-6 w-6 shrink-0 transition-colors'
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/30">
      <Sidebar />
      <main className="lg:pl-72 py-10">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
