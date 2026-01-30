import React from 'react';

const TermsOfService: React.FC = () => {
  return (
    <div className="terms-container">
      <h1>Singnify Terms of Service</h1>
      <p>
        By accessing or using the Singnify Service, you acknowledge that you have read, understood, and accepted these Agreements and agree to be bound by them. If you do not agree to the terms, do not use the Singnify Service.
      </p>
      <h2>1. Eligibility</h2>
      <p>
        To use the Singnify Service, you must be at least 16 years old and capable of entering into a binding contract under applicable law. If you are under 16, you must provide proof of your guardian’s consent.
      </p>
      <h2>2. Authentication and Login</h2>
      <p>Singnify provides authentication via third-party OAuth providers, including:</p>
      <ul>
        <li>Google</li>
        <li>Spotify</li>
        <li>Apple</li>
        <li>Facebook</li>
        <li>Twitter (X)</li>
      </ul>
      <p>
        By signing in with an OAuth provider, you authorize Singnify to access and use certain account details as permitted by the provider's terms.
      </p>
      <h2>3. Definitions</h2>
      <ul>
        <li><strong>"Recordings"</strong> - All audio/video recordings submitted to Singnify.</li>
        <li><strong>"Stores"</strong> - Digital music distribution platforms (e.g., Spotify, iTunes, Amazon).</li>
        <li><strong>"Metadata"</strong> - Embedded information in an audio file (e.g., title, artist, label).</li>
        <li><strong>"Territory"</strong> - The world or a specified applicable region.</li>
      </ul>
      <h2>4. Grant of Rights</h2>
      <p>
        By using our Services, you grant Singnify the right to distribute, promote, and sublicense your content on a royalty-license basis.
      </p>
      <h2>5. Your Singnify Account</h2>
      <p>
        You are responsible for maintaining the security of your account credentials and any linked third-party services.
      </p>
      <h2>6. Your Music, Materials, and Information</h2>
      <p>
        Content must meet Store specifications. Singnify reserves the right to reject unsuitable content.
      </p>
      <h2>7. Terms of Upload</h2>
      <ul>
        <li>Audio files: 16-bit, 44.1 kHz MP3 format.</li>
        <li>Cover artwork: 3000x3000 to 5000x5000 pixels, 300 DPI.</li>
        <li>No unauthorized logos or text on cover art.</li>
      </ul>
      <h2>8. Payment and Fees</h2>
      <p>
        Payments are distributed quarterly, and withdrawals require a minimum balance of $100.
      </p>
      <h2>9. Copyright</h2>
      <p>
        Singnify places copyright claims for protection, but artists retain ownership of their content.
      </p>
      <h2>10. Stores and Distribution</h2>
      <p>
        Singnify partners with various Stores for content distribution but is not liable for Store-related issues.
      </p>
      <h2>11. Prohibited Use and Content</h2>
      <p>
        You may not use Singnify for unlawful, fraudulent, hateful, or explicit content. Violating accounts may be removed.
      </p>
      <h2>12. Third-Party Applications</h2>
      <p>
        Singnify integrates with third-party services, but is not responsible for their content or behavior.
      </p>
      <h2>13. Use of the Singnify Service</h2>
      <p>
        Users must comply with all laws and Singnify’s Terms of Service.
      </p>
      <h2>14. Changes to the Agreement</h2>
      <p>
        Singnify may update these Terms at any time. Continued use constitutes acceptance of the revised Terms.
      </p>
      <h2>15. Termination</h2>
      <p>
        Users may terminate their agreement by ceasing to use the service. Singnify may suspend accounts violating these Terms.
      </p>
      <h2>16. Contact Information</h2>
      <p>
        For questions regarding these Terms, contact Singnify Support.
      </p>
    </div>
  );
};

export default TermsOfService;
