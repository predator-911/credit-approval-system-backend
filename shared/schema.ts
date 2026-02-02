import { pgTable, text, serial, integer, numeric, boolean, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ============================================
// DATABASE SCHEMA
// ============================================

export const customers = pgTable("customers", {
  customer_id: serial("customer_id").primaryKey(),
  first_name: text("first_name").notNull(),
  last_name: text("last_name").notNull(),
  phone_number: text("phone_number").notNull().unique(),
  age: integer("age").notNull(),
  monthly_salary: integer("monthly_salary").notNull(),
  approved_limit: integer("approved_limit").notNull(),
  current_debt: integer("current_debt").default(0).notNull(),
});

export const loans = pgTable("loans", {
  loan_id: serial("loan_id").primaryKey(),
  customer_id: integer("customer_id").notNull(), // Ideally FK to customers
  loan_amount: integer("loan_amount").notNull(),
  interest_rate: numeric("interest_rate").notNull(), // Stored as percentage, e.g. 12.5
  tenure: integer("tenure").notNull(), // In months
  monthly_installment: numeric("monthly_installment").notNull(),
  emis_paid_on_time: integer("emis_paid_on_time").default(0).notNull(),
  start_date: date("start_date").notNull(),
  end_date: date("end_date").notNull(),
  is_active: boolean("is_active").default(true).notNull(),
});

// ============================================
// ZOD SCHEMAS & TYPES
// ============================================

// Base Insert Schemas
export const insertCustomerSchema = createInsertSchema(customers).omit({
  customer_id: true,
  approved_limit: true,
  current_debt: true
}).extend({
    // Enhance validation if needed
    phone_number: z.string().min(10, "Phone number must be at least 10 digits"),
    monthly_salary: z.coerce.number().min(0),
    age: z.coerce.number().min(18).max(100),
});

export const insertLoanSchema = createInsertSchema(loans).omit({
  loan_id: true,
  monthly_installment: true,
  emis_paid_on_time: true,
  is_active: true
});

// API Request/Response Types
export const checkEligibilitySchema = z.object({
  customer_id: z.coerce.number(),
  loan_amount: z.coerce.number().positive(),
  interest_rate: z.coerce.number().positive(),
  tenure: z.coerce.number().int().positive()
});

export const createLoanSchema = checkEligibilitySchema;

export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;

export type Loan = typeof loans.$inferSelect;
export type InsertLoan = z.infer<typeof insertLoanSchema>;

export type CheckEligibilityRequest = z.infer<typeof checkEligibilitySchema>;
export type CreateLoanRequest = z.infer<typeof createLoanSchema>;
