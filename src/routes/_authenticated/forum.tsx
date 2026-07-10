import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/forum")({
  beforeLoad: () => { throw redirect({ to: "/portal/forum" }); },
  component: () => null,
});
