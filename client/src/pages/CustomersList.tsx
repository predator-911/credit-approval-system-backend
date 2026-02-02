import { Layout } from "@/components/Sidebar";
import { useCustomers } from "@/hooks/use-customers";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Search, Loader2, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function CustomersList() {
  const { data: customers, isLoading, isError } = useCustomers();
  const [search, setSearch] = useState("");

  const filteredCustomers = customers?.filter(c => 
    c.first_name.toLowerCase().includes(search.toLowerCase()) || 
    c.last_name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone_number.includes(search)
  );

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
            <h1 className="text-3xl font-bold text-foreground font-display">Customers</h1>
            <p className="mt-1 text-muted-foreground">Manage and view all registered customers.</p>
        </div>
        <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
                placeholder="Search customers..." 
                className="pl-9 bg-white shadow-sm border-border focus:border-primary"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : isError ? (
        <div className="text-center text-red-500 py-10">Failed to load customers</div>
      ) : (
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/40 text-muted-foreground font-medium border-b border-border/50">
                <tr>
                  <th className="px-6 py-4">Customer ID</th>
                  <th className="px-6 py-4">Full Name</th>
                  <th className="px-6 py-4">Phone Number</th>
                  <th className="px-6 py-4">Approved Limit</th>
                  <th className="px-6 py-4">Current Debt</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredCustomers?.length === 0 ? (
                    <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                            No customers found matching your search.
                        </td>
                    </tr>
                ) : (
                    filteredCustomers?.map((customer) => (
                    <tr key={customer.customer_id} className="group hover:bg-muted/20 transition-colors">
                        <td className="px-6 py-4 font-mono text-muted-foreground">#{customer.customer_id}</td>
                        <td className="px-6 py-4 font-medium text-foreground">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                                    {customer.first_name[0]}{customer.last_name[0]}
                                </div>
                                {customer.first_name} {customer.last_name}
                            </div>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">{customer.phone_number}</td>
                        <td className="px-6 py-4">
                            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                            ${customer.approved_limit.toLocaleString()}
                            </span>
                        </td>
                        <td className="px-6 py-4">
                            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                                customer.current_debt > 0 
                                    ? 'bg-red-50 text-red-700 ring-red-600/20' 
                                    : 'bg-gray-50 text-gray-600 ring-gray-500/10'
                            }`}>
                            ${customer.current_debt.toLocaleString()}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                        <Link href={`/customers/${customer.customer_id}`}>
                            <span className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 cursor-pointer">
                            View Details <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                            </span>
                        </Link>
                        </td>
                    </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Layout>
  );
}
