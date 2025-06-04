"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageTitle } from "@/components/page-title";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Building, Mail, MapPin, Phone, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { OrganizationEmployeesTable } from "@/components/superadmin/organization-employees-table";
import { getOrganizationById } from "@/services/organization.service";
import { getAllBranches } from "@/services/branch.service";
import { getAllOrgMembers } from "@/services/user.service";
import { use } from "react";

interface Organization {
  id: number;
  name: string;
  email: string;
  agreement: string;
  status: string;
  address: string;
  sector: string;
  phone_number: string;
  created_at: Date; //------
  updated_at: Date;
  // description: string;
  // website: string;
  // totalEmployees: number;
  // totalBranches: number;
  // testsCompleted: number;
  // complianceStatus: string;
}

export default function OrganizationDetailsPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = use(params);

  const router = useRouter();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [totalBranches, setTotalBranches] = useState<number | null>(null);
  const [totalEmployees, setTotalEmployees] = useState<number | null>(null);

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const organizationData = await getOrganizationById(Number(orgId));
        setOrganization(organizationData);
      } catch (err) {
        setError("Organization not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrganization();
  }, [orgId]);

  useEffect(() => {
    const fetchTotalBranches = async () => {
      try {
        if (orgId) {
          const branches = await getAllBranches(Number(orgId));
          setTotalBranches(branches.length);
          console.log("Total branches:", branches.length);
        }
      } catch (err) {
        console.error("Failed to fetch total branches:", err);
      }
    };

    fetchTotalBranches();
  }, [orgId]);

  useEffect(() => {
    const fetchTotalEmployees = async () => {
      try {
        if (orgId) {
          const members = await getAllOrgMembers(Number(orgId));
          setTotalEmployees(members.length);
        }
      } catch (err) {
        console.error("Failed to fetch total employees:", err);
      }
    };

    fetchTotalEmployees();
  }, [orgId]);

  const renderStatusBadge = (status: string) => {
    const badgeMap: Record<string, string> = {
      active: "bg-green-50 text-green-700 border-green-200",
      suspended: "bg-red-50 text-red-700 border-red-200",
      pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
    };
    const style = badgeMap[status] || "";
    return (
      <Badge variant="outline" className={style}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (loading) return <p>Loading organization...</p>;
  if (error || !organization) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Error</h2>
          <p className="text-muted-foreground mt-2">{error}</p>
          <Button className="mt-4" onClick={() => router.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageTitle
          title={organization.name}
          description={`${organization.sector} organization with ${totalEmployees} employees`}
        />
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Organizations
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        {renderStatusBadge(organization.status)}
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200"
        >
          {organization.sector}
        </Badge>
      </div>

      <Tabs
        defaultValue="overview"
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          {/* <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger> */}
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Employees
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalEmployees}</div>
                <p className="text-xs text-muted-foreground">
                  Across {totalBranches} branches
                </p>
              </CardContent>
            </Card>
            {/* <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Tests Completed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {organization.testsCompleted}
                </div>
                <p className="text-xs text-muted-foreground">
                  {Math.round(
                    (organization.testsCompleted / (totalEmployees ?? 0)) * 100
                  )}
                  % completion rate
                </p>
              </CardContent>
            </Card> */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Member Since
                </CardTitle>
              </CardHeader>
              <CardContent>
                {organization.created_at ? (
                  <>
                    <div className="text-2xl font-bold">
                      {new Date(organization.created_at).toLocaleDateString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {Math.floor(
                        (new Date().getTime() -
                          new Date(organization.created_at).getTime()) /
                          (1000 * 60 * 60 * 24 * 30)
                      )}{" "}
                      months
                    </p>
                  </>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Date not available
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Organization Information</CardTitle>
              <CardDescription>
                Detailed information about {organization.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Description</p>
                  <p className="text-sm text-muted-foreground">
                    {/* {organization.description} */}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Compliance Status</p>
                  <p className="text-sm text-muted-foreground">
                    {/* {organization.complianceStatus} */}
                  </p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium flex items-center">
                    <MapPin className="mr-2 h-4 w-4" /> Address
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {organization.address}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium flex items-center">
                    <Phone className="mr-2 h-4 w-4" /> Phone
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {organization.phone_number}
                  </p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium flex items-center">
                    <Mail className="mr-2 h-4 w-4" /> Email
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {organization.email}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium flex items-center">
                    <Building className="mr-2 h-4 w-4" /> Website
                  </p>
                  <p className="text-sm text-muted-foreground">
                    https://www.********{/* {organization.website} */}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="employees" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Employees</CardTitle>
                <CardDescription>
                  Manage employees in this organization
                </CardDescription>
              </div>
              <Button size="sm">
                <Users className="mr-2 h-4 w-4" />
                Export List
              </Button>
            </CardHeader>
            <CardContent>
              <OrganizationEmployeesTable organizationId={organization.id} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>
                Shared documents will be shown here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                No documents have been shared with this organization yet.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Manage organization settings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Settings functionality will be added later.
              </p>
            </CardContent>
          </Card>
        </TabsContent> */}
      </Tabs>
    </div>
  );
}
