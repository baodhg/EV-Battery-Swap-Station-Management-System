import { Header } from "@/components/shared/header"
import { Footer } from "@/components/shared/footer"

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto max-w-4xl px-4 py-16 mt-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        <p className="text-gray-600 mb-8">Last updated: October 2025</p>

        <div className="space-y-8 text-gray-700">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Agreement to Terms</h2>
            <p>
              By accessing and using the EVSwap website and services, you accept and agree to be bound by and comply
              with these Terms and Conditions. If you do not agree to abide by the above, please do not use this
              service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Use License</h2>
            <p className="mb-4">
              Permission is granted to temporarily download one copy of the materials (information or software) on
              EVSwap's website for personal, non-commercial transitory viewing only. This is the grant of a license, not
              a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to decompile or reverse engineer any software contained on the website</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Disclaimer</h2>
            <p>
              The materials on EVSwap's website are provided on an 'as is' basis. EVSwap makes no warranties, expressed
              or implied, and hereby disclaims and negates all other warranties including, without limitation, implied
              warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of
              intellectual property or other violation of rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Limitations</h2>
            <p>
              In no event shall EVSwap or its suppliers be liable for any damages (including, without limitation,
              damages for loss of data or profit, or due to business interruption) arising out of the use or inability
              to use the materials on EVSwap's website, even if EVSwap or an authorized representative has been notified
              orally or in writing of the possibility of such damage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Accuracy of Materials</h2>
            <p>
              The materials appearing on EVSwap's website could include technical, typographical, or photographic
              errors. EVSwap does not warrant that any of the materials on its website are accurate, complete, or
              current. EVSwap may make changes to the materials contained on its website at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Links</h2>
            <p>
              EVSwap has not reviewed all of the sites linked to its website and is not responsible for the contents of
              any such linked site. The inclusion of any link does not imply endorsement by EVSwap of the site. Use of
              any such linked website is at the user's own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Modifications</h2>
            <p>
              EVSwap may revise these terms of service for its website at any time without notice. By using this
              website, you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction
              in which EVSwap operates, and you irrevocably submit to the exclusive jurisdiction of the courts in that
              location.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Contact Information</h2>
            <p>If you have any questions about these Terms of Service, please contact us at:</p>
            <p className="mt-4">
              <strong>EVSwap Legal Team</strong>
              <br />
              Email: legal@evswap.com
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
