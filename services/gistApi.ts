import axios from "axios";
const GITHUB_TOKEN = process.env["GITHUB_GIST_TOKEN"]; // Ensure compatibility with OS environment variables
if (!GITHUB_TOKEN) {
  throw new Error("❌ GITHUB_GIST_TOKEN is not set in the environment variables.");
}

/**
 * Save payload to a GitHub Gist
 * @param fileName - The name of the file in the Gist
 * @param content - The content to save in the file
 */
export const savePayloadToGist = async (fileName: string, content: string) => {
  try {
    const response = await axios.post<{
      html_url: string;
    }>(
      "https://api.github.com/gists",
      {
        description: "Payload file",
        public: false,
        files: {
          [fileName]: { content },
        },
      },
      {
        headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
      }
    );

    console.log(`✅ Gist created: ${response.data.html_url}`);
    return response.data.html_url;
  } catch (error) {
    console.error("❌ Error creating Gist:", error);
    throw error;
  }
};
