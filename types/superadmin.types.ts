// types/superadmin.types.ts
import { Organization as ServiceOrganization } from "@/services/organization.service";
import { User as ServiceUser } from "@/services/user.service";
import {
    PersonalityTestScores // This type from personality.type.ts includes mbti, big_five, enneagram_scores, riasec_scores
} from "./personality.type";

// Use the Organization type from the service
export type Organization = ServiceOrganization;

// Use the User type from the service for Employee representation
// ServiceUser already includes id, name, email, org_id, etc.
export interface Employee extends ServiceUser {}

// This type will directly hold the data part of the response from test.service.ts#getResults
// The service returns ApiResponse<PersonalityTestScores>, so the actual data is PersonalityTestScores.
export type EmployeeTestResultsBundle = PersonalityTestScores;

export interface EmployeeWithResults extends Employee {
    testResultsData?: EmployeeTestResultsBundle; // Contains the actual fetched test scores
    isLoadingResults?: boolean; // To track loading state for this specific employee's results
}

export interface OrganizationWithPopulatedEmployees extends Organization {
    employees: EmployeeWithResults[];
    hasFetchedEmployees?: boolean; // To track if employees for this org have been fetched
    isLoadingEmployees?: boolean; // To track loading state for this org's employees
}

// This will be the primary data structure for the superadmin page's state
export interface SuperadminPageData {
    organizations: Organization[]; // List of all organizations (summary)
    selectedOrganizationId?: number | null; // Organization.id is number

    // Detailed data for organizations, including their employees, stored in a map for efficient access and updates.
    // The key is organization.id (number).
    organizationsDataMap: Map<number, OrganizationWithPopulatedEmployees>;

    selectedEmployeeId?: number | null; // Employee.id is number
    // Test results for the selectedEmployeeId will be found within the corresponding
    // EmployeeWithResults object in the organizationsDataMap.

    isLoadingOrganizations: boolean;
    // Granular loading for employees/results is within OrganizationWithPopulatedEmployees and EmployeeWithResults.
}

// Initial state for the page data
export const initialSuperadminPageData: SuperadminPageData = {
    organizations: [],
    selectedOrganizationId: null,
    organizationsDataMap: new Map(),
    selectedEmployeeId: null,
    isLoadingOrganizations: false,
};
