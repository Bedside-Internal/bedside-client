import { RegExpMatcher } from "obscenity";
import { englishDataset, englishRecommendedTransformers } from "obscenity";

// Initialize the obscenity filter with the English profanity dataset and recommended transformers
const matcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
});

export function clientContainsProfanity(text: string): boolean {
  return matcher.hasMatch(text);
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

  if (clientContainsProfanity(fullText)) {
    return { valid: false, reason: "Your submission contains inappropriate language. Please provide a professional practice question." };
  }
  if (clientIsLowQuality(questionText)) {
    return { valid: false, reason: "Your question is too short or appears to be low quality. Please provide a complete practice question (at least a few sentences)." };
  }
  return { valid: true };
}