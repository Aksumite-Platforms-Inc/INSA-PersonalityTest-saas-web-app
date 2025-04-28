export interface OrganizationData {
  id: number;
  name: string;
  sector: string;
  status: string;
  users: number;
  testsCompleted: number;
  createdAt: string;
}

let organizations: OrganizationData[] = [
  {
    id: 1,
    name: "Ministry of Education",
    sector: "Government",
    status: "active",
    users: 245,
    testsCompleted: 189,
    createdAt: "2023-01-15",
  },
  {
    id: 2,
    name: "Ministry of Health",
    sector: "Government",
    status: "active",
    users: 312,
    testsCompleted: 278,
    createdAt: "2023-02-03",
  },
  {
    id: 3,
    name: "Addis Ababa University",
    sector: "Education",
    status: "active",
    users: 156,
    testsCompleted: 98,
    createdAt: "2023-03-21",
  },
  {
    id: 4,
    name: "Commercial Bank of Ethiopia",
    sector: "Finance",
    status: "active",
    users: 203,
    testsCompleted: 175,
    createdAt: "2023-04-10",
  },
  {
    id: 5,
    name: "Ethiopian Airlines",
    sector: "Transportation",
    status: "active",
    users: 178,
    testsCompleted: 145,
    createdAt: "2023-05-05",
  },
  {
    id: 6,
    name: "Ethio Telecom",
    sector: "Telecommunications",
    status: "suspended",
    users: 220,
    testsCompleted: 0,
    createdAt: "2023-06-18",
  },
];

export const orgService = {
  async createOrganization(data: Omit<OrganizationData, "id" | "createdAt">) {
    const newId = Date.now();
    const newOrganization: OrganizationData = {
      id: newId,
      name: data.name,
      sector: data.sector,
      status: "active", // default
      users: 0,
      testsCompleted: 0,
      createdAt: new Date().toISOString(),
    };
    organizations.push(newOrganization);
    console.log("After CREATE:", organizations);

    return newOrganization;
  },

  // Fetch all organizations (returns demo data)
  async getAllOrganizations() {
    console.log("getDatabase", organizations);
    return organizations;
  },

  // Update an organization (updates the demo data)
  async updateOrganization(
    id: number,
    data: Partial<Omit<OrganizationData, "id" | "createdAt">>
  ) {
    const orgIndex = organizations.findIndex((org) => org.id === id);
    if (orgIndex === -1) {
      throw new Error("Organization not found");
    }
    organizations[orgIndex] = { ...organizations[orgIndex], ...data };
    return organizations[orgIndex];
  },

  // Delete an organization (removes from demo data)
  async deleteOrganization(id: number) {
    const orgIndex = organizations.findIndex((org) => org.id === id);
    if (orgIndex === -1) {
      throw new Error("Organization not found");
    }
    const deletedOrg = organizations.splice(orgIndex, 1);

    return deletedOrg[0];
  },

  async getOrganizationById(orgId: number) {
    // Mock implementation, replace with actual API call
    return {
      id: orgId,
      name: "Example Organization",
      sector: "Technology",
      status: "Active",
      users: 100,
      testsCompleted: 50,
      createdAt: "2025-01-01",
    };
  },

  async getAllOrgMembers(orgId: number) {
    // Mock implementation, replace with actual API call
    return [
      {
        id: 1,
        branchName: "Headquarters",
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "123-456-7890",
      },
      {
        id: 2,
        branchName: "Branch A",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        phone: "987-654-3210",
      },
    ];
  },
};
