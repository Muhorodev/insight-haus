import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { AppSidebar } from "./components/AppSidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { dark } from "@clerk/themes";
import { ClerkProvider, SignIn, SignUp, useAuth } from "@clerk/clerk-react";
import { useState } from "react";

const queryClient = new QueryClient();

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { isLoaded, isSignedIn } = useAuth();
  
  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  
  if (!isSignedIn) {
    return <Navigate to="/sign-in" />;
  }

  return children;
};

const App = () => {
  const [isDarkMode] = useState(true);

  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: { colorPrimary: "#34C759" },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <div className={isDarkMode ? "dark" : ""}>
          <BrowserRouter>
            <SidebarProvider>
              <div className="min-h-screen flex w-full bg-background text-foreground">
                <AppSidebar />
                <main className="flex-1 p-6 overflow-auto">
                  <SidebarTrigger />
                  <Routes>
                    <Route path="/sign-in/*" element={<SignIn routing="path" path="/sign-in" />} />
                    <Route path="/sign-up/*" element={<SignUp routing="path" path="/sign-up" />} />
                    <Route
                      path="/"
                      element={
                        <ProtectedRoute>
                          <div>Dashboard</div>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/datasets"
                      element={
                        <ProtectedRoute>
                          <div>Datasets</div>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/analysis"
                      element={
                        <ProtectedRoute>
                          <div>Analysis</div>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/reports"
                      element={
                        <ProtectedRoute>
                          <div>Reports</div>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/shared"
                      element={
                        <ProtectedRoute>
                          <div>Shared</div>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/settings"
                      element={
                        <ProtectedRoute>
                          <div>Settings</div>
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </main>
              </div>
            </SidebarProvider>
          </BrowserRouter>
          <Toaster />
        </div>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export default App;