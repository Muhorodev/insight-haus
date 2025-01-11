import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { AppSidebar } from "./components/AppSidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { dark } from "@clerk/themes";
import { ClerkProvider } from "@clerk/clerk-react";

const queryClient = new QueryClient();

const App = () => {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: { colorPrimary: "#34C759" },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <SidebarProvider>
          <div className="min-h-screen flex w-full bg-background text-foreground">
            <AppSidebar />
            <main className="flex-1 p-6">
              <SidebarTrigger />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<div>Dashboard</div>} />
                  <Route path="/datasets" element={<div>Datasets</div>} />
                  <Route path="/analysis" element={<div>Analysis</div>} />
                  <Route path="/reports" element={<div>Reports</div>} />
                  <Route path="/shared" element={<div>Shared</div>} />
                  <Route path="/settings" element={<div>Settings</div>} />
                </Routes>
              </BrowserRouter>
            </main>
          </div>
        </SidebarProvider>
        <Toaster />
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export default App;