import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/admin-messages")({
  beforeLoad: () => { throw redirect({ to: "/portal/messages" }); },
  component: () => null,
});
