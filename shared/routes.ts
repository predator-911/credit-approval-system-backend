import { z } from 'zod';
import { insertCustomerSchema, customers, loans, checkEligibilitySchema, createLoanSchema } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  customers: {
    register: {
      method: 'POST' as const,
      path: '/api/register',
      input: insertCustomerSchema,
      responses: {
        201: z.custom<typeof customers.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/customers',
      responses: {
        200: z.array(z.custom<typeof customers.$inferSelect>()),
      },
    },
  },
  loans: {
    checkEligibility: {
      method: 'POST' as const,
      path: '/api/check-eligibility',
      input: checkEligibilitySchema,
      responses: {
        200: z.object({
          customer_id: z.number(),
          approval: z.boolean(),
          interest_rate: z.number(),
          corrected_interest_rate: z.number(),
          tenure: z.number(),
          monthly_installment: z.number(),
        }),
        400: errorSchemas.validation,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/create-loan',
      input: createLoanSchema,
      responses: {
        201: z.object({
          loan_id: z.number(),
          customer_id: z.number(),
          loan_approved: z.boolean(),
          message: z.string().optional(),
          monthly_installment: z.number(),
        }),
        400: errorSchemas.validation,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/view-loan/:loan_id',
      responses: {
        200: z.object({
          loan_id: z.number(),
          customer: z.custom<typeof customers.$inferSelect>(),
          loan_amount: z.number(),
          interest_rate: z.number(),
          monthly_installment: z.number(),
          tenure: z.number(),
        }),
        404: errorSchemas.notFound,
      },
    },
    listByCustomer: {
      method: 'GET' as const,
      path: '/api/view-loans/:customer_id',
      responses: {
        200: z.array(z.custom<typeof loans.$inferSelect & { repayments_left: number }>()),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
