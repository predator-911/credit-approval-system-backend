# Credit Approval System

A production-ready Credit Approval System built with Node.js, Express, and PostgreSQL. This system manages customer registration, evaluates loan eligibility using dynamic credit scoring, and handles loan processing with precise financial logic.

## 🚀 Tech Stack

- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Frontend**: React, Vite, Tailwind CSS, Shadcn UI
- **Validation**: Zod
- **Query Management**: TanStack Query (React Query)

## 🛠️ Features

- **Customer Management**: Register new customers with automatic credit limit calculation based on monthly salary.
- **Credit Scoring**: Dynamic calculation based on past loan history, debt load, and repayment behavior.
- **Loan Eligibility**: 
  - Tiered interest rate slabs based on credit scores.
  - Debt-to-income ratio checks (max 50% EMI of monthly salary).
  - Automatic correction of interest rates to meet eligibility criteria.
- **Loan Processing**: Create and track active loans with automatic debt updates.
- **Admin Dashboard**: Comprehensive UI to visualize customers and manage the loan lifecycle.

## 🔌 API Endpoints

### Customers
- `POST /api/register`: Register a new customer.
- `GET /api/customers`: List all registered customers.

### Loans
- `POST /api/check-eligibility`: Validate if a customer is eligible for specific loan terms.
- `POST /api/create-loan`: Process and approve a new loan.
- `GET /api/view-loan/:loan_id`: Get detailed information about a specific loan.
- `GET /api/view-loans/:customer_id`: List all active loans for a specific customer.

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Database Setup**:
   Ensure your `DATABASE_URL` environment variable is set, then push the schema:
   ```bash
   npm run db:push
   ```

3. **Run Application**:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5000`.

## 📊 Business Logic Specifications

- **Approved Limit**: `36 * monthly_salary`, rounded to the nearest 100,000.
- **EMI Formula**: `EMI = P * r * (1+r)^n / ((1+r)^n - 1)`
- **Credit Score Tiers**:
  - `> 50`: Approve
  - `30-50`: Approve if interest ≥ 12%
  - `10-30`: Approve if interest ≥ 16%
  - `< 10`: Reject
