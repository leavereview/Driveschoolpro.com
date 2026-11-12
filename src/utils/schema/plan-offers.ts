import { OFFER, PRICING } from "../../config/offer";

/**
 * schema.org Offers for every plan: early access now, free for trainee instructors, then Free, Solo and School from
 * 1 April 2027. Shared by /pricing/ and the homepage SoftwareApplication so the markup
 * matches the published prices everywhere (SEO plan, item 7). Built from PRICING, so a
 * price change in src/config/offer.ts updates both pages.
 */
const BASE = "https://driveschoolpro.com/pricing/";

const monthly = (price: number) => ({
  "@type": "UnitPriceSpecification",
  price: String(price),
  priceCurrency: "GBP",
  unitText: "month",
  billingIncrement: 1,
  valueAddedTaxIncluded: false,
});

export function planOffers() {
  const P = PRICING;
  const common = {
    "@type": "Offer",
    priceCurrency: "GBP",
    availability: "https://schema.org/InStock",
    url: OFFER.ctaPrimary.href,
    seller: { "@type": "Organization", name: "DriveSchoolPro" },
    itemOffered: { "@id": "https://driveschoolpro.com/#software" },
  };
  return [
    {
      ...common,
      "@id": `${BASE}#early-access`,
      name: "Early access — free until 31 March 2027",
      description: "Every feature free for solo ADIs and multi-instructor schools until 31 March 2027. No card required, no setup fees.",
      price: "0",
      priceSpecification: monthly(0),
      priceValidUntil: "2027-03-31",
    },
    {
      ...common,
      "@id": `${BASE}#free`,
      name: "Free plan",
      description: `${P.free.summary}. Email reminders included.`,
      price: "0",
      priceSpecification: monthly(0),
      validFrom: "2027-04-01",
    },
    {
      ...common,
      "@id": `${BASE}#solo`,
      name: "Solo plan",
      description: `For one instructor: unlimited lessons, every feature, text and WhatsApp reminders when they launch (coming soon). £${P.solo.price} a month, no VAT charged.`,
      price: String(P.solo.price),
      priceSpecification: monthly(P.solo.price),
      validFrom: "2027-04-01",
    },
    {
      ...common,
      "@id": `${BASE}#trainee`,
      name: "Free for trainee instructors",
      description: `${P.trainee.summary}. No card needed.`,
      price: "0",
      priceSpecification: monthly(0),
      url: "https://driveschoolpro.com/free-for-trainee-instructors/",
    },
    {
      ...common,
      "@id": `${BASE}#school`,
      name: "School plan",
      description: `For multi-instructor schools: £${P.school.price} a month plus £${P.school.perExtraInstructor} for each extra instructor, no VAT charged.`,
      price: String(P.school.price),
      priceSpecification: monthly(P.school.price),
      validFrom: "2027-04-01",
    },
  ];
}
