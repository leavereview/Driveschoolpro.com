/**
 * Google Consent Mode v2 signals for driveschoolpro.com.
 *
 * Google builds remarketing lists for UK/EEA users only when these signals are
 * sent. Default is everything denied; "Accept All" grants all four. "Necessary
 * only" never loads gtag at all (CookieConsent.astro), so it never needs an update.
 * The layouts receive these objects via define:vars so the inline scripts and
 * this tested module cannot drift.
 */
export const CONSENT_DEFAULT_DENIED: Record<string, string | number> = {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  wait_for_update: 500,
};

export const CONSENT_GRANTED_ALL: Record<string, string> = {
  ad_storage: 'granted',
  ad_user_data: 'granted',
  ad_personalization: 'granted',
  analytics_storage: 'granted',
};

/** The consent commands a page issues, in order, before gtag('js') / config. */
export function consentCommands(hasConsent: boolean): unknown[][] {
  const cmds: unknown[][] = [['consent', 'default', CONSENT_DEFAULT_DENIED]];
  if (hasConsent) cmds.push(['consent', 'update', CONSENT_GRANTED_ALL]);
  return cmds;
}
