"use client";

import type React from "react";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { Separator } from "@repo/ui/components/separator";
import { Baby, CreditCard, Shield, User } from "lucide-react";
import { useState } from "react";

interface FormData {
  childId: string;
  parentName: string;
  email: string;
  phoneNumber: string;
  amount: string;
  paymentMethod: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

export function PaymentForm() {
  const [formData, setFormData] = useState<FormData>({
    childId: "",
    parentName: "",
    email: "",
    phoneNumber: "",
    amount: "",
    paymentMethod: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Payment submitted:", formData);
    setIsSubmitting(false);

    // Here you would typically integrate with a payment processor
    alert("Payment submitted successfully!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Parent Information Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Parent Information
          </CardTitle>
          <CardDescription>
            Please provide the parent or guardian details for this registration.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="parentName">Parent/Guardian Name *</Label>
              <Input
                id="parentName"
                type="text"
                placeholder="Enter full name"
                value={formData.parentName}
                onChange={(e) =>
                  handleInputChange("parentName", e.target.value)
                }
                required
                className="bg-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="parent@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
                className="bg-input"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number *</Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              required
              className="bg-input"
            />
          </div>
        </CardContent>
      </Card>

      {/* Child Information Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Baby className="h-5 w-5 text-primary" />
            Child Information
          </CardTitle>
          <CardDescription>
            Enter the child's registration details.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="childId">Child ID *</Label>
            <Input
              id="childId"
              type="text"
              placeholder="Enter child registration ID"
              value={formData.childId}
              onChange={(e) => handleInputChange("childId", e.target.value)}
              required
              className="bg-input"
            />
            <p className="text-sm text-muted-foreground">
              This ID was provided during the initial registration process.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Payment Details Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Payment Details
          </CardTitle>
          <CardDescription className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-accent" />
            Your payment information is secure and encrypted.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Registration Amount *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                  required
                  className="pl-8 bg-input"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method *</Label>
              <Select
                value={formData.paymentMethod}
                onValueChange={(value) =>
                  handleInputChange("paymentMethod", value)
                }
              >
                <SelectTrigger className="bg-input">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit-card">Credit Card</SelectItem>
                  <SelectItem value="debit-card">Debit Card</SelectItem>
                  <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {formData.paymentMethod &&
            (formData.paymentMethod === "credit-card" ||
              formData.paymentMethod === "debit-card") && (
              <>
                <Separator />
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="secondary" className="text-xs">
                      Card Payment
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardholderName">Cardholder Name *</Label>
                    <Input
                      id="cardholderName"
                      type="text"
                      placeholder="Name as it appears on card"
                      value={formData.cardholderName}
                      onChange={(e) =>
                        handleInputChange("cardholderName", e.target.value)
                      }
                      required
                      className="bg-input"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number *</Label>
                    <Input
                      id="cardNumber"
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={(e) =>
                        handleInputChange("cardNumber", e.target.value)
                      }
                      required
                      className="bg-input"
                      maxLength={19}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Expiry Date *</Label>
                      <Input
                        id="expiryDate"
                        type="text"
                        placeholder="MM/YY"
                        value={formData.expiryDate}
                        onChange={(e) =>
                          handleInputChange("expiryDate", e.target.value)
                        }
                        required
                        className="bg-input"
                        maxLength={5}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV *</Label>
                      <Input
                        id="cvv"
                        type="text"
                        placeholder="123"
                        value={formData.cvv}
                        onChange={(e) =>
                          handleInputChange("cvv", e.target.value)
                        }
                        required
                        className="bg-input"
                        maxLength={4}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          className="flex-1 bg-transparent"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" className="flex-1" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
              Processing Payment...
            </>
          ) : (
            <>
              <Shield className="h-4 w-4 mr-2" />
              Submit Payment
            </>
          )}
        </Button>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <p>
          By submitting this form, you agree to our terms of service and privacy
          policy.
        </p>
      </div>
    </form>
  );
}
