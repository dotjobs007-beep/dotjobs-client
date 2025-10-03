"use client";

export default function TermsOfUse() {
  return (
    <div className="min-h-screen py-16 px-6 lg:px-24">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 lg:p-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
            Terms of Use
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Last updated: 1st October, 2025
          </p>
        </div>

        {/* Intro */}
        <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
          Welcome to DotJobs (“we,” “our,” or “us”). By accessing or using our
          website, you agree to be bound by these Terms of Use. Please read them
          carefully.
        </p>

        {/* Sections */}
        <div className="space-y-10">
          {/* Section 1 */}
          <section>
            <h2 className="text-xl font-semibold text-purple-600 dark:text-purple-400 mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              By accessing or using DotJobs, you agree to comply with these
              Terms. If you do not agree, you must not use our platform.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-xl font-semibold text-purple-600 dark:text-purple-400 mb-4">
              2. Eligibility
            </h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
              <li>
                You must be at least 18 years old or have legal capacity under
                your jurisdiction to use this platform.
              </li>
              <li>
                By using DotJobs, you represent that you meet these
                requirements.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-xl font-semibold text-purple-600 dark:text-purple-400 mb-4">
              3. Use of the Platform
            </h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
              <li>
                DotJobs is an open-source job and talent platform built for the
                Polkadot and Kusama ecosystem.
              </li>
              <li>
                You agree to use the platform only for lawful purposes and in
                compliance with these Terms.
              </li>
              <li>Prohibited uses include:</li>
              <ul className="list-circle pl-8 space-y-1">
                <li>Posting false or misleading job listings or profiles.</li>
                <li>Misrepresenting your identity.</li>
                <li>
                  Using the platform for spam, scams, or harmful activities.
                </li>
              </ul>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-xl font-semibold text-purple-600 dark:text-purple-400 mb-4">
              4. On-Chain Identity and Wallets
            </h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
              <li>
                Employers may be required to complete On-chain Identity
                verification before posting jobs.
              </li>
              <li>
                Users are encouraged to connect their wallets for trust and
                transparency.
              </li>
              <li>
                You are solely responsible for securing your wallet and private
                keys.
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-xl font-semibold text-purple-600 dark:text-purple-400 mb-4">
              5. User Content
            </h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
              <li>
                You retain ownership of the content you post (job listings,
                profiles, etc.).
              </li>
              <li>
                By posting, you grant DotJobs a non-exclusive license to display
                and share your content on the platform.
              </li>
              <li>
                You are responsible for ensuring your content does not infringe
                the rights of others.
              </li>
            </ul>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-xl font-semibold text-purple-600 dark:text-purple-400 mb-4">
              6. No Guarantee of Employment
            </h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
              <li>
                DotJobs provides a platform to connect talent with opportunities
                but does not guarantee employment, hiring, or outcomes from job
                applications.
              </li>
              <li>
                We are not responsible for any agreements, payments, or disputes
                between employers and job seekers.
              </li>
            </ul>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-xl font-semibold text-purple-600 dark:text-purple-400 mb-4">
              7. Open Source & Third-Party Links
            </h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
              <li>
                DotJobs is open-source and may include third-party tools,
                integrations, or links.
              </li>
              <li>
                We are not responsible for the content or actions of third
                parties.
              </li>
            </ul>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-xl font-semibold text-purple-600 dark:text-purple-400 mb-4">
              8. Disclaimer of Warranties
            </h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
              <li>The platform is provided “as is” without warranties of any kind.</li>
              <li>We do not guarantee uninterrupted or error-free service.</li>
            </ul>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-xl font-semibold text-purple-600 dark:text-purple-400 mb-4">
              9. Limitation of Liability
            </h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
              <li>
                To the maximum extent permitted by law, DotJobs will not be
                liable for damages arising from your use of the platform.
              </li>
              <li>
                This includes but is not limited to loss of data, employment
                opportunities, or financial losses.
              </li>
            </ul>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-xl font-semibold text-purple-600 dark:text-purple-400 mb-4">
              10. Termination
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              We may suspend or terminate access to DotJobs if you violate these
              Terms.
            </p>
          </section>

          {/* Section 11 */}
          <section>
            <h2 className="text-xl font-semibold text-purple-600 dark:text-purple-400 mb-4">
              11. Changes to the Terms
            </h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
              <li>We may update these Terms from time to time.</li>
              <li>
                Continued use of the platform after changes means you accept the
                updated Terms.
              </li>
            </ul>
          </section>

          {/* Section 12 */}
          <section>
            <h2 className="text-xl font-semibold text-purple-600 dark:text-purple-400 mb-4">
              12. Contact
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              For questions, contact us at:
            </p>
            <ul className="list-none text-gray-700 dark:text-gray-300 mt-2">
              <li>
                <strong>Email:</strong> [Insert Contact Email]
              </li>
              <li>
                <strong>Website:</strong> [Insert Website URL]
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
