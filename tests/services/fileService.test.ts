import { uploadFile } from "@/services/fileService";
import api from "@/services/api";
import MockAdapter from "axios-mock-adapter";

describe("fileService", () => {
  const mock = new MockAdapter(api);

  afterEach(() => {
    mock.reset();
  });

  it("should upload a file successfully", async () => {
    const mockResponse = { message: "File uploaded successfully" };
    mock.onPost("/files/upload").reply(200, mockResponse);

    const file = new File(["content"], "test.txt", { type: "text/plain" });
    const result = await uploadFile(file);
    expect(result.success).toBe(true);
    expect(result.data).toEqual(mockResponse);
  });

  it("should handle file upload failure", async () => {
    mock.onPost("/files/upload").reply(500, { message: "Upload failed" });

    const file = new File(["content"], "test.txt", { type: "text/plain" });
    const result = await uploadFile(file);
    expect(result.success).toBe(false);
    expect(result.error).toBe("Upload failed");
  });
});
