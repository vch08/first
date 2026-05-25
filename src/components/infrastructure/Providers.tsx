// "use client";

// import { environmentManager, QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// import type { ReactNode } from "react";
// import { MaintenanceModal } from "@/components/infrastructure/MaintenanceModal";

// let browserQueryClient: QueryClient | undefined;

// function getQueryClient() {
//   if (environmentManager.isServer()) {
//     return new QueryClient();
//   }

//   if (!browserQueryClient) {
//     browserQueryClient = new QueryClient();
//   }

//   return browserQueryClient;
// }

// interface ProvidersProps {
//   children: ReactNode;
// }

// export function Providers({ children }: ProvidersProps) {
//   const queryClient = getQueryClient();

//   return (
//     <QueryClientProvider client={queryClient}>
//       <MaintenanceModal>{children}</MaintenanceModal>
//       <ReactQueryDevtools />
//     </QueryClientProvider>
//   );
// }

"use client";

import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

let client: QueryClient | undefined;

function getClient() {
  if (!client) client = new QueryClient();
  return client;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={getClient()}>
      <MantineProvider>
        <ModalsProvider>{children}</ModalsProvider>
      </MantineProvider>
    </QueryClientProvider>
  );
}
