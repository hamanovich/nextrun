import React from "react";

export { metadata } from "./metadata";

export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <div className="prose prose-gray max-w-none">
        <h1 className="mb-8 text-4xl font-bold">Terms and Conditions</h1>

        <div className="space-y-8">
          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              1. Acceptance of Terms
            </h2>
            <p className="leading-relaxed text-gray-600">
              By accessing and using NextRun.dev (&quot;the Service&quot;), you
              accept and agree to be bound by the terms and provision of this
              agreement.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              2. License and Usage
            </h2>
            <p className="leading-relaxed text-gray-600">
              NextRun provides a Next.js template and related services. When you
              purchase or use our template, you are granted a license to use it
              for your projects. This license includes:
            </p>
            <ul className="mt-4 list-inside list-disc space-y-2 text-gray-600">
              <li>Use the template for commercial and personal projects</li>
              <li>
                Modify and customize the template code for your specific needs
              </li>
              <li>Deploy applications built with our template</li>
              <li>
                Distribute applications built with our template (but not the
                template itself)
              </li>
            </ul>
            <p className="mt-4 leading-relaxed text-gray-600">You may not:</p>
            <ul className="mt-2 list-inside list-disc space-y-2 text-gray-600">
              <li>Resell or redistribute the template itself</li>
              <li>Remove copyright notices or attribution</li>
              <li>Use the template to create competing template products</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              3. Service Description
            </h2>
            <p className="leading-relaxed text-gray-600">
              NextRun provides a production-ready Next.js template with
              pre-configured authentication (Better Auth), payment processing
              (Stripe), and modern UI components. The template includes
              TypeScript support, responsive design, and best practices for web
              development. The service is provided &quot;as is&quot; and we make
              no warranties regarding its accuracy or reliability.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              4. Payment and Billing
            </h2>
            <p className="leading-relaxed text-gray-600">
              Payment for our template and services is processed securely
              through Stripe. All fees are non-refundable unless otherwise
              specified. You are responsible for any applicable taxes. We
              reserve the right to change our pricing at any time with notice.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              5. Support and Updates
            </h2>
            <p className="leading-relaxed text-gray-600">
              We provide support for our template through our support channels.
              We may release updates, bug fixes, and new features for the
              template. Access to updates may be subject to your license type
              and subscription status.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              6. Limitation of Liability
            </h2>
            <p className="leading-relaxed text-gray-600">
              In no event shall NextRun or its suppliers be liable for any
              damages (including, without limitation, damages for loss of data
              or profit, or due to business interruption) arising out of the use
              or inability to use our template or services, even if NextRun or a
              NextRun authorized representative has been notified orally or in
              writing of the possibility of such damage.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">7. Revisions</h2>
            <p className="leading-relaxed text-gray-600">
              NextRun may revise these terms of service at any time without
              notice. By using our services you are agreeing to be bound by the
              then current version of these terms of service.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">
              8. Contact Information
            </h2>
            <p className="leading-relaxed text-gray-600">
              If you have any questions about these Terms and Conditions, please
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
