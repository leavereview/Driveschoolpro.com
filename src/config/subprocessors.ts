/**
 * Single source of truth for who processes personal data for DriveSchoolPro.
 * Rendered by /subprocessors/. The Data Processing Terms (clause 6.2) promise account
 * owners 30 days' email notice before a new `pupil` or `limited` provider is added, so
 * adding one here means emailing account owners first and adding a CHANGELOG row.
 *
 * Every field states only what we have checked (issue #119, 24 Nov 2026): the app repo
 * (vercel.json lhr1; Neon aws-eu-west-2; backups S3 eu-west-1; Sentry ingest.de;
 * PostHog eu.i.posthog.com) and each provider's own terms page. Where a fact is not
 * confirmed, the field says "See provider's terms" rather than guess. Add Meta when
 * WhatsApp is switched on for pupils (decision 7 on #119).
 */
export type SubprocessorSection =
  /** A: can receive pupil personal data (Article 28 sub-processor). */
  | 'pupil'
  /** B: may touch pupil-side data in limited ways. */
  | 'limited'
  /** C: handles only our own data (account owners, visitors) where we are controller. */
  | 'own'
  /** D: runs this marketing website only. */
  | 'website';

export interface Subprocessor {
  name: string;
  /** Legal entity and country, only where confirmed. */
  entity?: string;
  purpose: string;
  data?: string;
  where: string;
  transfer?: string;
  terms?: { label: string; href: string };
  section: SubprocessorSection;
}

const SEE_TERMS = "See provider's terms";

export const SUBPROCESSORS: Subprocessor[] = [
  // ── A. Can receive pupil personal data ────────────────────────────────────
  {
    name: 'Vercel',
    entity: 'Vercel Inc. (US)',
    purpose: 'Runs the app (servers in London), stores files you upload (documents, avatars), routes AI requests (AI Gateway), and counts page visits and page speed without cookies',
    data: 'Everything in the app passes through its servers; uploaded files; AI prompts (see Anthropic)',
    where: 'App servers: London (lhr1). Uploaded files: Vercel Blob storage',
    transfer: "UK International Data Transfer Addendum and EU Standard Contractual Clauses in Vercel's DPA",
    terms: { label: 'vercel.com/legal/dpa', href: 'https://vercel.com/legal/dpa' },
    section: 'pupil',
  },
  {
    name: 'Neon',
    entity: 'Neon, part of Databricks, Inc. (US)',
    purpose: 'The main database',
    data: 'All app data',
    where: 'London (AWS eu-west-2)',
    transfer: "Data is stored in London. Neon's data processing terms form part of the Databricks DPA",
    terms: { label: 'databricks.com/legal/dpa', href: 'https://www.databricks.com/legal/dpa' },
    section: 'pupil',
  },
  {
    name: 'Amazon Web Services',
    entity: 'The AWS entity in our AWS agreement',
    purpose: 'Holds encrypted nightly backups of the database',
    data: 'A full copy of the database, including pupil data',
    where: 'Ireland (eu-west-1). Kept 30 days (daily copies) and 12 months (one copy a month)',
    transfer: "Ireland is in the EEA, which the UK treats as adequate. AWS's terms also include the UK Addendum to the SCCs",
    terms: { label: 'AWS GDPR DPA', href: 'https://d1.awsstatic.com/legal/aws-gdpr/AWS_GDPR_DPA.pdf' },
    section: 'pupil',
  },
  {
    name: 'Stripe',
    entity: 'The Stripe entity in our Stripe agreement',
    purpose: 'Takes card payments for schools through Stripe Connect, and bills us for subscriptions',
    data: 'Payer name, email, amount and card details (card numbers go to Stripe, never to us)',
    where: 'US and Ireland',
    transfer: "The UK International Data Transfer Addendum and/or the Data Privacy Framework (Stripe's DPA lists both and does not say which applies to us)",
    terms: { label: 'stripe.com/legal/dpa', href: 'https://stripe.com/legal/dpa' },
    section: 'pupil',
  },
  {
    name: 'Resend',
    entity: 'Plus Five Five, Inc. (US)',
    purpose: 'Sends our emails: lesson reminders, receipts, invitations, account notices',
    data: 'Recipient name and email address, and the email text',
    where: 'US',
    transfer: 'EU-US Data Privacy Framework with the UK Extension, and the UK Addendum to the SCCs',
    terms: { label: 'resend.com/legal/dpa', href: 'https://resend.com/legal/dpa' },
    section: 'pupil',
  },
  {
    name: 'Anthropic',
    entity: 'Anthropic (US)',
    purpose: 'Writes AI lesson briefings and short lesson and pupil summaries (model: Claude Haiku). Requests reach it through the Vercel AI Gateway. If Anthropic is unavailable, the gateway can send the request to the same Claude model run by Amazon Bedrock (Amazon Web Services) or Google Vertex AI (Google). Also used for support-ticket replies and onboarding email wording (see section C)',
    data: "The pupil's first name only, the competencies practised and levels reached, the instructor's lesson notes, and the pupil learning notes the instructor wrote. The medical notes field is never sent. Free-text lesson notes are sent as written, so instructors should not put health details in them",
    where: 'US. Anthropic states that by default it deletes API inputs and outputs within 30 days',
    transfer: "Anthropic's DPA includes the UK Addendum (version B1.0) to the SCCs",
    terms: { label: 'anthropic.com/legal/data-processing-addendum', href: 'https://www.anthropic.com/legal/data-processing-addendum' },
    section: 'pupil',
  },
  {
    name: 'Google Firebase Cloud Messaging',
    entity: "Google LLC or Google Ireland Limited, as set out in Google's agreement",
    purpose: 'Delivers push notifications to the iPhone and Android apps',
    data: 'A device token and a short generic message such as "Lesson cancelled". The messages we send do not include names',
    where: 'US and other countries where Google operates',
    transfer: "EU-US Data Privacy Framework (Google is certified) or Standard Contractual Clauses, as Google's terms provide",
    terms: { label: 'Firebase data processing terms', href: 'https://firebase.google.com/terms/data-processing-terms' },
    section: 'pupil',
  },
  {
    name: 'Google Maps Platform',
    entity: "Google, as set out in Google's agreement",
    purpose: 'Suggests addresses as you type, and shows maps',
    data: 'The address text typed into an address box, and the IP address of the device',
    where: 'US and other countries where Google operates',
    transfer: "As in Google's Cloud data processing terms",
    terms: { label: 'Google Cloud data processing terms', href: 'https://cloud.google.com/terms/data-processing-addendum' },
    section: 'pupil',
  },
  {
    name: 'Sentry',
    entity: 'Functional Software, Inc. (US)',
    purpose: 'Error reports, and masked screen recordings of a sample of app sessions, so we can fix faults',
    data: 'Technical details of an error; masked recordings. We strip cookies, query strings, IP addresses and request bodies before sending. A recording can still contain page layout',
    where: "EU project (Germany). Sentry's DPA does not promise EU-only storage",
    transfer: 'EU-US Data Privacy Framework with the UK Extension, then the UK Addendum to the SCCs',
    terms: { label: 'sentry.io/legal/dpa', href: 'https://sentry.io/legal/dpa/' },
    section: 'pupil',
  },
  {
    name: 'Upstash',
    purpose: 'Rate limiting, to slow down password guessing and abuse',
    data: 'A counter keyed by IP address and, for login protection, an identifier derived from the login attempt',
    where: SEE_TERMS,
    transfer: SEE_TERMS,
    terms: { label: 'Upstash DPA', href: 'https://upstash.com/static/trust/dpa.pdf' },
    section: 'pupil',
  },
  {
    name: 'Freshworks (Freshdesk)',
    entity: 'Freshworks Inc. (US)',
    purpose: 'Our support desk',
    data: 'Whatever a person puts in a support request: name, email and any pupil details they type. A draft reply may be written by AI (Anthropic)',
    where: SEE_TERMS,
    transfer: 'EU SCCs with the UK International Data Transfer Agreement',
    terms: { label: 'freshworks.com/data-processing-addendum', href: 'https://www.freshworks.com/data-processing-addendum/' },
    section: 'pupil',
  },
  {
    name: 'Twilio',
    entity: 'Twilio Inc. (US)',
    purpose: 'Text messages and WhatsApp. Text reminders to pupils are not available in DriveSchoolPro, and WhatsApp reminders are not yet offered to schools. Where a school uses its own Twilio account, messages go through that account, not ours. We may also use Twilio to send account owners up to two texts about finishing setup',
    data: 'Mobile number and message text (for lesson messages: name, lesson date, time, instructor, pickup address)',
    where: 'US',
    transfer: 'EU-US Data Privacy Framework with the UK Extension (Twilio is certified), binding corporate rules, and the UK International Data Transfer Agreement',
    terms: { label: 'Twilio data protection addendum', href: 'https://www.twilio.com/en-us/legal/data-protection-addendum' },
    section: 'pupil',
  },

  // ── B. May touch pupil-side data in limited ways ──────────────────────────
  {
    name: 'Imagin Studio',
    purpose: 'Shows a picture of a car in the vehicles screen',
    data: "The car's make, model, year and colour, and the IP address of the device. No pupil data",
    where: SEE_TERMS,
    transfer: SEE_TERMS,
    section: 'limited',
  },
  {
    name: 'Slack',
    entity: 'Slack Technologies, LLC (US)',
    purpose: 'Internal alerts to our team (new sign-ups, subscription changes, system health)',
    data: 'Owner name, email address and school name; text replies sent to our setup texts. No pupil data',
    where: 'US by default',
    transfer: SEE_TERMS,
    terms: { label: 'slack.com legal', href: 'https://slack.com/intl/en-gb/legal' },
    section: 'limited',
  },

  // ── C. Our own data only (we are the controller) ──────────────────────────
  {
    name: 'PostHog',
    purpose: 'Product analytics and masked screen recordings of school-side screens (never pupil or parent pages), only if you accept analytics cookies. Plus a few account-level usage events sent from our servers',
    data: 'School-side usage; a pseudonymous school ID',
    where: 'EU (Frankfurt)',
    terms: { label: 'PostHog privacy policy', href: 'https://posthog.com/privacy' },
    section: 'own',
  },
  {
    name: 'Mailchimp',
    entity: 'The Rocket Science Group LLC, part of Intuit (US)',
    purpose: 'Product news to account owners who opted in',
    data: 'Name, email address, school name, town, outward postcode, sign-up date. Never pupils',
    where: 'US',
    terms: { label: 'Mailchimp DPA', href: 'https://mailchimp.com/legal/data-processing-addendum/' },
    section: 'own',
  },
  {
    name: 'Google Analytics and Google Ads',
    purpose: 'Measures adverts and builds audiences, only if you accept analytics cookies. In the app, if Google Analytics is switched on, it loads on every page after "Accept All", including pupil and parent pages',
    data: 'Cookie identifiers, pages visited',
    where: 'US and elsewhere',
    terms: { label: 'Google Ads data processing terms', href: 'https://business.safety.google/adsprocessorterms/' },
    section: 'own',
  },
  {
    name: 'Anthropic (see section A)',
    purpose: 'Drafts replies to support tickets; wording for onboarding emails (first names of up to three recent pupils may be included)',
    data: 'As section A',
    where: 'US',
    terms: { label: 'As section A', href: 'https://www.anthropic.com/legal/data-processing-addendum' },
    section: 'own',
  },

  // ── D. This website only (driveschoolpro.com) ─────────────────────────────
  {
    name: 'Amazon Web Services (Lightsail)',
    purpose: 'Hosts the website',
    where: 'London',
    terms: { label: 'AWS GDPR DPA', href: 'https://d1.awsstatic.com/legal/aws-gdpr/AWS_GDPR_DPA.pdf' },
    section: 'website',
  },
  {
    name: 'Formspree',
    purpose: 'Delivers contact-form messages',
    where: 'US',
    section: 'website',
  },
  {
    name: 'Google Fonts',
    purpose: 'Supplies the website typeface (your browser sends your IP address to Google)',
    where: 'US',
    terms: { label: 'Google privacy policy', href: 'https://policies.google.com/privacy' },
    section: 'website',
  },
  {
    name: 'Metricool',
    purpose: 'Website visit statistics, only if you click Accept All',
    where: 'Spain (EU)',
    terms: { label: 'Metricool privacy policy', href: 'https://metricool.com/privacy-policy/' },
    section: 'website',
  },
  {
    name: 'Arcade',
    entity: 'Arcade Software, Inc. (US)',
    purpose: 'Interactive product demos',
    where: 'US',
    terms: { label: 'arcade.software/dpa (EU SCCs and UK Addendum)', href: 'https://www.arcade.software/dpa' },
    section: 'website',
  },
  {
    name: 'Google Analytics and Google Ads',
    purpose: 'As section C, only if you click Accept All',
    where: 'US',
    terms: { label: 'As section C', href: 'https://business.safety.google/adsprocessorterms/' },
    section: 'website',
  },
];

/** Display date of the current list. Keep in step with the newest CHANGELOG row. */
export const SUBPROCESSORS_UPDATED = '24 November 2026';

/** Newest first. */
export const SUBPROCESSORS_CHANGELOG: { date: string; change: string }[] = [
  {
    date: '24 November 2026',
    change: 'Rewritten to show each provider\'s legal entity where confirmed, the data it can receive, where the data is, how transfers are protected and its data processing terms. Added to the list: Amazon Web Services (database backups), Twilio, Freshworks (Freshdesk), Slack and Imagin Studio. Noted that the Vercel AI Gateway can send AI requests to the same Claude model run by Amazon Bedrock or Google Vertex AI if Anthropic is unavailable.',
  },
  { date: '11 November 2026', change: 'First published.' },
];
