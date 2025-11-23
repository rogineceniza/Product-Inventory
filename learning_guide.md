# Product Inventory App: Comprehensive Learning Guide

This document details the step-by-step process of building the Product Inventory application. It is designed to help you understand every decision and action taken, so you can replicate this project from scratch.

---

## Phase 1: Project Setup & Database Initialization

### 1. Project Initialization
- **Action**: We started with an existing Next.js project (`react101`).
- **Concept**: Next.js provides the framework for our React application, handling routing, rendering, and build processes.

### 2. Database Setup (PostgreSQL + Prisma)
- **Goal**: Store product data persistently.
- **Tools**:
    - **PostgreSQL**: A powerful, open-source relational database.
    - **Prisma ORM**: A tool that makes interacting with the database easy using TypeScript.
- **Steps**:
    1.  **Install Prisma**: Run `pnpm add -D prisma` and `pnpm add @prisma/client`.
    2.  **Initialize Prisma**: Run `npx prisma init`. This created a `prisma` folder with a `schema.prisma` file and an `.env` file.
    3.  **Configure Connection**: In `.env`, we set the `DATABASE_URL` to point to your local PostgreSQL database (e.g., `postgresql://user:password@localhost:5432/dbname`).
    4.  **Define Schema**: In `prisma/schema.prisma`, we defined the `Product` model:
        ```prisma
        model Product {
          id          Int      @id @default(autoincrement())
          name        String
          description String?
          price       Decimal  // High precision for currency
          stock       Int
          createdAt   DateTime @default(now())
          updatedAt   DateTime @updatedAt
        }
        ```
    5.  **Run Migration**: Executed `npx prisma migrate dev --name init`. This command:
        -   Generated the SQL to create the table in the database.
        -   Applied the SQL to your local database.
        -   Generated the TypeScript client (`@prisma/client`) tailored to your schema.

### 3. Prisma Singleton Pattern
- **Problem**: In Next.js development (hot reloading), creating a new `PrismaClient` on every file change can exhaust database connections.
- **Solution**: We created `lib/prisma.ts` to ensure only **one** instance of `PrismaClient` exists globally during development.

---

## Phase 2: Initial Implementation (API Routes)

*Note: We initially built this using API Routes (`app/api/...`) before refactoring to Server Actions. This is a common evolution.*

### 1. API Routes
- **Concept**: Endpoints that run on the server, like a traditional backend.
- **Files**:
    -   `app/api/products/route.ts`: Handled `GET` (list all) and `POST` (create).
    -   `app/api/products/[id]/route.ts`: Handled `GET` (single), `PUT` (update), and `DELETE` (remove).
- **Logic**: These routes used `prisma.product.findMany()`, `create()`, etc., and returned JSON responses.

### 2. Admin UI (Client-Side Fetching)
-   **Page**: `app/admin/page.tsx`.
-   **Logic**: Used `useEffect` to `fetch('/api/products')` when the component mounted.
-   **Form**: Created `ProductForm.tsx` to handle user input. It sent JSON data to our API routes.

---

## Phase 3: Refactoring to Best Practices (App Router & Server Actions)

*This phase modernized the app to use the latest Next.js features.*

### 1. Why Refactor?
-   **Server Actions**: Allow you to call server-side functions directly from components, eliminating the need to manually `fetch` API routes.
-   **Zod Validation**: Ensures data submitted by users matches exactly what we expect *before* it hits the database.
-   **React Hook Form**: Manages form state (input values, errors, submission) much more efficiently than manual `useState`.

### 2. Validation Schema (`lib/schemas.ts`)
-   We defined a strict "contract" for our data using Zod:
    ```typescript
    export const productSchema = z.object({
      name: z.string().min(1, 'Name is required'),
      price: z.number().min(0.01), // Must be a number, must be positive
      // ...
    });
    ```

### 3. Server Actions (`app/actions/products.ts`)
-   **Replaced API Routes**: Instead of HTTP endpoints, we wrote TypeScript functions marked with `'use server'`.
-   **Key Features**:
    -   **Direct DB Access**: Functions call `prisma.product.create(...)` directly.
    -   **Revalidation**: `revalidatePath('/admin')` tells Next.js to purge the cached HTML for the admin page, so the new data shows up immediately.
    -   **Serialization Fix**: We converted Prisma's `Decimal` type to a plain `number` because Server Actions can only send simple data types (strings, numbers, arrays, objects) to the client.

### 4. Smart Components
-   **`ProductForm.tsx` (Client Component)**:
    -   Uses `useForm` to handle inputs.
    -   Uses `zodResolver` to connect our Zod schema to the form.
    -   **Crucial Fix**: We added `{ valueAsNumber: true }` to the price/stock inputs. This ensures HTML sends a number (e.g., `10`) instead of a string (`"10"`), preventing type errors.
-   **`AdminPage.tsx` (Server Component)**:
    -   Fetches data **directly** on the server (`await getProducts()`). This is faster and better for SEO than client-side fetching.
    -   Passes the data to `ProductList`.
-   **`ProductList.tsx` (Client Component)**:
    -   Handles the interactive parts: clicking "Edit" or "Delete".
    -   Calls Server Actions (`deleteProduct`) directly from the event handlers.

---

## Summary of Key Commands Used

1.  **Install Dependencies**:
    ```bash
    pnpm add prisma @prisma/client zod react-hook-form @hookform/resolvers
    pnpm add -D prisma
    ```
2.  **Database Management**:
    ```bash
    npx prisma init          # Setup
    npx prisma migrate dev   # Apply schema changes
    npx prisma generate      # Update TypeScript client
    ```
3.  **Development**:
    ```bash
    pnpm run dev             # Start server
    ```
4.  **Troubleshooting (Windows)**:
    ```powershell
    # Kill stuck node processes
    Stop-Process -Name "node" -Force
    # Clear Next.js cache
    Remove-Item -Path ".next" -Recurse -Force
    ```

## How to Replicate This
1.  **Setup**: Create a new Next.js app (`npx create-next-app@latest`).
2.  **Database**: Set up Postgres and initialize Prisma.
3.  **Schema**: Copy the `Product` model into `schema.prisma` and migrate.
4.  **Actions**: Create the Server Actions in `app/actions`.
5.  **UI**: Build the `AdminPage` (Server) and `ProductForm` (Client) using the code provided in the project.
