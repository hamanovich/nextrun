import { redirect } from "next/navigation";
import { getSessionUser } from "@/actions/user";
import { SignOutButton } from "@/components/login/sign-out-button";
import { UserInformation } from "@/components/user/user-information";
import { UserPaymentInformation } from "@/components/user/user-payment-information";

export { metadata } from "./metadata";

export const dynamic = "force-dynamic";

export default async function UserPage() {
  const sessionUser = await getSessionUser();
  if (!sessionUser) redirect("/");

  return (
    <main className="site-container product-compact profile-page py-8">
      <header className="border-border mb-6 flex flex-wrap items-start justify-between gap-4 border-b pb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl leading-9 font-semibold">Profile</h1>
          <p className="text-muted-foreground">Your account and credits.</p>
        </div>
        <SignOutButton />
      </header>
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <UserInformation user={sessionUser.user} />
        <UserPaymentInformation user={sessionUser.user} />
      </div>
    </main>
  );
}
