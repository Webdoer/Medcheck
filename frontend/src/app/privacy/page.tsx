import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — MedCheck",
  description: "How MedCheck handles your data and photos",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-dvh flex flex-col items-center px-4 py-10 safe-pb">
      <div className="w-full max-w-lg flex flex-col gap-6 fade-up">
        <h1 className="text-2xl font-bold gradient-text">Privacy Policy</h1>

        <div className="glass p-6 flex flex-col gap-4 text-slate-300 text-sm leading-relaxed">
          <section>
            <h2 className="font-bold text-white text-base mb-2">📸 Photos & Images</h2>
            <p>
              Photos you take or upload are <strong>processed entirely in memory</strong> on our
              server and are <strong>discarded immediately</strong> after label fields are extracted.
              We do not store, log, or share your photos unless you explicitly tap
              &ldquo;Save Photo&rdquo;.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-white text-base mb-2">🔍 Search Queries</h2>
            <p>
              Drug name and batch number searches are sent to our backend for database lookup.
              We do not link searches to your identity or device ID. No personal information
              is required to use MedCheck.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-white text-base mb-2">📊 Data Sources</h2>
            <p>
              Our database is sourced from publicly available CDSCO (Central Drugs Standard
              Control Organisation) NSQ/spurious drug alerts. We do not hold any proprietary
              pharmaceutical data.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-white text-base mb-2">🔒 Storage</h2>
            <p>
              MedCheck does not require an account. No cookies are set. No analytics trackers
              are loaded. Your cabinet (saved medicines) is stored locally on your device only.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-white text-base mb-2">📋 Disclaimer</h2>
            <p>
              MedCheck is an informational tool only. A &ldquo;not found&rdquo; result does not
              guarantee a medicine is free from quality issues. Always buy medicines from
              licensed pharmacies and consult a pharmacist or doctor if in doubt.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-white text-base mb-2">📬 Contact</h2>
            <p>
              For data queries, contact the CDSCO helpline: <strong>1800-11-4477</strong> (toll-free)
              or visit{" "}
              <a
                href="https://cdsco.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300"
              >
                cdsco.gov.in
              </a>
              .
            </p>
          </section>
        </div>

        <a href="/" className="btn-primary btn-outline text-center">
          ← Back to Home
        </a>
      </div>
    </main>
  );
}
