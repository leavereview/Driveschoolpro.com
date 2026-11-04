export function gitHistoryState(cwd: string): 'full' | 'shallow' | 'none';
export function pageLastModified(file: string, siteRoot: string): string | null;
export function buildLastmodMap(siteRoot: string): Map<string, string>;
export function lastmodSerializer(map: Map<string, string>): (item: { url: string }) => object;
