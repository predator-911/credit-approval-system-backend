import { Layout } from "@/components/Sidebar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkEligibilitySchema, type CheckEligibilityRequest, type CreateLoanRequest } from "@shared/schema";
import { useCustomers } from "@/hooks/use-customers";
import { useCheckEligibility, useCreateLoan } from "@/hooks/use-loans";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Calculator, CheckCircle2, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";

export default function LoanCalculator() {
  const { toast } = useToast();
  const [location] = useLocation();
  const queryParams = new URLSearchParams(window.location.search);
  const preselectedCustomerId = queryParams.get("customer_id");

  const { data: customers } = useCustomers();
  const checkMutation = useCheckEligibility();
  const createMutation = useCreateLoan();
  
  const [eligibilityResult, setEligibilityResult] = useState<any>(null);

  const form = useForm<CheckEligibilityRequest>({
    resolver: zodResolver(checkEligibilitySchema),
    defaultValues: {
      customer_id: preselectedCustomerId ? Number(preselectedCustomerId) : undefined,
      loan_amount: 10000,
      interest_rate: 12,
      tenure: 12,
    },
  });

  // Watch for eligibility changes to reset result
  useEffect(() => {
    const subscription = form.watch(() => setEligibilityResult(null));
    return () => subscription.unsubscribe();
  }, [form]);

  const onCheckEligibility = (data: CheckEligibilityRequest) => {
    checkMutation.mutate(data, {
      onSuccess: (result) => {
        setEligibilityResult(result);
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Error checking eligibility",
          description: error.message,
        });
      },
    });
  };

  const onCreateLoan = () => {
    if (!eligibilityResult) return;
    
    const loanData: CreateLoanRequest = {
        customer_id: eligibilityResult.customer_id,
        loan_amount: form.getValues().loan_amount,
        interest_rate: form.getValues().interest_rate,
        tenure: form.getValues().tenure,
    };

    createMutation.mutate(loanData, {
      onSuccess: () => {
        toast({
          title: "Loan Created!",
          description: "The loan has been approved and processed.",
        });
        setEligibilityResult(null);
        form.reset();
      },
      onError: (error) => {
        toast({
            variant: "destructive",
            title: "Failed to create loan",
            description: error.message,
        });
      }
    });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground font-display">Loan Calculator</h1>
          <p className="mt-1 text-muted-foreground">Check eligibility and process new loans instantly.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Input Form */}
          <Card className="border-border shadow-lg h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-primary" />
                Loan Details
              </CardTitle>
              <CardDescription>Enter loan parameters to check approval status.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onCheckEligibility)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="customer_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer</FormLabel>
                        <Select 
                          onValueChange={(val) => field.onChange(Number(val))} 
                          value={field.value?.toString()}
                          disabled={!!preselectedCustomerId}
                        >
                          <FormControl>
                            <SelectTrigger className="input-modern">
                              <SelectValue placeholder="Select a customer" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {customers?.map((c) => (
                              <SelectItem key={c.customer_id} value={c.customer_id.toString()}>
                                {c.first_name} {c.last_name} (#{c.customer_id})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="loan_amount"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Amount ($)</FormLabel>
                            <FormControl>
                            <Input type="number" {...field} onChange={e => field.onChange(e.target.valueAsNumber)} className="input-modern" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="interest_rate"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Interest Rate (%)</FormLabel>
                            <FormControl>
                            <Input type="number" step="0.1" {...field} onChange={e => field.onChange(e.target.valueAsNumber)} className="input-modern" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="tenure"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tenure (Months)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={e => field.onChange(e.target.valueAsNumber)} className="input-modern" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full font-semibold bg-primary hover:bg-primary/90 text-white shadow-md transition-all"
                    disabled={checkMutation.isPending}
                  >
                    {checkMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Checking...
                      </>
                    ) : (
                      "Check Eligibility"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Result Card */}
          <div className="space-y-6">
            {!eligibilityResult ? (
                <div className="h-full min-h-[300px] flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/20 p-8 text-center">
                    <div className="rounded-full bg-muted p-4 mb-4">
                        <Calculator className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">Results will appear here</h3>
                    <p className="text-sm text-muted-foreground max-w-xs mt-2">
                        Fill out the form and click "Check Eligibility" to see if the loan can be approved.
                    </p>
                </div>
            ) : (
                <Card className={`border-2 shadow-xl overflow-hidden transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 ${eligibilityResult.approval ? 'border-emerald-500/50' : 'border-rose-500/50'}`}>
                    <div className={`p-6 text-white ${eligibilityResult.approval ? 'bg-emerald-600' : 'bg-rose-600'}`}>
                        <div className="flex items-center gap-3">
                            {eligibilityResult.approval ? (
                                <CheckCircle2 className="h-8 w-8" />
                            ) : (
                                <XCircle className="h-8 w-8" />
                            )}
                            <div>
                                <h3 className="text-2xl font-bold font-display">
                                    {eligibilityResult.approval ? 'Loan Approved' : 'Loan Rejected'}
                                </h3>
                                <p className="text-white/80 text-sm">Based on credit score and history</p>
                            </div>
                        </div>
                    </div>
                    
                    <CardContent className="pt-6 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-muted/50">
                                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Interest Rate</p>
                                <p className="text-2xl font-bold text-foreground mt-1">{eligibilityResult.corrected_interest_rate}%</p>
                                {eligibilityResult.corrected_interest_rate !== form.getValues().interest_rate && (
                                    <p className="text-xs text-amber-600 mt-1">Corrected from {form.getValues().interest_rate}%</p>
                                )}
                            </div>
                            <div className="p-4 rounded-xl bg-muted/50">
                                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Monthly EMI</p>
                                <p className="text-2xl font-bold text-foreground mt-1">${Math.round(eligibilityResult.monthly_installment).toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between text-sm py-2 border-b border-border/50">
                                <span className="text-muted-foreground">Loan Amount</span>
                                <span className="font-medium">${form.getValues().loan_amount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm py-2 border-b border-border/50">
                                <span className="text-muted-foreground">Tenure</span>
                                <span className="font-medium">{eligibilityResult.tenure} months</span>
                            </div>
                        </div>

                        {eligibilityResult.approval && (
                            <Button 
                                onClick={onCreateLoan} 
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20"
                                size="lg"
                                disabled={createMutation.isPending}
                            >
                                {createMutation.isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing Loan...
                                    </>
                                ) : (
                                    "Confirm & Create Loan"
                                )}
                            </Button>
                        )}
                    </CardContent>
                </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
