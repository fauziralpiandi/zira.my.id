import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy',
  description:
    'This privacy policy outlines the types of information I collect from you, how that information is used, and the measures I take to safeguard and protect that information.',
}

const PrivacyPolicy = () => {
  return (
    <section>
      <div className="animate-in">
        <h1 className="font-semibold text-2xl tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-sm text-neutral-400">
          September 1, 2024 &mdash; 08:22 UTC
        </p>
        <div className="prose">
          <p>
            As the owner and operator of this website, I am committed to
            protecting and respecting your privacy as a user. This privacy
            policy outlines the types of information I collect from you,
            how that information is used, and the measures I take to
            safeguard and protect that information.
          </p>

          <hr className="my-8 border-neutral-600" />
          <h3>1. Information Collected</h3>
          <p>
            This website collects various types of information to provide
            and enhance the services and experience offered:
          </p>
          <ul>
            <li>
              <strong>Personal Information:</strong> When you register,
              comment, or interact with the site, I may collect information
              such as your name, email address, phone number, and other
              relevant details.
            </li>
            <li>
              <strong>Automatically Collected Information:</strong> This
              website automatically collects certain information when you
              visit, including:
              <ul>
                <li>Your IP address and geographic location</li>
                <li>The type of device and operating system used</li>
                <li>The browser type used</li>
                <li>Pages accessed on the site</li>
                <li>The time and date of access, and</li>
                <li>The duration of your visit</li>
              </ul>
            </li>
            <li>
              <strong>Cookies and Tracking Technologies:</strong> This
              website uses cookies and other tracking technologies to
              collect information about your activities on the site.
              Cookies are small files stored on your device that help me
              remember your preferences and settings. You can set your
              browser to refuse all cookies or to notify you when a cookie
              is being sent.
            </li>
          </ul>

          <h3>2. Use of Information</h3>
          <p>
            The information collected is used for various purposes,
            including but not limited to:
          </p>
          <ul>
            <li>Providing and maintaining the site experience.</li>
            <li>Managing your account and providing support.</li>
            <li>
              Sending you relevant information, including updates, news,
              and promotional content that may be of interest to you.
            </li>
            <li>Analyzing site usage to improve user experience.</li>
            <li>Detecting and preventing fraud and security issues.</li>
          </ul>

          <h3>3. Information Sharing</h3>
          <p>
            I will not sell, rent, or disclose your personal information to
            third parties without your consent, except in the following
            situations:
          </p>
          <ul>
            <li>
              <strong>Legal Compliance:</strong> I may disclose your
              information if required by law or to comply with governmental
              requests.
            </li>
            <li>
              <strong>Protection of Rights:</strong> I may disclose
              information to protect my rights, property, or safety, as
              well as those of users or others.
            </li>
            <li>
              <strong>Business Transactions:</strong> If I am involved in a
              merger, acquisition, or sale of assets, your information may
              be transferred as part of that transaction.
            </li>
          </ul>

          <h3>4. Information Security</h3>
          <p>
            I strive to protect your personal information with reasonable
            security measures. However, no method of data transmission over
            the internet or electronic storage is completely secure. I
            cannot guarantee absolute security.
          </p>

          <h3>5. Your Rights</h3>
          <p>As a user, you have the following rights:</p>
          <ul>
            <li>
              <strong>Access to Information:</strong> You have the right to
              request a copy of the personal information I hold about you.
            </li>
            <li>
              <strong>Correction of Information:</strong> You have the
              right to correct any inaccurate or incomplete information.
            </li>
            <li>
              <strong>Deletion of Information:</strong> You may request the
              deletion of your personal information, subject to applicable
              legal requirements.
            </li>
            <li>
              <strong>Withdrawal of Consent:</strong> If I collect and
              process your information based on your consent, you have the
              right to withdraw that consent at any time.
            </li>
          </ul>

          <h3>6. Changes to the Privacy Policy</h3>
          <p>
            This privacy policy may be updated and changed over time. If
            there are significant changes, I will notify you via email or
            through a notice on the site. I encourage you to review this
            policy periodically to stay informed about how your information
            is protected.
          </p>

          <hr className="my-8 border-neutral-600" />

          <p>
            If you have any questions or comments about this privacy
            policy, please reach me through the available{' '}
            <Link href="/admin">contact</Link> form.
          </p>
          <p>Thank you.</p>
        </div>
      </div>
    </section>
  )
}

export default PrivacyPolicy
