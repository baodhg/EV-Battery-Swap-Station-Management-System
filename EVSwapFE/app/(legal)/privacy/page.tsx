import { Header } from "@/components/shared/header"
import { Footer } from "@/components/shared/footer"

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto max-w-4xl px-4 py-16 mt-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        <p className="text-gray-600 mb-8">Last updated: October 2025</p>

        <div className="space-y-8 text-gray-700">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
            <p>
              EVSwap ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your information when you visit our website and use
              our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
            <p className="mb-4">
              We may collect information about you in a variety of ways. The information we may collect on the Site
              includes:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>Personal Data:</strong> Name, email address, phone number, billing address, and payment
                information
              </li>
              <li>
                <strong>Vehicle Information:</strong> Vehicle type, battery specifications, and usage patterns
              </li>
              <li>
                <strong>Location Data:</strong> GPS coordinates and station visit history
              </li>
              <li>
                <strong>Usage Data:</strong> Pages visited, time spent, and interaction patterns
              </li>
              <li>
                <strong>Device Information:</strong> Device type, operating system, and browser information
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Use of Your Information</h2>
            <p className="mb-4">
              Having accurate information about you permits us to provide you with a smooth, efficient, and customized
              experience. Specifically, we may use information collected about you via the Site to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Process your transactions and send related information</li>
              <li>Email regarding your account or order</li>
              <li>Fulfill and manage purchases, orders, payments, and other transactions related to the Site</li>
              <li>Generate a personal profile about you so that future visits to the Site will be personalized</li>
              <li>Increase the efficiency and operation of the Site</li>
              <li>Monitor and analyze usage and trends to improve your experience with the Site</li>
              <li>Notify you of updates to the Site</li>
              <li>Offer new products, services, and/or recommendations to you</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Disclosure of Your Information</h2>
            <p className="mb-4">We may share information we have collected about you in certain situations:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>By Law or to Protect Rights:</strong> If we believe the release of information is necessary to
                comply with the law
              </li>
              <li>
                <strong>Third-Party Service Providers:</strong> We may share your information with third parties that
                perform services for us
              </li>
              <li>
                <strong>Business Transfers:</strong> Your information may be transferred as part of a merger,
                acquisition, or sale of assets
              </li>
              <li>
                <strong>Affiliates:</strong> We may share information with our affiliates for marketing purposes
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Security of Your Information</h2>
            <p>
              We use administrative, technical, and physical security measures to protect your personal information.
              However, perfect security does not exist on the Internet. You are responsible for maintaining the
              confidentiality of your account information and password.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Contact Us</h2>
            <p>If you have questions or comments about this Privacy Policy, please contact us at:</p>
            <p className="mt-4">
              <strong>EVSwap Privacy Team</strong>
              <br />
              Email: privacy@evswap.com
              <br />
              Phone: 1-800-EVSWAP
              <br />
              Address: 123 EV Street, Tech City, TC 12345
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  )
}
