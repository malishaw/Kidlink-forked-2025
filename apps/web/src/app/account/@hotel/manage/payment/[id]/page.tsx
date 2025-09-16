// import { PaymentDetail } from "@/features/payments/components/payment-detail";
// import { notFound } from "next/navigation";
// import { Suspense } from "react";
// // import { getPaymentById } from "@/features/payments/actions/get-payments.action";

// interface PaymentPageProps {
//   params: {
//     id: string;
//   };
// }

// // Mock function for now - replace with actual API call
// async function getPayment(id: string) {
//   // This would normally fetch from API
//   const mockPayment = {
//     id,
//     childId: "child-001",
//     amount: "150.00",
//     paymentMethod: "credit card",
//     status: "completed",
//     paidAt: new Date(Date.now() - 86400000),
//     organizationId: "org-1",
//     createdAt: new Date(Date.now() - 172800000),
//     updatedAt: new Date(Date.now() - 86400000),
//   };

//   return mockPayment;
// }

// export default async function PaymentPage({ params }: PaymentPageProps) {
//   const payment = await getPayment(params.id);

//   if (!payment) {
//     notFound();
//   }

//   return (
//     <Suspense fallback={<div>Loading payment details...</div>}>
//       <PaymentDetail payment={payment} />
//     </Suspense>
//   );
// }

// export function generateMetadata({ params }: PaymentPageProps) {
//   return {
//     title: `Payment ${params.id} | Payment Management`,
//     description: `Details for payment ${params.id}`,
//   };
// }
