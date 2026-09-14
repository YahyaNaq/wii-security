import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaPg } from "@prisma/adapter-pg";

// Neon's serverless adapter speaks to Neon's own WebSocket proxy, not the
// Postgres wire protocol — it can't reach a local/non-Neon Postgres server.
// Fall back to the plain `pg`-based adapter whenever the URL isn't Neon's.
export function createPrismaAdapter(connectionString: string) {
  return connectionString.includes(".neon.tech")
    ? new PrismaNeon({ connectionString })
    : new PrismaPg({ connectionString });
}
