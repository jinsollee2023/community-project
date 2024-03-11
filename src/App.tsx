import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Router from "./shared/router/Router";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import UserProvider from "./store/UserContext";
import { useEffect } from "react";
import { auth } from "./firebase";
import DialogProvider from "./store/DialogContext";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      throwOnError: true,
      retry: 3,
    },
  },
});

function App() {
  const init = async () => {
    await auth.authStateReady();
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <UserProvider>
        <DialogProvider>
          <Router />
        </DialogProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
