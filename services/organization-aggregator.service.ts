// src/services/organization-aggregator.service.ts

import { getOrganizationById } from "./organization.service";
import { getAllBranches } from "./branch.service";
import { getAllOrgMembers } from "./user.service";

export interface FullOrganizationDetails {
  id: number;
  name: string;
  sector: string;
  status: string;
  createdAt: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  description: string;
  complianceStatus: string;
  totalBranches: number;
  totalEmployees: number;
  testsCompleted: number; // mock it for now
}

export const getFullOrganizationDetailsById = async (
  orgId: number
): Promise<FullOrganizationDetails> => {
  const [org, members, branches] = await Promise.all([
    getOrganizationById(orgId),
    getAllOrgMembers(orgId),
    getAllBranches(orgId),
  ]);

  const orgBranches = branches.filter((b) => b.org_id === orgId);
  const orgMembers = members.filter((m) => m.org_id === orgId);

  return {
    ...org,
    address: "Not Available",
    phone: "Not Available",
    email: "Not Available",
    website: "Not Available",
    description: "Not Available",
    complianceStatus: "Compliant", // fallback
    totalBranches: orgBranches.length,
    totalEmployees: orgMembers.length,
    testsCompleted: 0, // you can replace this with real API later
  };
};
