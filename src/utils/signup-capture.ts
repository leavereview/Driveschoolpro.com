/**
 * Pure helpers for BusinessNameCapture. Kept free of DOM and Google types so
 * `node --test` can exercise them without a browser.
 */

/**
 * Ad/UTM params forwarded from the landing URL to app.driveschoolpro.com/signup.
 * Same list as SignupAttribution.astro (the signup links) and the app's
 * ATTRIBUTION_QUERY_PARAMS; fbclid and msclkid were missing here, so a Facebook
 * or Bing visitor who signed up through the hero form arrived as "direct".
 */
export const TRACKING_PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
  'gbraid',
  'wbraid',
  'msclkid',
  'fbclid',
] as const;

const MAX_PARAM_LENGTH = 500;

export function pickTrackingParams(search: string): Array<[string, string]> {
  const params = new URLSearchParams(search);
  const out: Array<[string, string]> = [];
  for (const key of TRACKING_PARAMS) {
    const value = params.get(key)?.trim();
    if (value) out.push([key, value.slice(0, MAX_PARAM_LENGTH)]);
  }
  return out;
}

/**
 * A place_id only travels while the field still shows the suggestion it came
 * from. Any edit means the visitor is naming something else.
 */
export function reconcilePlaceId(
  placeId: string | null,
  pickedName: string | null,
  currentValue: string,
): string | null {
  if (!placeId || pickedName === null) return null;
  return currentValue.trim() === pickedName.trim() ? placeId : null;
}

const OWN_SITE_HOST = /(^|\.)driveschoolpro\.com$/;

/**
 * `dsp_ref` (the external referrer host, e.g. facebook.com) and `dsp_page` (the
 * page the form was submitted on), as SignupAttribution.astro adds to signup
 * links. Facebook's in-app browser drops the referrer on the cross-site hop to
 * the app, so the site must pass it on. Our own hosts are never a source.
 */
export function pickReferrerParams(referrer: string, pathname: string): Array<[string, string]> {
  const out: Array<[string, string]> = [];
  try {
    if (referrer) {
      const host = new URL(referrer).hostname.toLowerCase();
      if (host && !OWN_SITE_HOST.test(host)) out.push(['dsp_ref', host.slice(0, MAX_PARAM_LENGTH)]);
    }
  } catch {
    // not a URL: no referrer
  }
  if (pathname) out.push(['dsp_page', pathname.slice(0, MAX_PARAM_LENGTH)]);
  return out;
}
