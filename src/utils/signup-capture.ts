/**
 * Pure helpers for BusinessNameCapture. Kept free of DOM and Google types so
 * `node --test` can exercise them without a browser.
 */

/** Ad/UTM params forwarded from the landing URL to app.driveschoolpro.com/signup. */
export const TRACKING_PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
  'gbraid',
  'wbraid',
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
