import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { CheckEligibilityRequest, CreateLoanRequest } from "@shared/schema";

export function useCheckEligibility() {
  return useMutation({
    mutationFn: async (data: CheckEligibilityRequest) => {
      const validated = api.loans.checkEligibility.input.parse(data);
      const res = await fetch(api.loans.checkEligibility.path, {
        method: api.loans.checkEligibility.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
         if (res.status === 400) {
          const error = api.loans.checkEligibility.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to check eligibility");
      }
      return api.loans.checkEligibility.responses[200].parse(await res.json());
    },
  });
}

export function useCreateLoan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateLoanRequest) => {
      const validated = api.loans.create.input.parse(data);
      const res = await fetch(api.loans.create.path, {
        method: api.loans.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.loans.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create loan");
      }
      return api.loans.create.responses[201].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.customers.list.path] }); // Update debts
      queryClient.invalidateQueries({ queryKey: [api.loans.listByCustomer.path] });
    },
  });
}

export function useCustomerLoans(customerId: number) {
  return useQuery({
    queryKey: [api.loans.listByCustomer.path, customerId],
    queryFn: async () => {
      const url = buildUrl(api.loans.listByCustomer.path, { customer_id: customerId });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch loans");
      return api.loans.listByCustomer.responses[200].parse(await res.json());
    },
    enabled: !!customerId,
  });
}

export function useLoanDetails(loanId: number) {
  return useQuery({
    queryKey: [api.loans.get.path, loanId],
    queryFn: async () => {
      const url = buildUrl(api.loans.get.path, { loan_id: loanId });
      const res = await fetch(url);
      if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error("Failed to fetch loan details");
      }
      return api.loans.get.responses[200].parse(await res.json());
    },
    enabled: !!loanId,
  });
}
