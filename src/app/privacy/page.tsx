import React from "react";

export { metadata } from "./metadata";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <div className="prose prose-gray max-w-none">
        <h1 className="mb-8 text-4xl font-bold">Privacy Policy</h1>

        <div className="space-y-8">
          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              1. Information We Collect
            </h2>
            <p className="leading-relaxed text-gray-600">
              We collect information you provide directly to us, such as when
              you create an account, use our services, or contact us for
              support.
            </p>
            <h3 className="mt-6 mb-3 text-xl font-semibold">
              Personal Information
            </h3>
            <ul className="list-inside list-disc space-y-2 text-gray-600">
              <li>Email address (when you sign up for an account)</li>
              <li>Name (if provided)</li>
              <li>Payment information (processed securely through Stripe)</li>
            </ul>
            <h3 className="mt-6 mb-3 text-xl font-semibold">
              Usage Information
            </h3>
            <ul className="list-inside list-disc space-y-2 text-gray-600">
              <li>Template usage and customization data</li>
              <li>Usage patterns and preferences</li>
              <li>Device and browser information</li>
              <li>Application deployment information</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              2. How We Use Your Information
            </h2>
            <p className="leading-relaxed text-gray-600">
              We use the information we collect to:
            </p>
            <ul className="mt-4 list-inside list-disc space-y-2 text-gray-600">
              <li>Provide, maintain, and improve our template and services</li>
              <li>Process payments and manage your account</li>
              <li>Send you technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Monitor and analyze usage patterns</li>
              <li>Provide template updates and new features</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              3. Information Sharing
            </h2>
            <p className="leading-relaxed text-gray-600">
              We do not sell, trade, or otherwise transfer your personal
              information to third parties without your consent, except in the
              following circumstances:
            </p>
            <ul className="mt-4 list-inside list-disc space-y-2 text-gray-600">
              <li>
                With service providers who assist us in operating our website
                and conducting our business
              </li>
              <li>When required by law or to protect our rights</li>
              <li>In connection with a business transfer or acquisition</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">4. Data Security</h2>
            <p className="leading-relaxed text-gray-600">
              We implement appropriate security measures to protect your
              personal information against unauthorized access, alteration,
              disclosure, or destruction. However, no method of transmission
              over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">5. Data Retention</h2>
            <p className="leading-relaxed text-gray-600">
              We retain your personal information for as long as necessary to
              provide our services and fulfill the purposes outlined in this
              privacy policy. You may request deletion of your account and
              associated data at any time.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              6. Cookies and Tracking
            </h2>
            <p className="leading-relaxed text-gray-600">
              We use cookies and similar tracking technologies to enhance your
              experience on our website. You can control cookie settings through
              your browser preferences.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              7. Third-Party Services
            </h2>
            <p className="leading-relaxed text-gray-600">
              Our template integrates with third-party services including Stripe
              for payments, Better Auth for authentication, and Google OAuth.
              These services have their own privacy policies, and we encourage
              you to review them.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">8. Your Rights</h2>
            <p className="leading-relaxed text-gray-600">
              You have the right to:
            </p>
            <ul className="mt-4 list-inside list-disc space-y-2 text-gray-600">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Delete your account and data</li>
              <li>Opt out of marketing communications</li>
              <li>Data portability</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              9. Children&apos;s Privacy
            </h2>
            <p className="leading-relaxed text-gray-600">
              Our service is not intended for children under 13 years of age. We
              do not knowingly collect personal information from children under
              13.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              10. Changes to This Policy
            </h2>
            <p className="leading-relaxed text-gray-600">
              We may update this privacy policy from time to time. We will
              notify you of any changes by posting the new policy on this page
              and updating the &quot;Last updated&quot; date.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">11. Contact Us</h2>
            <p className="leading-relaxed text-gray-600">
              If you have any questions about this Privacy Policy, please
              contact us at{" "}
              <a href="mailto:support@nextrun.dev" className="underline">
                support@nextrun.dev
              </a>
            </p>
          </section>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-sm text-gray-500">Last updated: January 2025</p>
        </div>
      </div>
    </div>
  );
}
