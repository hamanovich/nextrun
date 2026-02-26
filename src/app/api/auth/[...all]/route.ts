import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";
import "@/lib/logger";

export const { GET, POST } = toNextJsHandler(auth);
