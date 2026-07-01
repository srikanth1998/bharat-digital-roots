import { z } from "zod";

export const PLAN_IDS = [
  "active_1year",
  "active_lifetime",
  "passive_1year",
  "passive_lifetime",
] as const;

export type PlanId = (typeof PLAN_IDS)[number];

export const PLAN_PRICES_INR: Record<PlanId, number> = {
  active_1year: 500,
  active_lifetime: 6000,
  passive_1year: 100,
  passive_lifetime: 1200,
};

export const isPlanId = (value: string): value is PlanId => {
  return PLAN_IDS.includes(value as PlanId);
};

export const planDuration = (planId: string): "1 year" | "lifetime" | "unknown" => {
  if (!isPlanId(planId)) return "unknown";
  return planId.endsWith("_lifetime") ? "lifetime" : "1 year";
};

export const planName = (planId: string): string => {
  if (!isPlanId(planId)) return "Membership";
  const duration = planDuration(planId);
  const base = planId.startsWith("active") ? "Active Membership" : "Passive Membership";
  return duration === "lifetime" ? `${base} (Lifetime)` : `${base} (1 Year)`;
};

export const planNameShort = (planId: string): string => {
  if (!isPlanId(planId)) return "Member";
  return planId.startsWith("active") ? "Active" : "Passive";
};

export const planIdSchema = z.enum([
  "active_1year",
  "active_lifetime",
  "passive_1year",
  "passive_lifetime",
]);

