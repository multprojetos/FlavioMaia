import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import Home from "@/pages/Home";
import Properties from "@/pages/Properties";
import PropertyDetail from "@/pages/PropertyDetail";
import Contact from "@/pages/Contact";
import About from "@/pages/About";
import Services from "@/pages/Services";
import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import PropertiesList from "@/pages/admin/PropertiesList";
import PropertyForm from "@/pages/admin/PropertyForm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";


function Router() {
  return (
    <Switch>
      {/* Admin Routes (no header/footer) */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/imoveis" component={PropertiesList} />
      <Route path="/admin/imoveis/novo" component={PropertyForm} />
      <Route path="/admin/imoveis/:id/editar" component={PropertyForm} />

      {/* Public Routes (with header/footer) */}
      <Route>
        {() => (
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              <Switch>
                <Route path="/" component={Home} />
                <Route path="/imoveis" component={Properties} />
                <Route path="/imovel/:id" component={PropertyDetail} />
                <Route path="/quem-somos" component={About} />
                <Route path="/servicos" component={Services} />
                <Route path="/contato" component={Contact} />
                <Route path="/404" component={NotFound} />
                <Route component={NotFound} />
              </Switch>
            </main>
            <Footer />
          </div>
        )}
      </Route>
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
