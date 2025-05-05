"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";

import { PageTitle } from "@/components/page-title";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  getOrganizationById,
  updateOrganization,
} from "@/services/organization.service";

export default function EditOrganizationPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();

  const orgId = Number(params.id);

  const [orgData, setOrgData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [sector, setSector] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getOrganizationById(orgId);
        setOrgData(data);
        setName(data.name || "");
        setSector(data.sector || "");
        setEmail(data.email || "");
        setAddress(data.address || "");
      } catch (err) {
        toast({
          title: "Error loading organization",
          description: "Could not fetch organization data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (orgId) fetchData();
  }, [orgId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !sector) {
      toast({
        title: "Missing fields",
        description: "Organization name and sector are required.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await updateOrganization(orgId, {
        name,
        sector,
        email,
        address,
      });

      toast({
        title: "Organization Updated",
        description: `Successfully updated ${name}`,
      });

      router.push("/dashboard/superadmin/organizations");
    } catch (err) {
      toast({
        title: "Update Failed",
        description: "Something went wrong while updating.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p className="text-muted-foreground">Loading...</p>;

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PageTitle
        title="Edit Organization"
        description="Update organization information"
      />

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Organization Info</CardTitle>
            <CardDescription>
              Modify the fields below and save your changes
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Organization Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sector">Sector *</Label>
              <Input
                id="sector"
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-end gap-4">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
