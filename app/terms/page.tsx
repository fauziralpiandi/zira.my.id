import Link from 'next/link'

export const metadata = {
  title: 'Terms of Use',
  description:
    'As a visitor, you are expected to read and understand the following terms before using this site',
}

const TermsOfUse = () => {
  return (
    <section>
      <div className="animate-in">
        <h1 className="font-semibold text-2xl tracking-tight">
          Terms of Use
        </h1>
        <p className="text-sm text-neutral-400">
          September 1, 2024 &mdash; 08:22 UTC
        </p>
        <div className="prose">
          <p>
            This website is designed as a platform for sharing personal
            writings, opinions, and creative works. As a visitor, you are
            expected to read and understand the following terms before
            using this site. By continuing to access this site, you signify
            your agreement to and are bound by these terms. If you do not
            agree with these terms, please do not access or use the site.
          </p>
          <hr className="my-8 border-neutral-600" />
          <h3>1. Eligibility</h3>
          <p>
            You must be at least 13 years old to use this site. By using
            this site, you confirm that you meet this requirement and are
            authorized to use the site. I urge users under this age to
            obtain permission from their parents or guardians before using
            this site. Although the content provided does not contain
            harmful or age-inappropriate material, it is important for
            parents or guardians to monitor their children&rsquo;s online
            activities.
          </p>

          <h3>2. Use of the Site</h3>
          <p>
            You agree to use the site only for lawful purposes and in
            accordance with applicable laws. You agree not to:
          </p>
          <ul>
            <li>
              Use this site to transmit any material that is illegal,
              misleading, or harmful.
            </li>
            <li>
              Access unauthorized data or attempt to access the server or
              networks associated with the site.
            </li>
            <li>
              Use robots, spiders, or other automated tools to collect
              information from this site without permission.
            </li>
            <li>
              Interfere with or disrupt the functionality of the site or
              the servers and networks connected to the site.
            </li>
          </ul>

          <h3>4. Intellectual Property Rights</h3>
          <p>
            All content (writings) published on this site is protected by
            copyright law unless otherwise stated. The content is licensed
            under the{' '}
            <a
              href="https://creativecommons.org/licenses/by-nd/4.0/"
              rel="license noopener noreferrer"
              target="_blank"
            >
              Creative Commons Attribution-NoDerivatives 4.0 International
              (CC BY-ND 4.0) License
            </a>
            :
          </p>
          <ul>
            <li>
              You may copy and redistribute the material in any medium or
              format, for commercial or non-commercial purposes. However,
              you are not permitted to alter, modify, or adapt the content.
            </li>
          </ul>
          <p>
            This means that while you have the freedom to use this content
            freely, you must ensure that it remains in its original form
            without any derivative works, changes, or additions, and you
            must provide appropriate attribution to the original and
            rightful owner.
          </p>

          <h3>5. Links to External Sites</h3>
          <p>
            This site may contain links to third-party websites. I have no
            control over the content or privacy policies of these sites.
            Your use of third-party websites is at your own risk, and I am
            not responsible for any losses, damages, or inconsistencies
            that may arise from using such sites. It is important to
            recognize that each third-party site has its own terms and
            conditions and privacy policies. I encourage you to read and
            understand these policies before using any services or
            providing personal information on third-party sites.
          </p>

          <h3>6. Disclaimer</h3>
          <p>
            This site is provided &quot;as is&quot; and &quot;as
            available&quot; without any warranties, express or implied. I
            am not responsible for any losses or damages that may result
            from the use or inability to use this site, including but not
            limited to direct, indirect, incidental, consequential, or
            punitive damages. Your use of this site is at your own risk. I
            do not guarantee that the site will be free from errors,
            viruses, or other issues that may affect your device or safety.
          </p>

          <h3>7. Changes to Terms</h3>
          <p>
            I reserve the right to update these terms of use at any time.
            Changes will take effect immediately upon being revised on the
            effective date. Your continued use of the site following such
            changes constitutes your acceptance of the updated terms.
          </p>
          <hr className="my-8 border-neutral-600" />
          <p>
            If you have any questions or comments regarding these terms of
            use, please reach me through the{' '}
            <Link href="/admin">contact</Link> form provided.
          </p>

          <p>Thank you.</p>
        </div>
      </div>
    </section>
  )
}

export default TermsOfUse
