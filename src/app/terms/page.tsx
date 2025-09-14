import React from "react";

export { metadata } from "./metadata";

export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <div className="prose prose-gray max-w-none">
        <h1 className="text-4xl font-bold mb-8">Terms and Conditions</h1>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-600 leading-relaxed">
              By accessing and using NextRun.dev ("the Service"), you accept and
              agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              2. License and Usage
            </h2>
            <p className="text-gray-600 leading-relaxed">
              NextRun provides a Next.js template and related services. When you
              purchase or use our template, you are granted a license to use it
              for your projects. This license includes:
            </p>
            <ul className="list-disc list-inside text-gray-600 mt-4 space-y-2">
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
            <p className="text-gray-600 leading-relaxed mt-4">You may not:</p>
            <ul className="list-disc list-inside text-gray-600 mt-2 space-y-2">
              <li>Resell or redistribute the template itself</li>
              <li>Remove copyright notices or attribution</li>
              <li>Use the template to create competing template products</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              3. Service Description
            </h2>
            <p className="text-gray-600 leading-relaxed">
              NextRun provides a production-ready Next.js template with
              pre-configured authentication (Auth.js), payment processing
              (Stripe), and modern UI components. The template includes
              TypeScript support, responsive design, and best practices for web
              development. The service is provided "as is" and we make no
              warranties regarding its accuracy or reliability.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              4. Payment and Billing
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Payment for our template and services is processed securely
              through Stripe. All fees are non-refundable unless otherwise
              specified. You are responsible for any applicable taxes. We
              reserve the right to change our pricing at any time with notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              5. Support and Updates
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We provide support for our template through our support channels.
              We may release updates, bug fixes, and new features for the
              template. Access to updates may be subject to your license type
              and subscription status.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              6. Limitation of Liability
            </h2>
            <p className="text-gray-600 leading-relaxed">
              In no event shall NextRun or its suppliers be liable for any
              damages (including, without limitation, damages for loss of data
              or profit, or due to business interruption) arising out of the use
              or inability to use our template or services, even if NextRun or a
              NextRun authorized representative has been notified orally or in
              writing of the possibility of such damage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Revisions</h2>
            <p className="text-gray-600 leading-relaxed">
              NextRun may revise these terms of service at any time without
              notice. By using our services you are agreeing to be bound by the
              then current version of these terms of service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              8. Contact Information
            </h2>
            <p className="text-gray-600 leading-relaxed">
              If you have any questions about these Terms and Conditions, please
              contact us at{" "}
              <a href="mailto:support@nextrun.dev" className="underline">
                support@nextrun.dev
              </a>
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">Last updated: January 2025</p>
        </div>
      </div>
    </div>
  );
}
