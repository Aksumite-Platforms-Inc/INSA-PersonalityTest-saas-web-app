import { getAllOrgMembers, deleteOrgMember } from "@/services/userService";
import api from "@/services/api";
import MockAdapter from "axios-mock-adapter";

describe("userService", () => {
  const mock = new MockAdapter(api);

  afterEach(() => {
    mock.reset();
  });

  it("should fetch all organization members successfully", async () => {
    const mockResponse = [
      { id: 1, name: "Member 1" },
      { id: 2, name: "Member 2" },
    ];
    mock.onGet("/organization/1/members").reply(200, mockResponse);

    const result = await getAllOrgMembers(1);
    expect(result.success).toBe(true);
    expect(result.data).toEqual(mockResponse);
  });

  it("should handle fetch organization members failure", async () => {
    mock
      .onGet("/organization/1/members")
      .reply(500, { message: "Server error" });

    const result = await getAllOrgMembers(1);
    expect(result.success).toBe(false);
    expect(result.error).toBe("Server error");
  });

  it("should delete an organization member successfully", async () => {
    mock.onDelete("/organization/1/members/2").reply(200);

    const result = await deleteOrgMember(1, 2);
    expect(result.success).toBe(true);
    expect(result.data).toBeNull();
  });

  it("should handle delete organization member failure", async () => {
    mock
      .onDelete("/organization/1/members/2")
      .reply(404, { message: "Member not found" });

    const result = await deleteOrgMember(1, 2);
    expect(result.success).toBe(false);
    expect(result.error).toBe("Member not found");
  });
});
