"use client";

import { useEffect, useState } from "react";
import { listOrganizations } from "@/services/organization.service";
import { getAllOrgMembers } from "@/services/user.service";
import { getResults } from "@/services/test.service";
import {
    SuperadminPageData,
    initialSuperadminPageData,
    Organization,
    Employee,
    EmployeeWithResults,
    OrganizationWithPopulatedEmployees,
    EmployeeTestResultsBundle
} from "@/types/superadmin.types"; // Adjust path if needed

import { PageTitle } from "@/components/page-title";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Dynamically import result display components from superadmin components
import dynamic from 'next/dynamic';
const MBTIResultAdmin = dynamic(() => import('@/components/superadmin/MBTIResultAdmin').then(m => m.default), { ssr: false, loading: () => <Loader2 className="animate-spin" /> });
const BigFiveResultAdmin = dynamic(() => import('@/components/superadmin/BigFiveResultAdmin').then(m => m.default), { ssr: false, loading: () => <Loader2 className="animate-spin" /> });
const RIASECResultAdmin = dynamic(() => import('@/components/superadmin/RIASECResultAdmin').then(m => m.default), { ssr: false, loading: () => <Loader2 className="animate-spin" /> });
const EnneagramResultAdmin = dynamic(() => import('@/components/superadmin/EnneagramResultAdmin').then(m => m.default), { ssr: false, loading: () => <Loader2 className="animate-spin" /> });


export default function SuperadminTestResultsPage() {
    const [pageData, setPageData] = useState<SuperadminPageData>(initialSuperadminPageData);
    const [error, setError] = useState<string | null>(null);

    // Fetch all organizations on mount
    useEffect(() => {
        setPageData(prev => ({ ...prev, isLoadingOrganizations: true }));
        setError(null);
        listOrganizations()
            .then(orgs => {
                setPageData(prev => ({
                    ...prev,
                    organizations: orgs,
                    isLoadingOrganizations: false,
                }));
            })
            .catch(err => {
                console.error("Error fetching organizations:", err);
                setError("Failed to load organizations. " + (err.message || ""));
                setPageData(prev => ({ ...prev, isLoadingOrganizations: false }));
            });
    }, []);

    const handleOrganizationSelect = (orgId: string) => {
        const numericOrgId = parseInt(orgId, 10);
        if (isNaN(numericOrgId)) {
            setError("Invalid organization ID selected.");
            return;
        }

        setPageData(prev => ({
            ...prev,
            selectedOrganizationId: numericOrgId,
            selectedEmployeeId: null, // Reset employee selection
            // Mark this org as loading its employees
            organizationsDataMap: new Map(prev.organizationsDataMap).set(numericOrgId, {
                ...(prev.organizationsDataMap.get(numericOrgId) || { id: numericOrgId, name: prev.organizations.find(o => o.id === numericOrgId)?.name || "Unknown Org", employees: [] }), // Basic org info
                isLoadingEmployees: true,
                hasFetchedEmployees: false,
            })
        }));
        setError(null);

        getAllOrgMembers(numericOrgId)
            .then(members => {
                const employeesWithResults: EmployeeWithResults[] = members.map(member => ({
                    ...member, // Spread ServiceUser properties
                    testResultsData: undefined, // Will be fetched on demand
                    isLoadingResults: false,
                }));

                setPageData(prev => {
                    const orgData = prev.organizationsDataMap.get(numericOrgId);
                    return {
                        ...prev,
                        organizationsDataMap: new Map(prev.organizationsDataMap).set(numericOrgId, {
                            ...(orgData!), // Should exist
                            id: numericOrgId, // ensure id is set
                            name: prev.organizations.find(o => o.id === numericOrgId)?.name || orgData?.name || "Unknown Org", // ensure name
                            employees: employeesWithResults,
                            isLoadingEmployees: false,
                            hasFetchedEmployees: true,
                        })
                    };
                });
            })
            .catch(err => {
                console.error(`Error fetching employees for org ${numericOrgId}:`, err);
                setError(`Failed to load employees for the selected organization. ` + (err.message || ""));
                setPageData(prev => {
                     const orgData = prev.organizationsDataMap.get(numericOrgId);
                     return {
                        ...prev,
                        organizationsDataMap: new Map(prev.organizationsDataMap).set(numericOrgId, {
                             ...(orgData!),
                             id: numericOrgId,
                             name: prev.organizations.find(o => o.id === numericOrgId)?.name || orgData?.name || "Unknown Org",
                             employees: [],
                             isLoadingEmployees: false,
                             hasFetchedEmployees: true, // Or false, to allow retry
                        })
                     };
                });
            });
    };

    const handleEmployeeSelect = (employeeIdStr: string) => {
        const employeeId = parseInt(employeeIdStr, 10);
        if (isNaN(employeeId) || !pageData.selectedOrganizationId) {
            setError("Invalid employee or organization selection.");
            return;
        }

        setPageData(prev => ({ ...prev, selectedEmployeeId: employeeId }));

        // Check if results are already fetched or are fetching
        const orgMap = pageData.organizationsDataMap;
        const currentOrg = orgMap.get(pageData.selectedOrganizationId);
        const currentEmployee = currentOrg?.employees.find(emp => emp.id === employeeId);

        if (currentEmployee && (currentEmployee.testResultsData || currentEmployee.isLoadingResults)) {
            return; // Data already present or loading
        }

        // Mark employee as loading results
        if (currentOrg) {
            const updatedEmployees = currentOrg.employees.map(emp =>
                emp.id === employeeId ? { ...emp, isLoadingResults: true } : emp
            );
            setPageData(prev => ({
                ...prev,
                organizationsDataMap: new Map(prev.organizationsDataMap).set(currentOrg.id, {
                    ...currentOrg,
                    employees: updatedEmployees,
                })
            }));
        }
        setError(null);

        getResults(String(employeeId))
            .then(apiResponse => { // apiResponse is ApiResponse<PersonalityTestScores>
                const testScores = apiResponse.data; // This is PersonalityTestScores
                setPageData(prev => {
                    const orgIdToUpdate = prev.selectedOrganizationId!;
                    const orgMapToUpdate = new Map(prev.organizationsDataMap);
                    const orgToUpdate = orgMapToUpdate.get(orgIdToUpdate);
                    if (orgToUpdate) {
                        const updatedEmps = orgToUpdate.employees.map(emp =>
                            emp.id === employeeId
                                ? { ...emp, testResultsData: testScores, isLoadingResults: false }
                                : emp
                        );
                        orgMapToUpdate.set(orgIdToUpdate, { ...orgToUpdate, employees: updatedEmps });
                        return { ...prev, organizationsDataMap: orgMapToUpdate };
                    }
                    return prev;
                });
            })
            .catch(err => {
                console.error(`Error fetching test results for employee ${employeeId}:`, err);
                setError(`Failed to load test results. ` + (err.message || ""));
                 setPageData(prev => {
                    const orgIdToUpdate = prev.selectedOrganizationId!;
                    const orgMapToUpdate = new Map(prev.organizationsDataMap);
                    const orgToUpdate = orgMapToUpdate.get(orgIdToUpdate);
                    if (orgToUpdate) {
                        const updatedEmps = orgToUpdate.employees.map(emp =>
                            emp.id === employeeId
                                ? { ...emp, isLoadingResults: false } // Reset loading state
                                : emp
                        );
                        orgMapToUpdate.set(orgIdToUpdate, { ...orgToUpdate, employees: updatedEmps });
                        return { ...prev, organizationsDataMap: orgMapToUpdate };
                    }
                    return prev;
                });
            });
    };

    const selectedOrgDetails = pageData.selectedOrganizationId ? pageData.organizationsDataMap.get(pageData.selectedOrganizationId) : undefined;
    const selectedEmployeeDetails = selectedOrgDetails && pageData.selectedEmployeeId
        ? selectedOrgDetails.employees.find(emp => emp.id === pageData.selectedEmployeeId)
        : undefined;

    return (
        <div className="space-y-6 p-4 md:p-6">
            <PageTitle title="Superadmin Test Results" description="View test results by organization and employee." />

            {error && (
                <Card className="border-destructive bg-destructive/10">
                    <CardHeader>
                        <CardTitle className="text-destructive flex items-center">
                            <AlertCircle className="mr-2 h-5 w-5" /> Error
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-destructive">
                        <p>{error}</p>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Column 1: Organizations List */}
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle>Organizations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {pageData.isLoadingOrganizations ? (
                            <div className="flex justify-center items-center py-4"><Loader2 className="animate-spin mr-2" />Loading organizations...</div>
                        ) : pageData.organizations.length === 0 && !error ? (
                            <p>No organizations found.</p>
                        ) : (
                            <Select onValueChange={handleOrganizationSelect} value={pageData.selectedOrganizationId?.toString()}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select an organization" />
                                </SelectTrigger>
                                <SelectContent>
                                    {pageData.organizations.map(org => (
                                        <SelectItem key={org.id} value={String(org.id)}>{org.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </CardContent>
                </Card>

                {/* Column 2: Employees List */}
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle>Employees</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {!pageData.selectedOrganizationId ? (
                            <p className="text-muted-foreground">Select an organization to see employees.</p>
                        ) : selectedOrgDetails?.isLoadingEmployees ? (
                            <div className="flex justify-center items-center py-4"><Loader2 className="animate-spin mr-2" />Loading employees...</div>
                        ) : !selectedOrgDetails?.hasFetchedEmployees && !selectedOrgDetails?.isLoadingEmployees && pageData.selectedOrganizationId ? (
                             <p className="text-muted-foreground">Failed to load employees or none found. Try re-selecting organization.</p>
                        ) : selectedOrgDetails?.employees.length === 0 ? (
                            <p>No employees found for this organization.</p>
                        ) : (
                             <Select onValueChange={handleEmployeeSelect} value={pageData.selectedEmployeeId?.toString()}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select an employee" />
                                </SelectTrigger>
                                <SelectContent>
                                    {selectedOrgDetails?.employees.map(emp => (
                                        <SelectItem key={emp.id} value={String(emp.id)}>{emp.name} ({emp.email})</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </CardContent>
                </Card>

                {/* Column 3: Test Results Display */}
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle>Test Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {!pageData.selectedEmployeeId ? (
                            <p className="text-muted-foreground">Select an employee to see their test results.</p>
                        ) : selectedEmployeeDetails?.isLoadingResults ? (
                            <div className="flex justify-center items-center py-4"><Loader2 className="animate-spin mr-2" />Loading results...</div>
                        ) : !selectedEmployeeDetails?.testResultsData && !selectedEmployeeDetails?.isLoadingResults && pageData.selectedEmployeeId ? (
                            <p className="text-muted-foreground">No test data found or failed to load for this employee.</p>
                        ) : selectedEmployeeDetails?.testResultsData ? (
                            <div className="space-y-4">
                                {selectedEmployeeDetails.testResultsData.mbti && (
                                    <div>
                                        <h3 className="font-semibold mb-2">MBTI Results</h3>
                                        <MBTIResultAdmin result={selectedEmployeeDetails.testResultsData.mbti} />
                                    </div>
                                )}
                                {selectedEmployeeDetails.testResultsData.big_five && (
                                     <div>
                                        <h3 className="font-semibold mb-2">Big Five Results</h3>
                                        <BigFiveResultAdmin result={selectedEmployeeDetails.testResultsData.big_five} />
                                    </div>
                                )}
                                {selectedEmployeeDetails.testResultsData.riasec_scores && selectedEmployeeDetails.testResultsData.riasec_scores.length > 0 && (
                                     <div>
                                        <h3 className="font-semibold mb-2">RIASEC Results</h3>
                                        <RIASECResultAdmin result={selectedEmployeeDetails.testResultsData.riasec_scores} />
                                    </div>
                                )}
                                {selectedEmployeeDetails.testResultsData.enneagram_scores && selectedEmployeeDetails.testResultsData.enneagram_scores.length > 0 && (
                                     <div>
                                        <h3 className="font-semibold mb-2">Enneagram Results</h3>
                                        <EnneagramResultAdmin result={selectedEmployeeDetails.testResultsData.enneagram_scores} />
                                    </div>
                                )}
                                {!(selectedEmployeeDetails.testResultsData.mbti || selectedEmployeeDetails.testResultsData.big_five || (selectedEmployeeDetails.testResultsData.riasec_scores && selectedEmployeeDetails.testResultsData.riasec_scores.length > 0) || (selectedEmployeeDetails.testResultsData.enneagram_scores && selectedEmployeeDetails.testResultsData.enneagram_scores.length > 0)) && (
                                    <p>No specific test results found for this employee.</p>
                                )}
                            </div>
                        ) : (
                             <p className="text-muted-foreground">Select an employee to view results.</p> // Fallback
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
