import DescopeClient, { AuthenticationInfo } from "@descope/node-sdk";

let descopeClient: ReturnType<typeof DescopeClient>;

try {
  if (!process.env.PUBLIC_DESCOPE_PROJECT_ID) {
    throw new Error("PUBLIC_DESCOPE_PROJECT_ID is not set");
  }
  descopeClient = DescopeClient({
    projectId: process.env.PUBLIC_DESCOPE_PROJECT_ID,
  });
} catch (error) {
  console.log("failed to initialize: " + error);
}

export async function validateSession(sessionToken: string): Promise<AuthenticationInfo> {
  if (!descopeClient) {
    throw new Error("Descope client not initialized");
  }
  return descopeClient.validateSession(sessionToken);
}

