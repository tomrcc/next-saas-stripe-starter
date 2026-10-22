import { pageSchema } from "fumadocs-core/source/schema"
import { z } from "zod"

// CloudCannon writes null for a cleared field: read it as absent.
export const optionalString = z
  .string()
  .nullish()
  .transform((value) => value ?? undefined)

// Fumadocs' page fields, with a description that may be null.
export const pageFields = pageSchema.extend({ description: optionalString })
