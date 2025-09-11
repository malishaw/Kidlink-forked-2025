"use client";
import { CheckIcon, ImageIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useId, useRef, useState } from "react";

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

import { authClient } from "@/lib/auth-client";
import { toKebabCase } from "@/lib/utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { toast } from "sonner";
import {
  setupOrgSchema,
  type SetupOrgSchemaT,
} from "../schemas/setup-org-schema";
import { OrganizationList } from "./organization/get-organization";

export function AgentSetupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [selectedOrganization, setSelectedOrganization] = useState<
    string | null
  >(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const toastId = useId();
  const router = useRouter();
  const searchParams = useSearchParams();
  const userType = searchParams.get("userType");
  const view = searchParams.get("view");

  const { data: organizations, isLoading, isError } = OrganizationList({});

  const form = useAppForm({
    validators: { onChange: setupOrgSchema },
    defaultValues: {
      name: "",
      logo: "",
      company: "",
      phoneNumber: "",
      website: "",
    },
    onSubmit: ({ value }) => handleSetup(value),
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setLogoFile(file);
    }
  };

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form]
  );

  const handleSetup = async (values: SetupOrgSchemaT) => {
    try {
      toast.loading("Setting up your profile...", { id: toastId });

      /**
       * 1. Update User Profile with Name
       */

      /**
       * 2. Convert name to kebab case
       */
      const slug = toKebabCase(values.name);

      /**
       * 3. Create Agent Profile (aka. Organization) with the provided details
       */
      const agentProfile = await authClient.organization.create({
        name: values.name,
        slug,
        logo: values.logo,
        metadata: {
          company: values.company,
          phoneNumber: values.phoneNumber,
          website: values.website,
        },
      });

      if (agentProfile.error) throw new Error(agentProfile.error.message);

      /**
       * 4. Set the newly created organization as the active organization
       */
      if (agentProfile.data) {
        try {
          const setActiveResponse = await fetch(
            "/api/auth/organization/set-active",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                organizationId: agentProfile.data.id,
                organizationSlug: agentProfile.data.slug,
              }),
            }
          );

          if (!setActiveResponse.ok) {
            console.warn("Organization created but failed to set as active");
          }
        } catch (setActiveError) {
          console.warn("Error setting active organization:", setActiveError);
        }
      }

      toast.success("Organization successfully prepared !", { id: toastId });

      router.push("/account");
    } catch (err) {
      const error = err as Error;
      toast.error(`Failed: ${error.message}`, {
        id: toastId,
      });
    }
  };

  const handleOrganizationSelect = async (
    organizationId: string,
    organizationSlug: string
  ) => {
    try {
      const response = await fetch("/api/auth/organization/set-active", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          organizationId,
          organizationSlug,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to set active organization");
      }

      const data = await response.json();
      toast.success(`Organization ${data.name} is now active!`);
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleComplete = async () => {
    if (selectedOrganization) {
      const selectedOrg = organizations.data.find(
        (org: { id: string; name: string }) => org.name === selectedOrganization
      );

      if (selectedOrg) {
        await handleOrganizationSelect(selectedOrg.id, selectedOrg.slug);
        // Redirect to account after successfully setting active organization
        router.push("/account");
      } else {
        toast.error("Please select a valid organization.");
      }
    } else {
      toast.error("No organization selected.");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {view === "profile-setup" && (
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-heading font-bold">
              {userType === "teacher"
                ? "Teacher Profile"
                : userType === "parent"
                  ? "Parent Profile"
                  : userType === "nursery-owner"
                    ? "Nursery Profile"
                    : "Agent Profile"}
            </CardTitle>
            <CardDescription>Create nursery to get started.</CardDescription>
          </CardHeader>
          <CardContent>
            <form.AppForm>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-6">
                  <div className="w-full flex items-center justify-center">
                    {/* Logo Field */}
                    <input
                      className="hidden"
                      type="file"
                      accept=".jpg, .png, .jpeg, .svg"
                      ref={imageInputRef}
                      onChange={handleImageChange}
                    />

                    <form.AppField
                      name="logo"
                      children={(field) => (
                        <field.FormItem>
                          <field.FormControl>
                            <Avatar
                              className="size-[72px]"
                              onClick={() => {
                                if (!imageInputRef.current?.value) {
                                  imageInputRef?.current?.click();
                                } else {
                                  setLogoFile(null);
                                  imageInputRef.current.value = "";
                                }
                              }}
                            >
                              <div className="relative group cursor-pointer hover:shadow-md">
                                <div
                                  className={cn(
                                    "absolute z-20 w-full h-full top-0 left-0 inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-semibold",
                                    logoFile ? "hidden" : "group-hover:flex"
                                  )}
                                ></div>
                                <AvatarImage
                                  src={
                                    logoFile
                                      ? URL.createObjectURL(logoFile)
                                      : ""
                                  }
                                  alt="logo"
                                  width={300}
                                  height={300}
                                  className="object-cover "
                                />
                              </div>

                              <AvatarFallback>
                                <ImageIcon className="size-7 text-neutral-400" />
                              </AvatarFallback>
                            </Avatar>
                          </field.FormControl>
                          <field.FormMessage />
                        </field.FormItem>
                      )}
                    />
                  </div>

                  <form.AppField
                    name="name"
                    children={(field) => (
                      <field.FormItem>
                        <field.FormLabel>Nursery Name</field.FormLabel>
                        <field.FormControl>
                          <Input
                            placeholder="John Doe"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            // disabled={!!userType} // Disable editing if userType is set
                            className={
                              userType ? "bg-gray-50 text-gray-600" : ""
                            }
                          />
                        </field.FormControl>
                        {userType && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Role automatically set based on your selection
                          </p>
                        )}
                        <field.FormMessage />
                      </field.FormItem>
                    )}
                  />
                  <form.AppField
                    name="company"
                    children={(field) => (
                      <field.FormItem>
                        <field.FormLabel>Company</field.FormLabel>
                        <field.FormControl>
                          <Input
                            placeholder="Abc Real Estate."
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
                    name="website"
                    children={(field) => (
                      <field.FormItem>
                        <field.FormLabel>Company Website</field.FormLabel>
                        <field.FormControl>
                          <Input
                            placeholder="www.abc-realestate.com"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                          />
                        </field.FormControl>
                        <field.FormMessage />
                      </field.FormItem>
                    )}
                  />

                  <div className="grid gap-6">
                    <Button
                      type="submit"
                      className="w-full"
                      loading={form.state.isSubmitting}
                      icon={form.state.isSubmitSuccessful && <CheckIcon />}
                    >
                      Complete Profile
                    </Button>
                  </div>
                </div>
              </form>
            </form.AppForm>
          </CardContent>
        </Card>
      )}

      {view === "select-organization" && (
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-heading font-bold">
              Select Organization
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && <p>Loading organizations...</p>}
            {isError && <p>Failed to load organizations.</p>}
            {organizations && (
              <>
                <Select
                  value={selectedOrganization || undefined}
                  onValueChange={(value) => {
                    const selectedOrg = organizations.data.find(
                      (org: { id: string; name: string }) => org.name === value
                    );
                    if (selectedOrg) {
                      setSelectedOrganization(value);
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select an organization" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizations.data.map(
                      (org: { id: string; name: string; slug: string }) => (
                        <SelectItem key={org.id} value={org.name}>
                          {org.name}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
                <Button className="mt-4 w-full" onClick={handleComplete}>
                  Complete
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
