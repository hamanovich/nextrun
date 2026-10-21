import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";

const digest = (value: string) => createHash("sha256").update(value).digest();

export const secretEquals = (provided: string | null, expected: string) =>
  timingSafeEqual(digest(provided ?? ""), digest(expected));
