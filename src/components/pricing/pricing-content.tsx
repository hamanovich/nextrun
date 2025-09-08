import { createPaymentAction, listPricingProducts } from "@/actions/stripe";
import { getSessionUser } from "@/actions/user";
import { Check, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LoginBtn } from "@/components/login/login-btn";

export const PricingContent = async () => {
  const sessionUser = await getSessionUser();
  const products = await listPricingProducts();

  const primaryProduct = products[0];

  const features = primaryProduct?.product?.marketing_features?.map(
    (feature: { name: string }) => [feature.name],
  ) || [
    ["Unlimited", "Integrations", "24/7 support"],
    ["Live collaborations", "Unlimited storage", "30-day money back"],
    ["Unlimited members", "Customization", "Unlimited users"],
  ];

  return (
    <section className="py-32">
      <div className="container mx-auto">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center">
          <h2 className="text-4xl font-semibold text-pretty lg:text-6xl">
            Pricing
          </h2>
          <p className="max-w-md text-muted-foreground lg:text-xl">
            Get credits to use our language learning features
          </p>

          {sessionUser && (
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg">
              <CreditCard className="w-4 h-4" />
              <span className="font-medium">
                Current Credits: {sessionUser.user.stripeCredits}
              </span>
            </div>
          )}

          <div className="mx-auto flex w-full flex-col rounded-lg border p-6 sm:w-fit sm:min-w-80">
            <div className="flex justify-center">
              <span className="text-lg font-semibold">$</span>
              <span className="text-6xl font-semibold">
                {primaryProduct
                  ? (primaryProduct.amount! / 100).toFixed(0)
                  : "29"}
              </span>
              <span className="self-end text-muted-foreground">
                {primaryProduct?.interval
                  ? `/${primaryProduct.interval}`
                  : "/mo"}
              </span>
            </div>
            <div className="my-6">
              {features.map((featureGroup, idx) => (
                <div key={idx}>
                  <ul className="flex flex-col gap-3">
                    {featureGroup.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center justify-between gap-2 text-sm font-medium"
                      >
                        {feature} <Check className="inline size-4 shrink-0" />
                      </li>
                    ))}
                  </ul>
                  {idx < features.length - 1 && <Separator className="my-6" />}
                </div>
              ))}
            </div>

            {sessionUser && primaryProduct ? (
              <form action={createPaymentAction}>
                <input type="hidden" name="priceId" value={primaryProduct.id} />
                <Button className="w-full">Purchase Credits</Button>
              </form>
            ) : (
              <LoginBtn />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
