/**
 * Single source of truth for who processes personal data for DriveSchoolPro.
 * Rendered by /subprocessors/ and the privacy policy (§5). Terms Schedule para 6
 * promises 30 days' email notice before a new `app` sub-processor is added —
 * so adding one here means emailing account owners first.
 *
 * `where` states only what we have verified. Checked 11 Nov 2026 against the
 * app repo (vercel.json regions lhr1; Neon aws-eu-west-2). Add Twilio/Meta when
 * WhatsApp or SMS is switched on (feature flag `whatsapp`, off today).
 */
export interface Subprocessor {
  name: string;
  purpose: string;
  where: string;
  /** app = processes pupil/school data in the DriveSchoolPro app (Art 28 sub-processor).
   *  website = only this marketing website. */
  scope: 'app' | 'website';
  consentOnly?: boolean;
}

export const SUBPROCESSORS: Subprocessor[] = [
  { name: 'Vercel', purpose: 'Hosts the app, stores uploaded documents, routes AI requests (AI Gateway) and counts page visits without cookies', where: 'US company; app servers in London', scope: 'app' },
  { name: 'Neon', purpose: 'Database', where: 'US company; data stored in London (AWS eu-west-2)', scope: 'app' },
  { name: 'Stripe', purpose: 'Card payments and subscription billing', where: 'US and Ireland', scope: 'app' },
  { name: 'Resend', purpose: 'Sends emails such as lesson reminders, receipts and account notices', where: 'US', scope: 'app' },
  { name: 'Anthropic', purpose: 'Writes AI lesson briefings (Claude). Not used to train AI models. Medical notes are never sent', where: 'US', scope: 'app' },
  { name: 'Sentry', purpose: 'Error reports, and masked screen recordings of a sample of app sessions to fix faults', where: 'EU', scope: 'app' },
  { name: 'PostHog', purpose: 'Product analytics and masked session recordings of school-side screens (never pupil or parent pages)', where: 'EU', scope: 'app', consentOnly: true },
  { name: 'Upstash', purpose: 'Rate limiting to protect logins from abuse', where: 'See provider', scope: 'app' },
  { name: 'Google Firebase', purpose: 'Delivers push notifications to the mobile apps', where: 'US', scope: 'app' },
  { name: 'Google Maps', purpose: 'Address search and maps in the app', where: 'US', scope: 'app' },
  { name: 'Mailchimp (Intuit)', purpose: 'Sends product news to account holders who opted in', where: 'US', scope: 'app' },
  { name: 'Amazon Web Services', purpose: 'Hosts this website (driveschoolpro.com)', where: 'London', scope: 'website' },
  { name: 'Formspree', purpose: 'Delivers messages sent through our contact form', where: 'US', scope: 'website' },
  { name: 'Google Fonts', purpose: "Supplies the website's typeface; your browser sends your IP address to Google", where: 'US', scope: 'website' },
  { name: 'Google Analytics and Google Ads', purpose: 'Website analytics, advert measurement and remarketing', where: 'US', scope: 'website', consentOnly: true },
  { name: 'Metricool', purpose: 'Website visit statistics for our social media reporting', where: 'Spain (EU)', scope: 'website', consentOnly: true },
  { name: 'Arcade', purpose: 'Interactive product demos on some feature pages', where: 'US', scope: 'website' },
];

export const SUBPROCESSORS_UPDATED = '11 November 2026';
