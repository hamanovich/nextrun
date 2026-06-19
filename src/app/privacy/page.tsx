import { LegalPage } from "@/components/legal-page/legal-page";

export { metadata } from "./metadata";

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" lastUpdated="June 2026">
      <section>
        <h2 className="mb-4 text-2xl font-semibold">
          1. Information We Collect
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          This policy applies to the hosted NextRun service. We collect
          information you provide directly to us, such as when you sign in,
          purchase credits, or contact us for support.
        </p>
        <h3 className="mt-6 mb-3 text-xl font-semibold">
          Personal Information
        </h3>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>
            Email address and name from your Google account when you sign in
          </li>
          <li>Profile image provided by Google OAuth</li>
          <li>Payment details, processed and stored securely by Stripe</li>
        </ul>
        <h3 className="mt-6 mb-3 text-xl font-semibold">Usage Information</h3>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>Credit balance and transaction history</li>
          <li>Feature usage and preferences</li>
          <li>Device and browser information</li>
        </ul>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">
          2. How We Use Your Information
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          We use the information we collect to:
        </p>
        <ul className="text-muted-foreground mt-4 list-inside list-disc space-y-2">
          <li>Provide, maintain, and improve the service</li>
          <li>Authenticate you and manage your account</li>
          <li>Process payments and track your credit balance</li>
          <li>Send technical notices and support messages</li>
          <li>Respond to your comments and questions</li>
          <li>Monitor usage and protect against abuse</li>
        </ul>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">3. Information Sharing</h2>
        <p className="text-muted-foreground leading-relaxed">
          We do not sell or rent your personal information. We share it only in
          the following circumstances:
        </p>
        <ul className="text-muted-foreground mt-4 list-inside list-disc space-y-2">
          <li>
            With service providers who help us operate the service (for example,
            payment and hosting providers)
          </li>
          <li>When required by law or to protect our rights</li>
          <li>In connection with a business transfer or acquisition</li>
        </ul>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">4. Data Security</h2>
        <p className="text-muted-foreground leading-relaxed">
          We implement appropriate security measures to protect your personal
          information against unauthorized access, alteration, disclosure, or
          destruction. However, no method of transmission over the internet is
          100% secure.
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">5. Data Retention</h2>
        <p className="text-muted-foreground leading-relaxed">
          We retain your personal information for as long as necessary to
          provide the service and fulfill the purposes outlined in this policy.
          You may request deletion of your account and associated data at any
          time.
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">6. Cookies and Tracking</h2>
        <p className="text-muted-foreground leading-relaxed">
          We use cookies and similar technologies for authentication sessions
          and to enhance your experience. You can control cookie settings
          through your browser preferences, though disabling them may affect
          sign-in.
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">7. Third-Party Services</h2>
        <p className="text-muted-foreground leading-relaxed">
          The service integrates with third-party providers, including Stripe
          for payments, Google OAuth for authentication, and Neon for database
          hosting. These providers have their own privacy policies, and we
          encourage you to review them.
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">8. Your Rights</h2>
        <p className="text-muted-foreground leading-relaxed">
          You have the right to:
        </p>
        <ul className="text-muted-foreground mt-4 list-inside list-disc space-y-2">
          <li>Access your personal information</li>
          <li>Correct inaccurate information</li>
          <li>Delete your account and data</li>
          <li>Opt out of marketing communications</li>
          <li>Request data portability</li>
        </ul>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">
          9. Children&apos;s Privacy
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          The service is not intended for children under 13 years of age. We do
          not knowingly collect personal information from children under 13.
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">
          10. Changes to This Policy
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          We may update this privacy policy from time to time. We will notify
          you of any changes by posting the new policy on this page and updating
          the &quot;Last updated&quot; date.
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">11. Contact Us</h2>
        <p className="text-muted-foreground leading-relaxed">
          If you have any questions about this Privacy Policy, contact us at{" "}
          <a href="mailto:support@nextrun.dev" className="underline">
            support@nextrun.dev
          </a>
          .
        </p>
      </section>
    </LegalPage>
  );
}
