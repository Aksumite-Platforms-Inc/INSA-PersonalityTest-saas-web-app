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
import { getBranchById, updateBranch } from "@/services/branch.service";
import { parse } from "path";

export default function EditBranchPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();

  const orgId = parseInt(params?.orgId?.toString() || "0", 10);
  const branchId = parseInt(params?.branchId?.toString() || "0", 10);

  const [orgData, setOrgData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [branchName, setBranchName] = useState("");
  const [branchEmail, setBranchEmail] = useState("");
  const [branchPhone, setBranchPhone] = useState("");
  const [branchAddress, setBranchAddress] = useState("");

  useEffect(() => {
    console.log("orgId:", orgId);
    console.log("Fetching branch data...");
    const fetchBranch = async () => {
      try {
        const branch = await getBranchById(orgId, Number(branchId));
        setBranchName(branch.name || "");
        setBranchEmail(branch.email || "");
        setBranchPhone(branch.phone_number || "");
        setBranchAddress(branch.address || "");
      } catch (err) {
        toast({ title: "Error", description: "Failed to fetch branch info." });
      } finally {
        setLoading(false);
      }
    };

    fetchBranch();
  }, [orgId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // if (!name || !email) {
    //   toast({
    //     title: "Missing fields",
    //     description: "Branch name and sector are required.",
    //     variant: "destructive",
    //   });
    //   return;
    // }

    setIsSubmitting(true);

    try {
      await updateBranch(Number(orgId), branchId, {
        name: branchName,
        email: branchEmail,
        phone_number: branchPhone,
        address: branchAddress,
      });
      toast({
        title: "Branch Updated",
        description: `Successfully updated ${name}`,
      });

      router.back();
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
      <PageTitle title="Edit branch" description="Update branch information" />

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>branch Info</CardTitle>
            <CardDescription>
              Modify the fields below and save your changes
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Branch Name *</Label>
              <Input
                id="name"
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone_number">Phone Number</Label>
              <Input
                id="phone_number"
                value={branchPhone}
                onChange={(e) => setBranchPhone(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={branchEmail}
                onChange={(e) => setBranchEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={branchAddress}
                onChange={(e) => setBranchAddress(e.target.value)}
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
