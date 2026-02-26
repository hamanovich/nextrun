import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/actions/user";
import { auth } from "@/lib/auth";
import { CallToAction } from "@/components/call-to-action/call-to-action";
import { SignOutButton } from "@/components/login/sign-out-button";
import { UserInformation } from "@/components/user/user-information";
import { UserPaymentInformation } from "@/components/user/user-payment-information";

export { metadata } from "./metadata";

export default async function UserPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) redirect("/");

  const sessionUser = await getSessionUser();
  const user = sessionUser?.user || session.user;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">User Profile</h1>
        <SignOutButton />
      </div>

      <div className="grid gap-6">
        <UserInformation user={user} />

        {sessionUser && <UserPaymentInformation user={sessionUser.user} />}

        <CallToAction />
      </div>
    </div>
  );
}
