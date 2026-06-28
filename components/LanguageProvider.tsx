"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import {
  DEFAULT_SITE_LOCALE,
  SITE_LOCALE_STORAGE_KEY,
  translateToZh,
  type SiteLocale
} from "@/lib/site-i18n";

type LanguageContextValue = {
  locale: SiteLocale;
  setLocale: (locale: SiteLocale) => void;
  toggleLocale: () => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);
const originalText = new WeakMap<Text, string>();
const translatedText = new WeakMap<Text, string>();
const originalAttributes = new WeakMap<Element, Map<string, string>>();
const translatedAttributes = ["aria-label", "title", "placeholder", "alt"] as const;
const skipSelector = "script,style,textarea,pre,code,svg,[data-i18n-skip]";
const ZH_DYNAMIC_REFRESH_MS = 2500;

function preferredLocale(fallback: SiteLocale) {
  if (typeof window === "undefined") return fallback;

  const stored = window.localStorage.getItem(SITE_LOCALE_STORAGE_KEY);
  if (stored === "en" || stored === "zh") return stored;

  const cookieLocale = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${SITE_LOCALE_STORAGE_KEY}=`))
    ?.split("=")[1];
  if (cookieLocale === "en" || cookieLocale === "zh") return cookieLocale;

  return window.navigator.languages.some((language) => language.toLowerCase().startsWith("zh")) ? "zh" : "en";
}

function preserveOuterWhitespace(currentValue: string, replacement: string) {
  const leading = currentValue.match(/^\s*/)?.[0] ?? "";
  const trailing = currentValue.match(/\s*$/)?.[0] ?? "";
  return `${leading}${replacement}${trailing}`;
}

function parentShouldSkip(parent: HTMLElement | null) {
  return !parent || Boolean(parent.closest(skipSelector));
}

function translateTextNode(node: Text, locale: SiteLocale) {
  const parent = node.parentElement;
  if (parentShouldSkip(parent)) return;

  const currentValue = node.nodeValue ?? "";
  const previousSource = originalText.get(node);
  const previousRendered = translatedText.get(node);
  if (!previousSource || (currentValue !== previousSource && currentValue !== previousRendered)) {
    originalText.set(node, currentValue);
  }

  const source = originalText.get(node) ?? "";
  const nextValue = locale === "zh" ? translateToZh(source) : source;
  const desired = locale === "zh" && nextValue ? preserveOuterWhitespace(source, nextValue) : source;
  if (locale === "zh" && nextValue) {
    translatedText.set(node, desired);
  } else {
    translatedText.delete(node);
  }

  if (node.nodeValue !== desired) {
    node.nodeValue = desired;
  }
}

function translateElementAttributes(element: Element, locale: SiteLocale) {
  if (element.closest(skipSelector)) return;

  for (const attr of translatedAttributes) {
    const current = element.getAttribute(attr);
    if (!current) continue;

    let originals = originalAttributes.get(element);
    if (!originals) {
      originals = new Map();
      originalAttributes.set(element, originals);
    }
    if (!originals.has(attr)) originals.set(attr, current);

    const source = originals.get(attr) ?? current;
    const nextValue = locale === "zh" ? translateToZh(source) : source;
    const desired = locale === "zh" && nextValue ? nextValue : source;
    if (element.getAttribute(attr) !== desired) {
      element.setAttribute(attr, desired);
    }
  }
}

function applyLocaleToTree(root: Node, locale: SiteLocale) {
  if (root.nodeType === Node.TEXT_NODE) {
    translateTextNode(root as Text, locale);
    return;
  }

  if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE) return;

  const elementRoot = root as Element | Document;
  if (root.nodeType === Node.ELEMENT_NODE) {
    translateElementAttributes(root as Element, locale);
  }

  const textWalker = document.createTreeWalker(elementRoot, NodeFilter.SHOW_TEXT);
  let textNode = textWalker.nextNode();
  while (textNode) {
    translateTextNode(textNode as Text, locale);
    textNode = textWalker.nextNode();
  }

  const elements =
    root.nodeType === Node.ELEMENT_NODE
      ? [root as Element, ...(root as Element).querySelectorAll("*")]
      : Array.from(document.querySelectorAll("*"));
  for (const element of elements) {
    translateElementAttributes(element, locale);
  }
}

function applyLocaleToDocument(locale: SiteLocale, root: HTMLElement) {
  const pendingLocale = document.documentElement.dataset.i18nPending;

  document.documentElement.lang = locale === "zh" ? "zh-Hans" : "en";
  document.documentElement.dataset.locale = locale;

  applyLocaleToTree(root, locale);

  if (!pendingLocale || pendingLocale === locale) {
    delete document.documentElement.dataset.i18nPending;
  }
}

function localeCookieValue(nextLocale: SiteLocale) {
  const secure = typeof window !== "undefined" && window.location.protocol === "https:" ? "; Secure" : "";
  return `${SITE_LOCALE_STORAGE_KEY}=${nextLocale}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<SiteLocale>(DEFAULT_SITE_LOCALE);

  const setLocale = useCallback((nextLocale: SiteLocale) => {
    setLocaleState(nextLocale);
    // localStorage is the instant client preference; the cookie lets the early bootstrap agree on later visits.
    window.localStorage.setItem(SITE_LOCALE_STORAGE_KEY, nextLocale);
    document.cookie = localeCookieValue(nextLocale);
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(locale === "zh" ? "en" : "zh");
  }, [locale, setLocale]);

  useEffect(() => {
    const nextLocale = preferredLocale(DEFAULT_SITE_LOCALE);
    setLocaleState(nextLocale);
    document.cookie = localeCookieValue(nextLocale);
  }, []);

  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-i18n-root]") ?? document.body;
    applyLocaleToDocument(locale, root);

    let frame = 0;
    let refreshTimer = 0;
    const observer = new MutationObserver((mutations) => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        observer.disconnect();
        for (const mutation of mutations) {
          if (mutation.type === "characterData") {
            applyLocaleToTree(mutation.target, locale);
          }
          if (mutation.type === "attributes" && mutation.target instanceof Element) {
            translateElementAttributes(mutation.target, locale);
          }
          for (const node of mutation.addedNodes) {
            applyLocaleToTree(node, locale);
          }
        }
        observer.observe(root, {
          childList: true,
          subtree: true,
          characterData: true,
          attributes: true,
          attributeFilter: [...translatedAttributes]
        });
      });
    });

    observer.observe(root, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: [...translatedAttributes]
    });

    if (locale === "zh") {
      refreshTimer = window.setInterval(() => {
        if (document.visibilityState === "hidden") return;
        applyLocaleToDocument(locale, root);
      }, ZH_DYNAMIC_REFRESH_MS);
    }

    return () => {
      window.cancelAnimationFrame(frame);
      if (refreshTimer) window.clearInterval(refreshTimer);
      observer.disconnect();
    };
  }, [locale]);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      toggleLocale
    }),
    [locale, setLocale, toggleLocale]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return context;
}
