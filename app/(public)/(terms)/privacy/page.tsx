"use client"
import Head from 'next/head';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function TermsAndPrivacy() {
  const [view, setView] = useState('terms');

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Head>
        <title>Terms & Privacy - Signify Music</title>
        <meta name="description" content="Terms and Privacy Policy for Signify Music Distribution App." />
      </Head>
      
      <h1 className="text-3xl font-bold mb-4 text-center">Signify Music Distribution</h1>
      <div className="flex space-x-4 justify-center mb-6">
        <Button onClick={() => setView('terms')} variant={view === 'terms' ? 'default' : 'outline'}>
          Terms & Conditions
        </Button>
        <Button onClick={() => setView('privacy')} variant={view === 'privacy' ? 'default' : 'outline'}>
          Privacy Policy
        </Button>
      </div>
      <p>
**Singnify Distribution, Publishing, and Licensing Agreement**

### 1. Introduction:
Thank you for choosing Singnify ("Singnify," "we," "us," "our"). By signing up to or otherwise using the Singnify platform, app, service, websites, and software applications (together, the "Singnify Service" or "Service"), you are entering into a binding contract with Singnify.

Your agreement with us includes these Terms of Use ("Terms"), our Privacy Policy, and any relevant supplemental terms ("Supplemental Terms") that apply to your interaction with each specific Service (collectively, the "Agreements"). By accessing or using the Singnify Service, you acknowledge that you have read, understood, and accepted these Agreements and agree to be bound by them. If you do not agree to the terms, do not use the Singnify Service.

To use the Singnify Service, you must be at least 16 years old and capable of entering into a binding contract under applicable law. If you are under 16, you must provide proof of your guardian’s consent. You also promise that the information you submit to us is true, accurate, and complete, and you agree to keep it updated.

If you create an account on behalf of a company, organization, or other entity, you confirm that you are authorized to bind the entity to the Agreements and that "you" refers to both you and the entity.

---

### 2. Definitions:
- **"Recordings"** refers to all audio/video recordings submitted to Singnify.
- **"Stores"** refers to all digital music distribution platforms, such as Spotify, Deezer, iTunes, Amazon, and others with which Singnify has agreements.
- **"Metadata"** refers to the embedded information within an audio file, including track title, artist name, label, and release year.
- **"Territory"** means the world or any specified applicable region.

---

### 3. Grant of Rights:
By using our Services, you grant Singnify the following rights during the Term and throughout the Territory:
- The exclusive right to make your Recordings available on the Internet and Stores for digital downloads, interactive and non-interactive streaming, cloud services, and on-demand streaming.
- The right to sell, promote, and distribute your Recordings and Metadata through Stores and sublicense these rights as needed.
- The non-exclusive right to use your name, photographs, likeness, cover artwork, biographical information, and other submitted materials.
- These rights are granted on a royalty-license basis and do not constitute a transfer of ownership.

---

### 4. Your Singnify Account:
To access certain features, you must create a Singnify Account. You are responsible for maintaining the security of your account credentials and any linked third-party services. We are not liable for any unauthorized access to your account. Please review our Privacy Policy for details on data security and confidentiality.

---

### 5. Your Music, Materials, and Information:
When submitting content, you must ensure it meets the required specifications and formats for Stores. Singnify reserves the right to reject or remove unsuitable content at its discretion.

---

### 6. Terms of Upload:
- Audio files must be 16-bit, 44.1 kHz MP3 format.
- Cover artwork must be TIF or JPG format, square (3000x3000 to 5000x5000 pixels), 300 DPI in RGB format.
- No social media logos, brand logos, or text other than artist and release name.
- Approved songs must remain on Singnify for at least six months unless removed for a $100 fee.

---

### 7. Payment and Fees:
Singnify pays artists or entities as follows:
- **Distribution:** 70% of gross receipts from Store sales.
- **Collections:** 70% of recovered collections.
- **Synchronization Licenses:** 70% of synchronization fees.
- **Special Promotions:** 40% from promotional uses.
- **Compilation Albums:** 30% of compilation album licenses.
- Accounts are updated quarterly on February 24, May 24, August 24, and November 24.
- Withdrawals require a minimum balance of $100 and account verification.

---

### 8. Copyright:
Singnify places copyright claims on behalf of artists for protection, but artists retain 100% ownership of their content.

---

### 9. Stores and Distribution:
Singnify partners with various Stores to distribute, license, and publish content worldwide. Singnify is not liable for any interruptions, delays, or issues with Store access.

---

### 10. Prohibited Use and Content:
You may not use Singnify Services for:
- Unlawful or fraudulent activities.
- Hateful, racist, or inflammatory content.
- Explicit, violent, or discriminatory material.
- Harassment, impersonation, or privacy violations.
- Any activity that violates applicable laws.

Singnify reserves the right to remove violating accounts or content at its sole discretion.

---

### 11. Third-Party Applications:
Singnify may integrate with third-party services that have their own terms and policies. Singnify is not responsible for third-party content, behavior, or transactions.

---

### 12. Use of the Singnify Service:
- You agree to use the Service in compliance with all laws and the Agreements.
- Singnify reserves the right to terminate or suspend access for violations.

---

### 13. Changes to the Agreement:
Singnify may update these Terms at any time. Continued use of the Service constitutes acceptance of the revised Terms.

---

### 14. Termination:
You may terminate your agreement with Singnify at any time by ceasing to use the Service. Singnify may suspend or terminate accounts violating these Terms.

---

### 15. Contact Information:
For questions or concerns regarding these Terms, please contact Singnify Support.

---

By using the Singnify Service, you acknowledge that you have read, understood, and agreed to these Terms.



      </p>
      
      {view === 'terms' ? (
        <Card>
          <CardContent>
            <h2 className="text-2xl font-semibold mb-4">Terms & Conditions</h2>
            <p className="mb-2">Welcome to Signify Music Distribution. By using our services, you agree to comply with these terms.</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Users must own the rights to distribute their content.</li>
              <li>Unauthorized uploads or copyright infringement will result in immediate account termination.</li>
              <li>Payouts and revenue sharing will be handled according to our set guidelines.</li>
              <li>Signify Music reserves the right to update terms at any time.</li>
            </ul>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent>
            <h2 className="text-2xl font-semibold mb-4">Privacy Policy</h2>
            <p className="mb-2">Your privacy is important to us. This policy explains how we handle your data.</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>We collect user information solely for account management and music distribution.</li>
              <li>No personal data is shared with third parties without consent.</li>
              <li>We comply with Google Play and App Store data protection policies.</li>
              <li>Users can request data deletion at any time.</li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}