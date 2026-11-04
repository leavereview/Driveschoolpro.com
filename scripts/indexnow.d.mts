export function sitemapUrls(distDir: string): string[];
export function htmlFileFor(distDir: string, url: string): string | null;
export function buildManifest(distDir: string): Record<string, string>;
export function changedUrls(previous: Record<string, string>, current: Record<string, string>): string[];
export function findKey(publicDir: string): string | null;
