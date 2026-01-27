import { GTM_ID } from "../config";


export const isGtmEnabled = (): boolean => GTM_ID.length > 0;

type DataLayerItem = {
  event: string;
  [key: string]: unknown;
};

declare global {
  interface Window {
    dataLayer?: DataLayerItem[];
  }
}

const push = (data: DataLayerItem) => {
  if (!isGtmEnabled() || typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(data);
};

export const pageview = (url: string) => {
  push({
    event: "page_view",
    page_path: url,
  });
};

export const trackEvent = (
  event: string,
  params: Record<string, unknown> = {}
) => {
  push({
    event,
    ...params,
  });
};