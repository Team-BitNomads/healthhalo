import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => [
  { title: "HealthHalo" },
  { name: "description", content: "Welcome to HealthHalo!" },
];