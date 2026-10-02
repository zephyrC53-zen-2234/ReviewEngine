export function localRedirect(path: string, origin: string): string {
  try {
    const destination = new URL(path, origin);
    if (!path.startsWith('/') || destination.origin !== origin) return '/';
    return destination.pathname + destination.search + destination.hash;
  } catch {
    return '/';
  }
}
