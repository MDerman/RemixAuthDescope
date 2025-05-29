import { AuthProvider, useSession, useUser, Descope } from "@descope/react-sdk";
import { Outlet } from "@remix-run/react";
import { toast } from "~/hooks/use-toast";

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider projectId={window.ENV.PUBLIC_DESCOPE_PROJECT_ID ?? ""}>
      <AuthInner>
        <Outlet />
      </AuthInner>
    </AuthProvider>
  );
}

function AuthInner({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isSessionLoading } = useSession();
  const { isUserLoading } = useUser();

  return (
    <>
      {!isAuthenticated && (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
          <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-700">
            <Descope
              flowId="sign-up-or-in"
              onSuccess={(e) => console.log(e.detail.user)}
              onError={(e) =>
                toast({
                  title: "Could not log in!",
                  description: "Please try again.",
                  variant: "destructive",
                })
              }
            />
          </div>
        </div>
      )}

      {isAuthenticated && (isSessionLoading || isUserLoading) && (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
          <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-700 text-center">
            <p className="text-gray-700 dark:text-gray-300">Loading...</p>
          </div>
        </div>
      )}

      {isAuthenticated && !isSessionLoading && !isUserLoading && <Outlet />}
    </>
  );
}
