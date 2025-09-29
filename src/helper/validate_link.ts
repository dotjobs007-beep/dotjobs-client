import { ALLOWED_DOMAINS } from "@/utils/enums";

export function isTrustedUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' &&
      ALLOWED_DOMAINS.some(domain => parsed.hostname.endsWith(domain));
  } catch {
    return false;
  }
}
