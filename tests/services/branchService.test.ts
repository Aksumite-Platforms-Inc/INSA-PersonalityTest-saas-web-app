import { createBranch, getAllBranches } from "@/services/branchService";
import api from "@/services/api";
import MockAdapter from "axios-mock-adapter";

describe("branchService", () => {
  const mock = new MockAdapter(api);

  afterEach(() => {
    mock.reset();
  });

  it("should create a branch successfully", async () => {
    const mockResponse = { id: 1, name: "New Branch" };
    mock.onPost("/organization/1/branches").reply(200, mockResponse);

    const result = await createBranch(1, "New Branch");
    expect(result.success).toBe(true);
    expect(result.data).toEqual(mockResponse);
  });

  it("should handle branch creation failure", async () => {
    mock
      .onPost("/organization/1/branches")
      .reply(400, { message: "Invalid data" });

    const result = await createBranch(1, "");
    expect(result.success).toBe(false);
    expect(result.error).toBe("Invalid data");
  });

  it("should fetch all branches successfully", async () => {
    const mockResponse = [
      { id: 1, name: "Branch 1" },
      { id: 2, name: "Branch 2" },
    ];
    mock.onGet("/organization/branches").reply(200, mockResponse);

    const result = await getAllBranches();
    expect(result.success).toBe(true);
    expect(result.data).toEqual(mockResponse);
  });

  it("should handle fetch branches failure", async () => {
    mock
      .onGet("/organization/branches")
      .reply(500, { message: "Server error" });

    const result = await getAllBranches();
    expect(result.success).toBe(false);
    expect(result.error).toBe("Server error");
  });
});
