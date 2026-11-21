/** Impede que tradutores automáticos tratem "CAB" como a palavra inglesa "cab" (táxi). */
export const CAB_WORD_JOINER = "\u2060";

const CAB_ACRONYM_PATTERN = /\bCAB\b/g;
const CAB_DOTTED_PATTERN = /C\.A\.B\./g;

export function shieldCabInString(text: string): string {
  return text
    .replace(CAB_ACRONYM_PATTERN, `C${CAB_WORD_JOINER}A${CAB_WORD_JOINER}B`)
    .replace(CAB_DOTTED_PATTERN, `C${CAB_WORD_JOINER}.${CAB_WORD_JOINER}A${CAB_WORD_JOINER}.${CAB_WORD_JOINER}B${CAB_WORD_JOINER}.`);
}

const CAB_SPLIT_PATTERN = /(\bCAB\b|C\.A\.B\.)/g;

export function isCabBrandToken(value: string): boolean {
  return value === "CAB" || value === "C.A.B.";
}

export function splitCabBrandText(text: string): string[] {
  return text.split(CAB_SPLIT_PATTERN).filter((part) => part.length > 0);
}
