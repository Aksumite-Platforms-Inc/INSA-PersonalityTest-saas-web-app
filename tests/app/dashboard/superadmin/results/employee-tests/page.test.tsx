import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import SuperadminEmployeeTestsPage from "@/app/dashboard/superadmin/results/employee-tests/page";
import { listOrganizations } from "@/services/organization.service";
import { getAllOrgMembers } from "@/services/user.service";
import { getResults } from "@/services/test.service";

// Mock services
jest.mock("@/services/organization.service");
jest.mock("@/services/user.service");
jest.mock("@/services/test.service");

// Mock dynamic components
jest.mock("@/components/superadmin/MBTIResultAdmin", () => () => <div data-testid="mbti-result-admin">MBTI Result Admin</div>);
jest.mock("@/components/superadmin/BigFiveResultAdmin", () => () => <div data-testid="bigfive-result-admin">Big Five Result Admin</div>);
jest.mock("@/components/superadmin/RIASECResultAdmin", () => () => <div data-testid="riasec-result-admin">RIASEC Result Admin</div>);
jest.mock("@/components/superadmin/EnneagramResultAdmin", () => () => <div data-testid="enneagram-result-admin">Enneagram Result Admin</div>);

// Mock Next.js dynamic import itself if it causes issues, though mocking the components directly is usually enough.
// jest.mock('next/dynamic', () => () => {
//   const DynamicComponent = () => null;
//   DynamicComponent.displayName = 'LoadableComponent';
//   DynamicComponent.preload = jest.fn();
//   return DynamicComponent;
// });


const mockListOrganizations = listOrganizations as jest.Mock;
const mockGetAllOrgMembers = getAllOrgMembers as jest.Mock;
const mockGetResults = getResults as jest.Mock;

const mockOrganizations = [
  { id: 1, name: "Org Alpha", email: "alpha@org.com", agreement: "", status: "active", address: "", sector: "", phone_number: "", created_at: new Date(), updated_at: new Date() },
  { id: 2, name: "Org Beta", email: "beta@org.com", agreement: "", status: "active", address: "", sector: "", phone_number: "", created_at: new Date(), updated_at: new Date() },
];

const mockEmployeesOrg1 = [
  { id: 101, name: "Alice Smith", email: "alice@orgalpha.com", department: "HR", position: "Manager", org_id: 1, branch_id: 1, role: "employee", status: "active", created_at: "" },
  { id: 102, name: "Bob Johnson", email: "bob@orgalpha.com", department: "Engineering", position: "Developer", org_id: 1, branch_id: 1, role: "employee", status: "active", created_at: ""  },
];

const mockEmployeesOrg2 = [
  { id: 201, name: "Charlie Brown", email: "charlie@orgbeta.com", department: "Sales", position: "Executive", org_id: 2, branch_id: 1, role: "employee", status: "active", created_at: ""  },
];

const mockTestResultsAlice = {
  mbti: { personality: "INTJ" },
  big_five: { Raw: { O: 1, C: 2, E: 3, A: 4, N: 5 } },
  // riasec and enneagram can be null or have data
};


describe("SuperadminEmployeeTestsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default successful mock for organizations
    mockListOrganizations.mockResolvedValue({ data: mockOrganizations });
    // Default empty mocks for others to avoid console errors if not specifically set in a test
    mockGetAllOrgMembers.mockResolvedValue({ data: [] });
    mockGetResults.mockResolvedValue({ data: {} });
  });

  test("1. Initial Render: displays organization dropdown with organizations", async () => {
    render(<SuperadminEmployeeTestsPage />);

    expect(screen.getByText("Select Organization")).toBeInTheDocument();

    // Open the select dropdown
    // Shadcn/ui Select is tricky with getByRole('combobox') sometimes, using placeholder text.
    const selectTrigger = screen.getByText("Select an organization"); // Based on SelectValue placeholder
    fireEvent.mouseDown(selectTrigger); // Opens the dropdown

    await waitFor(() => {
      expect(screen.getByText("Org Alpha")).toBeInTheDocument();
      expect(screen.getByText("Org Beta")).toBeInTheDocument();
    });
  });

  describe("2. Organization Selection and Employee Fetching", () => {
    test("displays employees when an organization is selected", async () => {
      mockGetAllOrgMembers.mockResolvedValueOnce({ data: mockEmployeesOrg1 });
      render(<SuperadminEmployeeTestsPage />);

      // Select "Org Alpha"
      fireEvent.mouseDown(screen.getByText("Select an organization"));
      await waitFor(() => screen.getByText("Org Alpha"));
      fireEvent.click(screen.getByText("Org Alpha"));

      expect(mockGetAllOrgMembers).toHaveBeenCalledWith(1); // Org Alpha has id 1

      // Check for loading state (might be too fast to catch reliably without specific timing)
      // expect(screen.getByText(/Loading employees.../i)).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByText("Alice Smith")).toBeInTheDocument();
        expect(screen.getByText("bob@orgalpha.com")).toBeInTheDocument();
      });
    });

    test("shows loading state for employees", async () => {
      let resolvePromise: any;
      mockGetAllOrgMembers.mockImplementationOnce(() =>
        new Promise(resolve => { resolvePromise = resolve; })
      );
      render(<SuperadminEmployeeTestsPage />);

      fireEvent.mouseDown(screen.getByText("Select an organization"));
      await waitFor(() => screen.getByText("Org Alpha"));
      fireEvent.click(screen.getByText("Org Alpha"));

      expect(screen.getByText(/Loading employees.../i)).toBeInTheDocument();

      // Resolve the promise to finish the test
      await act(async () => {
        resolvePromise({ data: mockEmployeesOrg1 });
      });
      await waitFor(() => expect(screen.getByText("Alice Smith")).toBeInTheDocument());
    });

    test("handles error when fetching employees fails", async () => {
      mockGetAllOrgMembers.mockRejectedValueOnce(new Error("Failed to fetch employees"));
      render(<SuperadminEmployeeTestsPage />);

      fireEvent.mouseDown(screen.getByText("Select an organization"));
      await waitFor(() => screen.getByText("Org Alpha"));
      fireEvent.click(screen.getByText("Org Alpha"));

      await waitFor(() => {
        expect(screen.getByText("Failed to fetch employees.")).toBeInTheDocument();
      });
    });
  });

  describe("3. Employee Search/Filtering", () => {
    beforeEach(async () => {
      mockGetAllOrgMembers.mockResolvedValue({ data: mockEmployeesOrg1 });
      render(<SuperadminEmployeeTestsPage />);
      // Select "Org Alpha" to load employees
      fireEvent.mouseDown(screen.getByText("Select an organization"));
      await waitFor(() => screen.getByText("Org Alpha"));
      fireEvent.click(screen.getByText("Org Alpha"));
      await waitFor(() => screen.getByText("Alice Smith")); // Wait for employees to load
    });

    test("filters employees by name", async () => {
      const searchInput = screen.getByPlaceholderText("Search by name or email...");
      fireEvent.change(searchInput, { target: { value: "Alice" } });

      await waitFor(() => {
        expect(screen.getByText("Alice Smith")).toBeInTheDocument();
        expect(screen.queryByText("Bob Johnson")).not.toBeInTheDocument();
      });
    });

    test("filters employees by email", async () => {
      const searchInput = screen.getByPlaceholderText("Search by name or email...");
      fireEvent.change(searchInput, { target: { value: "bob@orgalpha.com" } });

      await waitFor(() => {
        expect(screen.getByText("Bob Johnson")).toBeInTheDocument();
        expect(screen.queryByText("Alice Smith")).not.toBeInTheDocument();
      });
    });

    test("shows all employees when search term is cleared", async () => {
      const searchInput = screen.getByPlaceholderText("Search by name or email...");
      fireEvent.change(searchInput, { target: { value: "Alice" } });

      await waitFor(() => expect(screen.queryByText("Bob Johnson")).not.toBeInTheDocument());

      fireEvent.change(searchInput, { target: { value: "" } });
      await waitFor(() => {
        expect(screen.getByText("Alice Smith")).toBeInTheDocument();
        expect(screen.getByText("Bob Johnson")).toBeInTheDocument();
      });
    });

     test("shows 'No employees match your search.' when search yields no results", async () => {
      const searchInput = screen.getByPlaceholderText("Search by name or email...");
      fireEvent.change(searchInput, { target: { value: "NonExistentName" } });

      await waitFor(() => {
        expect(screen.getByText("No employees match your search.")).toBeInTheDocument();
      });
    });
  });

  describe("4. View Employee Test Results", () => {
    beforeEach(async () => {
      // Load Org Alpha and its employees
      mockGetAllOrgMembers.mockResolvedValue({ data: mockEmployeesOrg1 });
      render(<SuperadminEmployeeTestsPage />);
      fireEvent.mouseDown(screen.getByText("Select an organization"));
      await waitFor(() => screen.getByText("Org Alpha"));
      fireEvent.click(screen.getByText("Org Alpha"));
      await waitFor(() => screen.getByText("Alice Smith")); // Wait for Alice to be loaded
    });

    test("displays test results when 'View Results' is clicked", async () => {
      mockGetResults.mockResolvedValueOnce({ data: mockTestResultsAlice });

      // Find Alice Smith's row and click "View Results"
      // Assuming "View Results" is unique enough or we can scope it to Alice's row
      const viewResultsButtons = screen.getAllByText("View Results");
      // This is a bit fragile if there are multiple identical buttons.
      // A better way would be to find the row containing "Alice Smith" then find the button within that row.
      // For now, let's assume the first one corresponds to Alice if employees are rendered in order.
      fireEvent.click(viewResultsButtons[0]);

      expect(mockGetResults).toHaveBeenCalledWith(mockEmployeesOrg1[0].id.toString());

      // await waitFor(() => expect(screen.getByText(/Loading test results.../i)).toBeInTheDocument());

      await waitFor(() => {
        expect(screen.getByText("Test Results")).toBeInTheDocument(); // Page title changes
        expect(screen.getByTestId("mbti-result-admin")).toBeInTheDocument();
        expect(screen.getByTestId("bigfive-result-admin")).toBeInTheDocument();
      });
      expect(screen.getByText("MBTI")).toBeInTheDocument(); // Tab trigger
      expect(screen.getByText("Big Five")).toBeInTheDocument(); // Tab trigger
    });

    test("shows loading state for test results", async () => {
      let resolvePromise: any;
      mockGetResults.mockImplementationOnce(() =>
        new Promise(resolve => { resolvePromise = resolve; })
      );

      fireEvent.click(screen.getAllByText("View Results")[0]);
      expect(screen.getByText(/Loading test results.../i)).toBeInTheDocument();

      await act(async () => {
        resolvePromise({ data: mockTestResultsAlice });
      });
      await waitFor(() => expect(screen.getByTestId("mbti-result-admin")).toBeInTheDocument());
    });

    test("handles error when fetching test results fails", async () => {
      mockGetResults.mockRejectedValueOnce(new Error("Failed to fetch results"));
      fireEvent.click(screen.getAllByText("View Results")[0]);

      await waitFor(() => {
        expect(screen.getByText("Failed to fetch test results.")).toBeInTheDocument();
      });
    });
  });

  describe("5. Back Navigation", () => {
    test("navigates back to employee list from results view", async () => {
      mockGetAllOrgMembers.mockResolvedValue({ data: mockEmployeesOrg1 });
      mockGetResults.mockResolvedValue({ data: mockTestResultsAlice });
      render(<SuperadminEmployeeTestsPage />);

      // Go to Org Alpha employees
      fireEvent.mouseDown(screen.getByText("Select an organization"));
      await waitFor(() => screen.getByText("Org Alpha"));
      fireEvent.click(screen.getByText("Org Alpha"));
      await waitFor(() => screen.getByText("Alice Smith"));

      // Click "View Results" for Alice
      fireEvent.click(screen.getAllByText("View Results")[0]);
      await waitFor(() => screen.getByTestId("mbti-result-admin")); // Wait for results view

      // Click "Back to Employees"
      fireEvent.click(screen.getByText("Back to Employees"));

      await waitFor(() => {
        expect(screen.getByText("Alice Smith")).toBeInTheDocument(); // Back to employee list
        expect(screen.getByText("Bob Johnson")).toBeInTheDocument();
        expect(screen.queryByTestId("mbti-result-admin")).not.toBeInTheDocument(); // Results view is gone
        expect(screen.getByPlaceholderText("Search by name or email...")).toBeInTheDocument(); // Search input is back
      });
      // Check that the main title is also back to "Employee Test Results"
      expect(screen.getByText("Employee Test Results")).toBeInTheDocument();
    });
  });
});

// Helper to find row and then button (more robust)
// const getButtonInRow = (textInRow: string, buttonText: string) => {
//   const row = screen.getByText(textInRow).closest('tr');
//   if (!row) throw new Error(`Row containing "${textInRow}" not found`);
//   const button = within(row).getByText(buttonText);
//   return button;
// };
// fireEvent.click(getButtonInRow("Alice Smith", "View Results"));
// This would require importing `within` from `@testing-library/react`
// and ensuring your table structure allows `closest('tr')` to work as expected.
