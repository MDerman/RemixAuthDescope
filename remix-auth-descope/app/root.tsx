import { cssBundleHref } from "@remix-run/css-bundle";
import type {
  LinksFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  json,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import styles from "./tailwind.css";
import { getTheme } from "./lib/theme/theme.server";
import { Toaster } from "./components/ui/toaster";
import {
  ClientHintCheck,
  getHints,
  useNonce,
  useTheme,
} from "./lib/theme/client-theme-and-hints";
import clsx from "clsx";
import { XCircle } from "lucide-react";
import { ClientOnly } from "./components/client-only";
import { AuthWrapper } from "./components/auth/auth-wrapper";

declare global {
  interface Window {
    ENV: {
      PUBLIC_DESCOPE_PROJECT_ID: string;
    };
  }
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({
    requestInfo: {
      hints: getHints(request),
      userPrefs: {
        theme: getTheme(request),
      },
    },
    //allows you to access these env variables in client using: window.ENV.EXAMPLE_VARIABLE
    ENV: {
      PUBLIC_DESCOPE_PROJECT_ID: process.env.PUBLIC_DESCOPE_PROJECT_ID,
    },
  });
};

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export const meta: MetaFunction = () => {
  return [
    { title: "Remix Auth Descope" },
    { name: "description", content: "Authentication with Remix and Descope" },
  ];
};

export default function App() {
  const data = useLoaderData<typeof loader>();
  const theme = useTheme();
  const nonce = useNonce();

  return (
    <html lang="en" className={clsx(theme)}>
      <head>
        <ClientHintCheck nonce={nonce} />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
          }}
        />
        <ClientOnly>
          <AuthWrapper>
            <Outlet />
          </AuthWrapper>
        </ClientOnly>
        <ScrollRestoration />
        <Scripts />
        <Toaster />
        <LiveReload />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (error instanceof Error) {
    return (
      <div className="p-4 bg-red-50 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <XCircle className="w-5 h-5 text-red-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              An unexpected error occurred:
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <ul className="pl-5 space-y-1 list-disc">
                <li>{error.message}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isRouteErrorResponse(error)) {
    return (
      <div className="p-4 bg-red-50 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <XCircle className="w-5 h-5 text-red-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              An unexpected error occurred:
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <ul className="pl-5 space-y-1 list-disc">
                <li>Unknown Error</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error.status === 404) {
    return (
      <div className="p-4 bg-red-50 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <XCircle className="w-5 h-5 text-red-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              An unexpected error occurred:
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <ul className="pl-5 space-y-1 list-disc">
                <li>Page not found</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-red-50 rounded-md">
      <div className="flex">
        <div className="flex-shrink-0">
          <XCircle className="w-5 h-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            An unexpected error occurred:
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <ul className="pl-5 space-y-1 list-disc">
              <li>{error.statusText}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
