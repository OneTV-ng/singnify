"use client";

import { motion } from "framer-motion";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* Header */}
      <section className="border-b border-white/10 bg-slate-950">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold"
          >
            Privacy Policy
          </motion.h1>
          <p className="mt-4 text-slate-400">
            This Privacy Policy explains how Singnify collects, uses, and protects your personal information when you use our services.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-5xl px-6 py-16 space-y-12">
        <PolicySection title="1. The Information We Collect">
          <p>We collect and store personal information when you:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Visit our website</li>
            <li>Register on and use our app</li>
            <li>Upload music through our app</li>
            <li>Make payouts through our app and PayPal</li>
            <li>Contact customer support</li>
            <li>Connect to or through third-party services</li>
          </ul>

          <SubTitle>Registration Data</SubTitle>
          <p>
            When you create an account, we may collect your username, artist name, password, phone number, email address, date of birth, address, postal code, and country.
          </p>
          <p>
            If you sign in using third-party services such as Google or Facebook, we may collect authentication and profile information made available by those services.
          </p>

          <SubTitle>Music Uploads</SubTitle>
          <p>
            When uploading music, we collect information such as track or album titles, artwork, artist names, and contributor details.
          </p>

          <SubTitle>Usage Information</SubTitle>
          <p>
            We collect technical and usage data including IP address, device identifiers, session data, cookies, referral URLs, and interaction data.
          </p>

          <SubTitle>Payment Data</SubTitle>
          <p>
            For payouts via PayPal, we collect only the information required to process payments, comply with legal obligations, and prevent fraud.
          </p>
        </PolicySection>

        <PolicySection title="2. How We Use Your Information">
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide, operate, and improve the Service</li>
            <li>Administer accounts and third-party integrations</li>
            <li>Process payouts and prevent fraud</li>
            <li>Personalize user experience and advertising</li>
            <li>Communicate service-related and promotional messages (with consent)</li>
            <li>Ensure security and enforce our terms</li>
          </ul>
        </PolicySection>

        <PolicySection title="3. Data Retention">
          <p>
            We retain your information only as long as necessary to provide the Service, comply with legal obligations, process payments, and prevent fraud.
          </p>
        </PolicySection>

        <PolicySection title="4. How We Share Information">
          <p>
            We may share necessary data with music platforms, partners, service providers, and advertising partners to operate and promote the Service.
          </p>
          <p>
            This includes metadata such as ISRCs, UPCs, titles, artwork, artist names, and contributor details required for distribution.
          </p>
        </PolicySection>

        <PolicySection title="5. International Data Transfers">
          <p>
            If you reside in the EEA or Switzerland, your data may be transferred outside those regions. We ensure GDPR-compliant safeguards are in place.
          </p>
        </PolicySection>

        <PolicySection title="6. Children">
          <p>
            Singnify does not knowingly collect personal data from children under 16. If such data is discovered, please contact Customer Support.
          </p>
        </PolicySection>

        <PolicySection title="7. Data Security">
          <p>
            We use administrative, technical, and physical safeguards to protect your data. However, no system is completely secure.
          </p>
        </PolicySection>

        <PolicySection title="8. Your Rights & Contact">
          <p>
            You have the right to access, correct, or delete your personal data, and to withdraw consent at any time.
          </p>
          <p className="mt-2">
            Contact Customer Support or email <span className="text-indigo-400">privacy@singnify.com</span> for privacy-related concerns.
          </p>
        </PolicySection>

        <PolicySection title="9. Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. Significant changes will be communicated via the Service or email.
          </p>
        </PolicySection>

        <PolicySection title="10. Cookies">
          <p>
            We use cookies, pixel tags, and mobile SDKs to improve functionality, analytics, and marketing. You can manage cookies through your browser settings.
          </p>
        </PolicySection>
      </section>
    </div>
  );
}

function PolicySection({ title, children }: any) {
  return (
    <div>
      <h2 className="text-2xl font-semibold">{title}</h2>
      <div className="mt-4 space-y-4 text-slate-400">{children}</div>
    </div>
  );
}

function SubTitle({ children }: any) {
  return <h3 className="mt-6 text-lg font-semibold text-slate-300">{children}</h3>;
}
