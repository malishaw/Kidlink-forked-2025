# Payment Management System

A comprehensive payment management frontend built with Next.js, React, and TypeScript.

## Features

### 🎯 Core Features

- **Payment CRUD Operations**: Create, read, update, and delete payment records
- **Multiple View Modes**: Card view and table view for different user preferences
- **Advanced Filtering**: Filter by status, child ID, payment method, and date ranges
- **Real-time Search**: Instant search across payment records
- **Status Management**: Track payment status (pending, completed, failed)
- **Responsive Design**: Works on all device sizes

### 📊 Analytics & Reporting

- **Payment Statistics**: Overview of total revenue, payment counts, and averages
- **Status Breakdowns**: Visual representation of payment statuses
- **Trend Indicators**: Growth/decline indicators for key metrics
- **Export Functionality**: Export payment data (planned)

### 🔧 Technical Features

- **Type-safe APIs**: Full TypeScript integration
- **Form Validation**: Robust form validation with Zod schemas
- **Server Actions**: Next.js server actions for data mutations
- **Optimistic Updates**: Immediate UI feedback
- **Error Handling**: Comprehensive error handling with toast notifications

## Component Architecture

### Pages

- **`/payment`**: Main payments dashboard with overview and management
- **`/payment/[id]`**: Detailed view for individual payments

### Components

#### Core Components

- **`PaymentsLayout`**: Main layout with tabbed navigation
- **`PaymentsList`**: Card-based view of payments
- **`PaymentsTable`**: Table view with sorting and filtering
- **`PaymentCard`**: Individual payment card component
- **`PaymentDetail`**: Detailed view for single payments

#### Form Components

- **`AddNewPayment`**: Create new payment dialog
- **`EditPaymentDialog`**: Edit existing payment dialog

#### UI Components

- **`PaymentsHeader`**: Page header with search and filters
- **`PaymentsStats`**: Statistics dashboard

### Actions

- **`add-payments.action.ts`**: Create new payments
- **`update-payment.action.ts`**: Update payment details
- **`delete-payments.action.ts`**: Delete payments
- **`get-payments.action.ts`**: Fetch payments with filtering
- **`mark-as-completed.action.ts`**: Update payment status

### Schemas

- **`paymentsSchema`**: Database schema type
- **`paymentsInsertSchema`**: Schema for creating payments
- **`paymentsUpdateSchema`**: Schema for updating payments

## Usage

### Basic Usage

```tsx
import { PaymentsLayout } from "@/features/payments/components";

export default function PaymentsPage() {
  return <PaymentsLayout />;
}
```

### Individual Components

```tsx
import {
  AddNewPayment,
  PaymentsList,
  PaymentsStats,
} from "@/features/payments/components";

export default function CustomPaymentsPage() {
  return (
    <div>
      <PaymentsStats />
      <AddNewPayment />
      <PaymentsList />
    </div>
  );
}
```

## API Integration

The payment system expects the following API endpoints:

### Endpoints

- **`GET /api/payment`**: List payments with filtering
- **`POST /api/payment`**: Create new payment
- **`GET /api/payment/:id`**: Get payment by ID
- **`PATCH /api/payment/:id`**: Update payment
- **`DELETE /api/payment/:id`**: Delete payment

### Data Schema

```typescript
interface Payment {
  id: string;
  childId: string;
  amount: string;
  paymentMethod: string;
  status: "pending" | "completed" | "failed";
  paidAt: Date | null;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Customization

### Styling

All components use Tailwind CSS classes and can be customized through:

- **CSS variables**: Modify theme colors in globals.css
- **Component props**: Pass custom className props
- **Tailwind config**: Extend the theme in tailwind.config.js

### Functionality

- **Add new payment methods**: Update the payment method select options
- **Custom validation**: Modify Zod schemas in `schemas/index.ts`
- **Additional fields**: Extend the payment schema and forms
- **Custom filters**: Add new filter options in the header component

## Development

### File Structure

```
src/features/payments/
├── actions/              # Server actions
│   ├── add-payments.action.ts
│   ├── update-payment.action.ts
│   ├── delete-payments.action.ts
│   ├── get-payments.action.ts
│   └── mark-as-completed.action.ts
├── components/           # React components
│   ├── add-new-payment.tsx
│   ├── payment-card.tsx
│   ├── payment-detail.tsx
│   ├── payments-list.tsx
│   ├── payments-header.tsx
│   ├── payments-stats.tsx
│   ├── payments-table.tsx
│   ├── payments-layout.tsx
│   ├── edit-payment-dialog.tsx
│   └── index.ts
└── schemas/              # Type definitions
    └── index.ts
```

### Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint
```

## Contributing

1. Follow the existing code structure
2. Add TypeScript types for all new features
3. Include proper error handling
4. Add loading states for async operations
5. Test components in both card and table views
6. Ensure responsive design works on all screen sizes

## Future Enhancements

- [ ] Advanced analytics dashboard
- [ ] Payment receipt generation
- [ ] Bulk payment operations
- [ ] Payment reminders
- [ ] Integration with payment processors
- [ ] Audit trail for payment changes
- [ ] Custom reporting tools
- [ ] Payment scheduling
- [ ] Multi-currency support
