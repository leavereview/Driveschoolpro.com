/**
 * Offer configuration — single source of truth.
 *
 * Changing the current offer requires editing only this file.
 *
 * Last updated: 2026-10-16
 *
 * History:
 *   Jan – early Mar 2026: "14-day free trial"
 *   Mid-Mar – Mar 31:     "Founding Member / Early Access"
 *   Apr 1 – Apr 13:       "Get Started Free"
 *   Apr 14 – Jun 9:       "3 months free"
 *   Jun 10 – Jul 28 2026: "14-day free trial" (evergreen) + summer promo (removed Oct 2026)
 *   Jul 29 2026 – present: "Free until 31 March 2027" (free launch — early access)
 */

export const OFFER = {
  /** Short offer text — used in CTAs, headlines, inline callouts */
  short: "Free until 31 March 2027",

  /** Long offer text — used in hero subheads, body copy */
  long: "DriveSchoolPro is free while we're in early access — until 31 March 2027",

  /** Meta-description-friendly fragment (no dashes, no emphasis).
   *  Evergreen only — never put time-boxed promos here (persists in search results). */
  meta: "Free during early access — until 31 March 2027.",

  /** Primary CTA — used as the main signup button everywhere */
  ctaPrimary: {
    label: "Get started free",
    labelShort: "Get started",
    href: "https://app.driveschoolpro.com/signup",
  },

  /** Secondary CTA — used alongside primary on pricing, hero, etc. */
  ctaSecondary: {
    label: "View Pricing",
    href: "/pricing",
  },
} as const;

export type OfferConfig = typeof OFFER;

/**
 * Time-boxed promotion — rendered as the site-wide banner and the pricing-page
 * callout. On-page only; never include in meta/OG tags or JSON-LD.
 *
 * To take the sale down: set `enabled: false` and rebuild.
 */
export const PROMO = {
  // No promotion running. SUMMER26 (Jun–Aug 2026) has been removed.
  // To run one: set enabled: true and fill in every field below, then rebuild.
  enabled: false,
  code: "",
  endDate: "",
  headline: "",
  body: "",
  /** Short line for the pricing page, near the plan cards */
  pricingNote: "",
  href: "https://app.driveschoolpro.com/signup",
} as const;

export type PromoConfig = typeof PROMO;

/**
 * Plans from 1 April 2027 — single source of truth for published prices.
 * Decided 16 Oct 2026. JOHN POWELL LTD is not VAT-registered, so no VAT is charged.
 * Competitor prices are never quoted on this site (see compare pages).
 */
export const PRICING = {
  startDate: "1 April 2027",
  vatNote: "No VAT charged",
  free: {
    name: "Free",
    price: 0,
    lessonsPerMonth: 60,
    instructors: 1,
    summary: "Every feature, including AI lesson briefings, for 1 instructor and up to 60 lessons a month",
  },
  solo: {
    name: "Solo",
    price: 22,
    summary: "1 instructor, unlimited lessons, text and WhatsApp reminders (coming soon)",
  },
  school: {
    name: "School",
    price: 22,
    perExtraInstructor: 10,
    summary: "£22 a month plus £10 for each extra instructor",
  },
  founding: {
    price: 15,
    perExtraInstructor: 8,
    lockMonths: 24,
    cardBy: "1 March 2027",
    summary: "£15 a month (School: £15 + £8 per extra instructor), locked for 24 months, if you add a card by 1 March 2027",
  },
  /** Accounts created from 1 April 2027 get this many days unlimited before the Free plan limits apply */
  reverseTrialDays: 30,
  cardFeePercent: 3,
} as const;

/** One-line plain-English price summary for body copy and FAQs */
export const PRICE_LINE =
  "From 1 April 2027 there's a permanent Free plan (1 instructor, up to 60 lessons a month, every feature including AI), Solo at £22 a month, and School at £22 a month plus £10 per extra instructor. No VAT is charged.";
