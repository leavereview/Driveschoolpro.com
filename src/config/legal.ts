/**
 * Dates and versions shared by the legal pages (issue #119).
 *
 * Set by hand, never at build time. Each page also carries the same date as a literal
 * `modifiedDate="YYYY-MM-DD"` prop, because scripts/sitemap-lastmod.mjs reads that
 * literal from the page source: change both together.
 *
 * DPA_EXISTING_ACCOUNTS_FROM must be at least 30 days after the email that tells
 * existing account owners about the new Data Processing Terms and the additions to
 * the sub-processor list (Terms clause 13 and the Schedule's 30-day promise). If that
 * email goes out after 9 December 2026, move this date (as #118 did for the Terms).
 */

/** The day these versions of the privacy notice, Data Processing Terms and list were published. */
export const LEGAL_UPDATED = '24 November 2026';

/** Version of the Data Processing Terms at /data-processing-terms/. */
export const DPA_VERSION = '2026-12';

/** Accounts opened before LEGAL_UPDATED move from the Terms Schedule to the new Data Processing Terms on this date. */
export const DPA_EXISTING_ACCOUNTS_FROM = '8 January 2027';
