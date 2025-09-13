import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LoginBtn } from "@/components/login/login-btn";

interface PricingCtaProps {
  isLoggedIn?: boolean;
}

export const PricingCta = ({ isLoggedIn }: PricingCtaProps) => (
  <section className="pb-12">
    <div className="container mx-auto px-4">
      <Card className="bg-primary text-primary-foreground">
        <CardContent className="p-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join hundreds of language learners who are already accelerating
            their progress with NextLang. Start your free trial today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isLoggedIn ? (
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="text-primary"
              >
                <Link href="/">
                  Get Started Now
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            ) : (
              <LoginBtn variant="secondary" />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  </section>
);
