import { Layout } from "@/components/Sidebar";
import { useCustomers } from "@/hooks/use-customers";
import { Users, CreditCard, Activity, ArrowUpRight } from "lucide-react";
import { Link } from "wouter";

function StatCard({ title, value, icon: Icon, color, description }: any) {
  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm border border-border/50 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground font-display">{value}</span>
            {description && <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">{description}</span>}
          </div>
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { data: customers } = useCustomers();

  const totalCustomers = customers?.length || 0;
  const totalDebt = customers?.reduce((acc, curr) => acc + (curr.current_debt || 0), 0) || 0;
  const maxLimit = customers?.reduce((acc, curr) => acc + (curr.approved_limit || 0), 0) || 0;

  return (
    <Layout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground font-display">Dashboard Overview</h1>
          <p className="mt-1 text-muted-foreground">Welcome back to CreditFlow admin panel.</p>
        </div>
        <div className="flex gap-3">
            <Link href="/register" className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
                New Customer
            </Link>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-10">
        <StatCard
          title="Total Customers"
          value={totalCustomers}
          icon={Users}
          color="bg-blue-500"
          description="+12% this month"
        />
        <StatCard
          title="Total Outstanding Debt"
          value={`$${totalDebt.toLocaleString()}`}
          icon={CreditCard}
          color="bg-rose-500"
          description="Active Loans"
        />
        <StatCard
          title="Total Credit Limit"
          value={`$${maxLimit.toLocaleString()}`}
          icon={Activity}
          color="bg-violet-500"
          description="Approved Capacity"
        />
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border p-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Recent Customers</h2>
            <p className="text-sm text-muted-foreground">Latest registered applicants</p>
          </div>
          <Link href="/customers" className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1">
            View all <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="p-6">
          {!customers ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 rounded-xl bg-muted/50 animate-pulse" />
              ))}
            </div>
          ) : customers.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">No customers found.</div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-border/50">
              <table className="min-w-full divide-y divide-border/50">
                <thead className="bg-muted/30">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Salary</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Limit</th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border/50">
                  {customers.slice(0, 5).map((customer) => (
                    <tr key={customer.customer_id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold mr-3">
                                {customer.first_name[0]}{customer.last_name[0]}
                            </div>
                            <div className="text-sm font-medium text-foreground">{customer.first_name} {customer.last_name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{customer.phone_number}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">${customer.monthly_salary.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                          ${customer.approved_limit.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
