import { env } from "@/lib/env";

const ONE_YEAR_MS = 1000 * 60 * 60 * 24 * 365;

export const dynamic = "force-static";

export const GET = () => {
  const expires = new Date(Date.now() + ONE_YEAR_MS).toISOString();

  const body = [
    "Contact: mailto:nextrun@hamanovich.com",
    `Expires: ${expires}`,
    "Preferred-Languages: en",
    `Canonical: ${env.NEXT_PUBLIC_DOMAIN}/.well-known/security.txt`,
  ].join("\n");

  return new Response(`${body}\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
