"use client";

import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Label } from "@repo/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { Building2, CheckCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Organization {
  id: string;
  name: string;
  slug: string;
  logo: string;
  createdAt: string;
  metadata: string;
}

export function OrganizationSelection() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrgId, setSelectedOrgId] = useState<string>("");
  const [settingActive, setSettingActive] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const response = await fetch("/api/auth/organization/list");
      if (!response.ok) {
        throw new Error("Failed to fetch organizations");
      }
      const data = await response.json();
      setOrganizations(data);
    } catch (error) {
      console.error("Error fetching organizations:", error);
      toast.error("Failed to load organizations");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOrganization = async () => {
    if (!selectedOrgId) {
      toast.error("Please select an organization");
      return;
    }

    const selectedOrg = organizations.find((org) => org.id === selectedOrgId);
    if (!selectedOrg) {
      toast.error("Invalid organization selected");
      return;
    }

    setSettingActive(true);

    try {
      const response = await fetch("/api/auth/organization/set-active", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          organizationId: selectedOrg.id,
          organizationSlug: selectedOrg.slug,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to set active organization");
      }

      toast.success(`${selectedOrg.name} set as active organization`);
      router.push("/account");
    } catch (error) {
      console.error("Error setting active organization:", error);
      toast.error("Failed to set organization as active");
    } finally {
      setSettingActive(false);
    }
  };

  const getSelectedOrganization = () => {
    return organizations.find((org) => org.id === selectedOrgId);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading organizations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Building2 className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Select Your Nursery
          </CardTitle>
          <CardDescription className="text-base">
            Choose which nursery you'd like to work with
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {organizations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No organizations available</p>
              <Button
                variant="outline"
                onClick={() => router.push("/join-organization")}
              >
                Join Organization
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="nursery-select" className="text-sm font-medium">
                  Available Nurseries
                </Label>
                <Select value={selectedOrgId} onValueChange={setSelectedOrgId}>
                  <SelectTrigger id="nursery-select" className="w-full">
                    <SelectValue placeholder="Select a nursery..." />
                  </SelectTrigger>
                  <SelectContent>
                    {organizations.map((org) => (
                      <SelectItem key={org.id} value={org.id}>
                        <div className="flex items-center space-x-3 py-1">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                            {org.logo ? (
                              <img
                                src={org.logo}
                                alt={org.name}
                                className="w-6 h-6 rounded-full object-cover"
                              />
                            ) : (
                              <Building2 className="h-4 w-4 text-blue-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {org.name}
                            </p>
                            {org.slug && (
                              <p className="text-xs text-gray-500 truncate">
                                @{org.slug}
                              </p>
                            )}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Selected Organization Preview */}
              {selectedOrgId && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900">
                        Selected: {getSelectedOrganization()?.name}
                      </p>
                      <p className="text-sm text-blue-700">
                        Ready to set as your active nursery
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <Button
                onClick={handleSelectOrganization}
                disabled={!selectedOrgId || settingActive}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              >
                {settingActive ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Setting Active...
                  </>
                ) : (
                  <>
                    <Building2 className="h-4 w-4 mr-2" />
                    Set as Active Nursery
                  </>
                )}
              </Button>

              <div className="text-center">
                <p className="text-xs text-gray-500 mb-2">
                  Don't see your nursery?
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/join-organization")}
                  disabled={settingActive}
                >
                  Join Different Organization
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
