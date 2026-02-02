import { Layout } from "@/components/Sidebar";
import { useCustomers } from "@/hooks/use-customers";
import { useCustomerLoans } from "@/hooks/use-loans";
import { Link, useRoute } from "wouter";
import { ArrowLeft, CreditCard, Calendar, Activity, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CustomerDetails() {
  const [, params] = useRoute("/customers/:id");
  const customerId = Number(params?.id);
  
  const { data: customers } = useCustomers();
  const { data: loans, isLoading: loansLoading } = useCustomerLoans(customerId);

  const customer = customers?.find(c => c.customer_id === customerId);

  if (!customer) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h2 className="text-xl font-semibold">Customer not found</h2>
          <Link href="/customers" className="text-primary mt-4 inline-block">Return to list</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-6">
        <Link href="/customers" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-4 text-sm font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Customers
        </Link>
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-foreground font-display flex items-center gap-3">
                {customer.first_name} {customer.last_name}
                <span className="text-lg font-normal text-muted-foreground bg-muted/50 px-3 py-0.5 rounded-full">
                    #{customer.customer_id}
                </span>
            </h1>
            <Link href={`/calculator?customer_id=${customer.customer_id}`}>
                <Button className="bg-primary text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all">
                    New Loan Application
                </Button>
            </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Salary</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${customer.monthly_salary.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Limit</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">${customer.approved_limit.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Debt</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600">${customer.current_debt.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-foreground font-display">Active Loans</h2>
        
        {loansLoading ? (
           <div className="h-24 bg-muted/30 rounded-xl animate-pulse" />
        ) : !loans || loans.length === 0 ? (
          <div className="text-center py-10 bg-card rounded-2xl border border-dashed border-border">
            <p className="text-muted-foreground">No active loans for this customer.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {loans.map(loan => (
              <Card key={loan.loan_id} className="hover:shadow-lg transition-all duration-300 border-border/60">
                <CardHeader className="bg-muted/30 pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-lg">Loan #{loan.loan_id}</CardTitle>
                        <CardDescription className="mt-1 font-mono text-xs">
                            {new Date(loan.start_date).toLocaleDateString()} - {new Date(loan.end_date).toLocaleDateString()}
                        </CardDescription>
                    </div>
                    <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-md">
                        {loan.interest_rate}% Interest
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Principal Amount</span>
                            <span className="font-bold text-lg">${loan.loan_amount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Monthly Installment</span>
                            <span className="font-semibold text-foreground">${Number(loan.monthly_installment).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Tenure</span>
                            <span className="text-sm font-medium">{loan.tenure} months</span>
                        </div>
                        <div className="border-t border-border pt-4 mt-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Repayments Remaining</span>
                                <span className="font-bold text-rose-600">{loan.repayments_left}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
