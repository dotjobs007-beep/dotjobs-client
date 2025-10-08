"use client";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen py-16 px-6 lg:px-24">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 lg:p-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
            DotJobs Privacy Policy
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Last updated: 1st October, 2025
          </p>
        </div>

        {/* Intro */}
        <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
          DotJobs (“we,” “our,” or “us”) is committed to protecting the privacy
          and data of our users. This Privacy Policy explains how we collect,
          use, store, and protect your information when you access and use the
          DotJobs platform (the “Platform”), including our website, services,
          and related tools.
        </p>

        <p className="text-gray-700 dark:text-gray-300 mb-10 leading-relaxed">
          By using DotJobs, you agree to the practices described in this Privacy
          Policy.
        </p>

        {/* Sections */}
        <div className="space-y-10">
          {/* Section 1 */}
          <section>
            <h2 className="text-xl font-semibold text-purple-600 dark:text-purple-400 mb-4">
              1. Information We Collect
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              We collect two types of information:
            </p>
            <div className="pl-4 space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  a. Information You Provide to Us
                </h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li>
                    <strong>Account Information:</strong> When you sign up, you
                    may provide an email address, username, and/or other
                    details.
                  </li>
                  <li>
                    <strong>Profile Information:</strong> Job seekers and
                    employers may add details such as skills, work experience,
                    social media profile, location, gender, Race/Ethnicity
                    (Optional), Primary Language, team information, or company
                    description.
                  </li>
                  <li>
                    <strong>Job Postings & Applications:</strong> Content you
                    share (job listings, resumes, applications, portfolios).
                  </li>
                  <li>
                    <strong>On-Chain Identity:</strong> Wallet addresses and
                    optional on-chain identity verification (Polkadot/Kusama
                    Identity) through Polkassembly or Polka Identity.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  b. Information We Collect Automatically
                </h3>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
                  <li>
                    <strong>Wallet Connection Data:</strong> Public blockchain
                    addresses when connecting a wallet.
                  </li>
                  <li>
                    <strong>Usage Data:</strong> Interactions with the Platform
                    (pages viewed, searches, clicks).
                  </li>
                  <li>
                    <strong>Cookies & Analytics:</strong> We may use cookies or
                    analytics tools to improve performance and user experience.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-xl font-semibold text-purple-600 dark:text-purple-400 mb-4">
              2. How We Use Your Information
            </h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
              <li>Provide and operate the Platform.</li>
              <li>Allow job seekers and employers to connect.</li>
              <li>Verify on-chain identities for authenticity.</li>
              <li>
                Improve security, prevent abuse, and ensure compliance with
                ecosystem standards.
              </li>
              <li>
                Personalize the user experience and recommend opportunities.
              </li>
              <li>
                Communicate with you about updates, new features, or ecosystem
                news.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-xl font-semibold text-purple-600 dark:text-purple-400 mb-4">
              3. Blockchain & Public Information
            </h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
              <li>
                Wallet addresses and on-chain identity data are public by design
                on the blockchain.
              </li>
              <li>
                Any information linked to your on-chain identity may be visible
                to others depending on what you choose to verify and share.
              </li>
              <li>
                DotJobs does not control the blockchain and cannot delete or
                alter on-chain data.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-xl font-semibold text-purple-600 dark:text-purple-400 mb-4">
              4. Data Sharing
            </h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
              <li>
                <strong>With Employers/Job Seekers:</strong> To enable job
                applications and recruitment.
              </li>
              <li>
                <strong>With Service Providers:</strong> For hosting, analytics,
                or security support.
              </li>
              <li>
                <strong>For Legal Reasons:</strong> If required to comply with
                applicable law or to protect our rights.
              </li>
              <li>
                <strong>Within the Polkadot Ecosystem:</strong> To improve
                collaboration and visibility of opportunities.
              </li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mt-2">
              We do not sell your personal data to third parties.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-xl font-semibold text-purple-600 dark:text-purple-400 mb-4">
              5. Your Choices & Rights
            </h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-1">
              <li>Access, update, or delete your account information.</li>
              <li>Connect or disconnect your wallet at any time.</li>
              <li>Decide whether or not to complete on-chain verification.</li>
              <li>Opt out of non-essential cookies.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-xl font-semibold text-purple-600 dark:text-purple-400 mb-4">
              6. Data Security
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              We take reasonable steps to protect your information, including
              encryption, access controls, and secure storage. However, no
              system is 100% secure, and we encourage you to take precautions,
              especially when dealing with blockchain wallets and public data.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-xl font-semibold text-purple-600 dark:text-purple-400 mb-4">
              7. Open Source & Transparency
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              DotJobs is open source. This means parts of our codebase are
              publicly available for review. While this promotes transparency,
              it also means that some platform interactions may be visible to
              contributors and the public.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-xl font-semibold text-purple-600 dark:text-purple-400 mb-4">
              8. Children’s Privacy
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              DotJobs is not intended for individuals under
              18 years of age or for those who do not have legal capacity under
              their jurisdiction. You must be at least 18 years old or have the
              legal capacity to use this platform. We do not knowingly collect
              personal data from minors. If we become aware that we have
              collected personal data from a minor without verification of
              parental consent, we will take steps to delete that information.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-xl font-semibold text-purple-600 dark:text-purple-400 mb-4">
              9. Changes to This Policy
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              We may update this Privacy Policy from time to time. If we make
              material changes, we will notify you through the Platform or by
              other means before the changes take effect.
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-xl font-semibold text-purple-600 dark:text-purple-400 mb-4">
              10. Contact Us
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              If you have any questions about this Privacy Policy or how we
              handle your data, please contact us at:
            </p>
            <ul className="list-none pl-0 text-gray-700 dark:text-gray-300 mt-2">
              <li>
                <strong>Email:</strong> [Insert Contact Email]
              </li>
              <li>
                <strong>GitHub/Docs:</strong>{" "}
                <a href="https://github.com/dotjobs007-beep">Github</a>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
