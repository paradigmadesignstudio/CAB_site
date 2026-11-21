import { isCabBrandToken } from "@/lib/cabBrand";

const SKIP_ANCESTOR_SELECTOR =
  '[data-cab-protected="true"], [data-cab-manual="true"], .notranslate, script, style, noscript, textarea, code, pre, nav, footer';

function shouldSkipTextNode(node: Text): boolean {
  const parent = node.parentElement;

  if (!parent) {
    return true;
  }

  if (parent.closest(SKIP_ANCESTOR_SELECTOR)) {
    return true;
  }

  const value = node.nodeValue ?? "";

  if (!/\bCAB\b|C\.A\.B\./.test(value)) {
    return true;
  }

  return false;
}

function wrapCabTokensInTextNode(node: Text): void {
  const parent = node.parentElement;

  if (!parent) {
    return;
  }

  const text = node.nodeValue ?? "";
  const parts = text.split(/(\bCAB\b|C\.A\.B\.)/g).filter((part) => part.length > 0);
  const fragment = document.createDocumentFragment();

  for (const part of parts) {
    if (isCabBrandToken(part)) {
      const span = document.createElement("span");
      span.setAttribute("translate", "no");
      span.className = "notranslate";
      span.setAttribute("data-cab-protected", "true");
      span.textContent = part;
      fragment.appendChild(span);
      continue;
    }

    fragment.appendChild(document.createTextNode(part));
  }

  node.replaceWith(fragment);
}

export function protectCabFromTranslation(root: ParentNode = document.body): void {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);

  const textNodes: Text[] = [];

  let current = walker.nextNode();

  while (current) {
    if (current instanceof Text && !shouldSkipTextNode(current)) {
      textNodes.push(current);
    }

    current = walker.nextNode();
  }

  for (const textNode of textNodes) {
    wrapCabTokensInTextNode(textNode);
  }
}
