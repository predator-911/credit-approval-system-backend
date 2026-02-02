import { db } from "./db";
import { customers, loans, type Customer, type InsertCustomer, type Loan, type InsertLoan } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Customers
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  getAllCustomers(): Promise<Customer[]>;
  getCustomer(id: number): Promise<Customer | undefined>;
  updateCustomerDebt(id: number, debt: number): Promise<Customer>;

  // Loans
  createLoan(loan: InsertLoan): Promise<Loan>;
  getLoan(id: number): Promise<Loan | undefined>;
  getLoansByCustomerId(customerId: number): Promise<Loan[]>;
  getAllLoans(): Promise<Loan[]>; // Helper for checking overall data
}

export class DatabaseStorage implements IStorage {
  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const [newCustomer] = await db.insert(customers).values(customer).returning();
    return newCustomer;
  }

  async getAllCustomers(): Promise<Customer[]> {
    return await db.select().from(customers);
  }

  async getCustomer(id: number): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.customer_id, id));
    return customer;
  }

  async updateCustomerDebt(id: number, debt: number): Promise<Customer> {
     const [updated] = await db.update(customers)
        .set({ current_debt: debt })
        .where(eq(customers.customer_id, id))
        .returning();
     return updated;
  }

  async createLoan(loan: InsertLoan): Promise<Loan> {
    const [newLoan] = await db.insert(loans).values(loan).returning();
    return newLoan;
  }

  async getLoan(id: number): Promise<Loan | undefined> {
    const [loan] = await db.select().from(loans).where(eq(loans.loan_id, id));
    return loan;
  }

  async getLoansByCustomerId(customerId: number): Promise<Loan[]> {
    return await db.select().from(loans).where(eq(loans.customer_id, customerId));
  }
  
  async getAllLoans(): Promise<Loan[]> {
    return await db.select().from(loans);
  }
}

export const storage = new DatabaseStorage();
