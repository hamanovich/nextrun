import { LegalPage } from "@/components/legal-page/legal-page";

export { metadata } from "./metadata";

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms and Conditions"
      description="The terms that apply to the NextRun boilerplate, hosted service, accounts, and credits."
      lastUpdated="June 2026"
      sections={[
        { id: "acceptance-of-terms", label: "Acceptance of Terms" },
        { id: "open-source-boilerplate", label: "The Open-Source Boilerplate" },
        {
          id: "accounts-and-authentication",
          label: "Accounts and Authentication",
        },
        { id: "credits-and-billing", label: "Credits and Billing" },
        { id: "acceptable-use", label: "Acceptable Use" },
        { id: "disclaimer-of-warranties", label: "Disclaimer of Warranties" },
        { id: "limitation-of-liability", label: "Limitation of Liability" },
        { id: "changes-to-terms", label: "Changes to Terms" },
        { id: "contact-information", label: "Contact Information" },
      ]}
    >
      <section id="acceptance-of-terms">
        <h2 className="mb-4 text-2xl font-semibold">1. Acceptance of Terms</h2>
        <p className="text-muted-foreground leading-relaxed">
          By accessing or using NextRun (&quot;the Project&quot; and &quot;the
          Service&quot;), you agree to be bound by these terms. If you do not
          agree, do not use the source code or the hosted service.
        </p>
      </section>

      <section id="open-source-boilerplate">
        <h2 className="mb-4 text-2xl font-semibold">
          2. The Open-Source Boilerplate
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          NextRun is an open-source Next.js starter published on{" "}
          <a
            href="https://github.com/hamanovich/nextrun"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            GitHub
          </a>
          . The source code is provided under the license stated in the
          repository. Subject to that license, you may:
        </p>
        <ul className="text-muted-foreground mt-4 list-inside list-disc space-y-2">
          <li>
            Clone and use the boilerplate for personal and commercial projects
          </li>
          <li>Modify and customize the code for your own needs</li>
          <li>Deploy and distribute applications you build with it</li>
        </ul>
        <p className="text-muted-foreground mt-4 leading-relaxed">
          The repository&apos;s license file is the authoritative source of your
          rights and obligations regarding the code. These terms govern the
          hosted demo and any paid features described below.
        </p>
      </section>

      <section id="accounts-and-authentication">
        <h2 className="mb-4 text-2xl font-semibold">
          3. Accounts and Authentication
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          The hosted service uses Google OAuth for sign-in. You are responsible
          for activity that occurs under your account and for keeping your
          credentials secure. You must provide accurate information and may not
          impersonate others or access accounts that are not yours.
        </p>
      </section>

      <section id="credits-and-billing">
        <h2 className="mb-4 text-2xl font-semibold">4. Credits and Billing</h2>
        <p className="text-muted-foreground leading-relaxed">
          The hosted service offers a credit-based system. Credits are purchased
          securely through Stripe and consumed to access certain features.
          Prices are shown at checkout, and you are responsible for any
          applicable taxes. Credits have no cash value, are non-transferable,
          and are non-refundable except where required by law. We may change
          pricing or the features that credits unlock at any time.
        </p>
      </section>

      <section id="acceptable-use">
        <h2 className="mb-4 text-2xl font-semibold">5. Acceptable Use</h2>
        <p className="text-muted-foreground leading-relaxed">
          You agree not to misuse the Service, including attempting to disrupt
          it, circumvent the credit system, access data without authorization,
          or use it for unlawful purposes.
        </p>
      </section>

      <section id="disclaimer-of-warranties">
        <h2 className="mb-4 text-2xl font-semibold">
          6. Disclaimer of Warranties
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          The Project and the Service are provided &quot;as is&quot; and
          &quot;as available&quot; without warranties of any kind, whether
          express or implied, including fitness for a particular purpose. We do
          not warrant that the Service will be uninterrupted, secure, or
          error-free.
        </p>
      </section>

      <section id="limitation-of-liability">
        <h2 className="mb-4 text-2xl font-semibold">
          7. Limitation of Liability
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          To the maximum extent permitted by law, in no event shall NextRun or
          its maintainers be liable for any indirect, incidental, or
          consequential damages (including loss of data or profit, or business
          interruption) arising out of the use of, or inability to use, the
          Project or the Service.
        </p>
      </section>

      <section id="changes-to-terms">
        <h2 className="mb-4 text-2xl font-semibold">8. Changes to Terms</h2>
        <p className="text-muted-foreground leading-relaxed">
          We may revise these terms from time to time. Continued use of the
          Service after changes take effect constitutes acceptance of the
          updated terms.
        </p>
      </section>

      <section id="contact-information">
        <h2 className="mb-4 text-2xl font-semibold">9. Contact Information</h2>
        <p className="text-muted-foreground leading-relaxed">
          If you have any questions about these Terms and Conditions, contact us
          at{" "}
          <a href="mailto:nextrun@hamanovich.com" className="underline">
            nextrun@hamanovich.com
          </a>
          .
        </p>
      </section>
    </LegalPage>
  );
}
