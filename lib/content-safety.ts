// Client-side content safety patterns — used for immediate UX feedback before submission
// This list is bundled in the client; it's not a security boundary (server validates too)

export const CLIENT_SPAM_PATTERNS: RegExp[] = [
  /\b(viagra|cialis|casino|lottery|winner|congratulations|click here|buy now|limited time|act now)\b/i,
  /(.)\1{10,}/, // repeated character spam
  /\b(test|testing|asdf|qwerty|lorem ipsum)\b/i, // obvious test content
];

export function clientContainsSpam(text: string): boolean {
  return CLIENT_SPAM_PATTERNS.some((pattern) => pattern.test(text));
}

export function clientIsLowQuality(text: string): boolean {
  const words = text.trim().split(/\s+/);
  if (words.length < 5) return true;
  const capsRatio = (text.match(/[A-Z]/g) || []).length / text.length;
  if (capsRatio > 0.5 && text.length > 50) return true; // >50% caps
  const punctuationRatio = (text.match(/[!?.]{3,}/g) || []).length;
  if (punctuationRatio > 2) return true; // excessive punctuation
  return false;
}

export function clientValidateQuestion(questionText: string, categoryText: string): { valid: boolean; reason?: string } {
  const fullText = `${questionText} ${categoryText}`.trim();

  if (clientContainsSpam(fullText)) {
    return { valid: false, reason: "Your submission appears to contain spam-like content. Please provide a genuine practice question." };
  }
  if (clientIsLowQuality(questionText)) {
    return { valid: false, reason: "Your question is too short or appears to be low quality. Please provide a complete practice question (at least a few sentences)." };
  }
  return { valid: true };
}