"use client";

import { motion } from "framer-motion";

export default function FullTermsPublishingLicensingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* Header */}
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold"
          >
            Terms of Use, Publishing and Licensing Agreement
          </motion.h1>
          <p className="mt-4 text-slate-400">
            This page contains the complete, unabridged and legally binding Terms of Use and Publishing & Licensing Agreement of Singnify.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-6xl px-6 py-16 space-y-10 text-sm leading-relaxed text-slate-300">
        <Clause title="1. Introduction">
          <p>
            Thank you for choosing Singnify ("Singnify", "we", "us", "our"). By signing up to or otherwise using the Singnify platform, app, service, websites, and software applications (together, the “Singnify Service” or “Service”), you are entering into a binding contract with Singnify.
          </p>
          <p>
            Your agreement with us includes these Terms of Use (“Terms of Use”), our Privacy Policy, and relevant supplemental terms (“Supplemental Terms”) (collectively, the “Agreements”). If you do not agree, do not use the Service.
          </p>
          <p>
            You must be at least 16 years old to use the Service. If under 16, you must provide guardian consent. You confirm all submitted information is true and accurate.
          </p>
        </Clause>

        <Clause title="2. Definitions">
          <p><strong>Recordings</strong> means all audio/video recordings uploaded to Singnify.</p>
          <p><strong>Stores</strong> means all digital music retailers now known or later developed.</p>
          <p><strong>Metadata</strong> means embedded information identifying the content.</p>
          <p><strong>Territory</strong> means the world.</p>
        </Clause>

        <Clause title="3. Grant of Rights">
          <p>
            You grant Singnify an exclusive license during the Term and Territory to distribute, sell, stream, sublicense, alter Metadata, and otherwise exploit the Recordings. Ownership remains with you. All rights are granted on a royalty-license basis.
          </p>
        </Clause>

        <Clause title="4. Your Singnify Account">
          <p>
            You are responsible for all activity under your account and for safeguarding your credentials. Singnify is not liable for service interruptions.
          </p>
        </Clause>

        <Clause title="5. Your Music, Materials and Information">
          <p>
            You are fully responsible for all Recordings, artwork, and materials you upload. Singnify may remove unsuitable content at its sole discretion.
          </p>
        </Clause>

        <Clause title="6. Terms of Upload">
          <ul className="list-disc pl-6 space-y-1">
            <li>Audio: 16-bit, 44.1kHz MP3</li>
            <li>Artwork: JPG or TIF, square, 3000x3000–5000x5000px, RGB, 300 DPI</li>
            <li>No logos, social media handles, or unauthorized text</li>
            <li>$100 fee for takedown within 6 months</li>
          </ul>
        </Clause>

        <Clause title="7. Payment and Fees">
          <p>
            Singnify pays 70% of gross receipts for distribution, collections, and synchronization licenses; 40% for special products; and 30% for compilation albums. Accounts are updated quarterly.
          </p>
        </Clause>

        <Clause title="8. Singnify Copyright">
          <p>
            Singnify may place copyright claims on your behalf without transferring ownership.
          </p>
        </Clause>

        <Clause title="9. Stores">
          <p>
            Singnify distributes Recordings worldwide and assumes no liability for Store interruptions.
          </p>
        </Clause>

        <Clause title="10. Prohibited Use">
          <p>
            You may not upload unlawful, infringing, hateful, fraudulent, or harmful content. Singnify may terminate accounts without notice.
          </p>
        </Clause>

        <Clause title="11. Third Party Applications">
          <p>
            Singnify is not responsible for third-party applications or services.
          </p>
        </Clause>

        <Clause title="12. Your Use of the Service">
          <p>
            The Service may be used only for lawful purposes. Unauthorized use may result in termination.
          </p>
        </Clause>

        <Clause title="13. Warranties and Liability">
          <p>
            You warrant ownership of all rights and indemnify Singnify against all claims.
          </p>
        </Clause>

        <Clause title="14. Infringement Reporting">
          <p>
            Copyright owners may report infringements to Customer Support.
          </p>
        </Clause>

        <Clause title="15. Our Rights">
          <p>
            Singnify may amend, suspend, or terminate the Service at any time.
          </p>
        </Clause>

        <Clause title="16. Intellectual Property">
          <p>
            All Singnify trademarks and technology remain the property of Singnify.
          </p>
        </Clause>

        <Clause title="17. Service Modifications">
          <p>
            Singnify may modify or discontinue Services without liability.
          </p>
        </Clause>

        <Clause title="18. Term and Termination">
          <p>
            Either party may terminate. Content removal may take up to 365 days unless expedited for a fee.
          </p>
        </Clause>

        <Clause title="19. Warranty Disclaimer">
          <p>
            The Service is provided “as is” without warranties.
          </p>
        </Clause>

        <Clause title="20. Limitation of Liability">
          <p>
            Singnify’s liability is capped at $1,000 USD where permitted by law.
          </p>
        </Clause>

        <Clause title="21. Entire Agreement">
          <p>
            These Agreements constitute the entire agreement between you and Singnify.
          </p>
        </Clause>

        <Clause title="22. Severability">
          <p>
            Invalid provisions do not affect remaining terms.
          </p>
        </Clause>

        <Clause title="23. Assignment">
          <p>
            Singnify may assign this Agreement. You may not.
          </p>
        </Clause>

        <Clause title="24. Indemnification">
          <p>
            You agree to indemnify Singnify against all claims arising from your use of the Service.
          </p>
        </Clause>

        <Clause title="25. Force Majeure">
          <p>
            Singnify is not liable for events beyond its control.
          </p>
        </Clause>

        <Clause title="26. Jurisdiction">
          <p>
            This Agreement is governed by Polish law. Disputes shall be resolved in Warsaw, Poland.
          </p>
        </Clause>

        <Clause title="27. Changes to the Agreement">
          <p>
            Continued use constitutes acceptance of updates.
          </p>
        </Clause>

        <Clause title="28. Contact Us">
          <p>
            info@singnify.com | contact@singnify.com | dispute@singnify.com
          </p>
        </Clause>
      </section>
    </div>
  );
}

function Clause({ title, children }: any) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-100">{title}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </div>
  );
}
