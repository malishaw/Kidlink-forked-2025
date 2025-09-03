"use client";
import { CheckIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useId } from "react";
import { toast } from "sonner";

import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { useAppForm } from "@repo/ui/components/tanstack-form";
import { cn } from "@repo/ui/lib/utils";
import { useQueryState } from "nuqs";

import { authClient } from "@/lib/auth-client";
import { Checkbox } from "@repo/ui/components/checkbox";
import { Label } from "@repo/ui/components/label";
import { signupSchema, type SignupSchema } from "../schemas";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const toastId = useId();
  const router = useRouter();
  const [mode, setMode] = useQueryState("mode");

  const form = useAppForm({
    validators: { onChange: signupSchema },
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: ({ value }) => handleSignup(value),
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form]
  );

  const handleSignup = async (values: SignupSchema) => {
    await authClient.signUp.email({
      email: values.email,
      password: values.password,
      name: "",
      fetchOptions: {
        onRequest() {
          toast.loading("Registering new user...", { id: toastId });
        },
        onSuccess(ctx) {
          toast.success("User registered successfully !", { id: toastId });
          if (mode === "hotelOwner") {
            router.push("/setup-organization");
          } else {
            router.push("/signin");
          }
        },
        onError(ctx) {
          toast.error(`Failed: ${ctx.error.message}`, { id: toastId });
        },
      },
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-heading font-bold">
            Get Started
          </CardTitle>
          <CardDescription>Signup with your Email</CardDescription>
        </CardHeader>
        <CardContent>
          <form.AppForm>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-6">
                {/* <div className="flex flex-col gap-4">
                  <Button variant="outline" className="w-full">
                    <CiFacebook className="size-5" />
                    Signup with Facebook
                  </Button>
                </div>
                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                  <span className="bg-card text-muted-foreground relative z-10 px-2">
                    Or continue with
                  </span>
                </div> */}

                {/* -------- */}

                <form.AppField
                  name="email"
                  children={(field) => (
                    <field.FormItem>
                      <field.FormLabel>Email</field.FormLabel>
                      <field.FormControl>
                        <Input
                          placeholder="john@example.com"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                        />
                      </field.FormControl>
                      <field.FormMessage />
                    </field.FormItem>
                  )}
                />

                <form.AppField
                  name="password"
                  children={(field) => (
                    <field.FormItem>
                      <field.FormLabel>Password</field.FormLabel>
                      <field.FormControl>
                        <Input
                          placeholder=""
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                        />
                      </field.FormControl>
                      <field.FormMessage />
                    </field.FormItem>
                  )}
                />

                <form.AppField
                  name="confirmPassword"
                  children={(field) => (
                    <field.FormItem>
                      <field.FormLabel>Confirm Password</field.FormLabel>
                      <field.FormControl>
                        <Input
                          placeholder=""
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                        />
                      </field.FormControl>
                      <field.FormMessage />
                    </field.FormItem>
                  )}
                />

                <div className="my-2 flex items-center gap-2">
                  <Checkbox
                    id="hotelOwnerCheck"
                    checked={mode === "hotelOwner"}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setMode("hotelOwner");
                      } else {
                        setMode("");
                      }
                    }}
                  />
                  <Label htmlFor="hotelOwnerCheck" className="text-xs">
                    Continue as Hotel Owner
                  </Label>
                </div>

                {/* -------- */}

                <div className="grid gap-6">
                  <Button
                    type="submit"
                    className="w-full"
                    loading={form.state.isSubmitting}
                    icon={form.state.isSubmitSuccessful && <CheckIcon />}
                  >
                    Sign Up
                  </Button>
                </div>
                <div className="text-center text-sm">
                  {`Aleady have an account? `}
                  <Link href="/signin" className="underline underline-offset-4">
                    Sign In
                  </Link>
                </div>
              </div>
            </form>
          </form.AppForm>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our Terms of Service and Privacy
        Policy.
      </div>
    </div>
  );
}
