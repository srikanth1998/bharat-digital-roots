import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/portal/app-sidebar";

export const Route = createFileRoute("/_authenticated/portal")({
  ssr: false,
  component: PortalLayout,
});

function PortalLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-brand-paper">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b border-brand-ink/10 bg-white px-3 md:px-6">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <Link to="/" className="text-xs text-brand-ink/60 hover:text-brand-ink">
                ← Home
              </Link>
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
