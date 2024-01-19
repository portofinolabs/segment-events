// import initSegment from "./segment.js";
import { AnalyticsBrowser, Context } from "@segment/analytics-next";
import {
  getCustomerInfo,
  formatCheckoutData,
  formatProductData,
  formatEventName,
} from "./utils.js";

const segment = AnalyticsBrowser.load({
  writeKey: "bevOsoWqV9duPDtFxcCpLG7DJQbKdbLM",
});

(function () {
  const analytics = window.analytics;
  const browser = window.browser;

  analytics.subscribe("checkout_started", (event) => {
    segment.track(
      formatEventName(event.name),
      formatCheckoutData(event.data.checkout)
    );
  });

  analytics.subscribe("checkout_completed", (event) => {
    const eventData = {
      affiliation: "Website",
      checkout_id: event.data.checkout.token,
      coupon: event.data.checkout.discountApplications,
      currency: event.data.checkout.currencyCode,
      discount: event.data.checkout.discountApplications,
      products: formatProductData(event.data.checkout.lineItems),
      brand: event.data.checkout.lineItems[0].variant.product.vendor,
      category: event.data.checkout.lineItems[0].variant.product.type,
      image_url: event.data.checkout.lineItems[0].variant.image.src,
      name: event.data.checkout.lineItems[0].variant.product.title,
      price: event.data.checkout.lineItems[0].variant.price.amount,
      product_id: event.data.checkout.lineItems[0].variant.product.id,
      quantity: event.data.checkout.lineItems[0].quantity,
      sku: event.data.checkout.lineItems[0].variant.sku,
      subscription: !!event.data.checkout.lineItems[0].selling_plan_allocation,
      url: `${window.location.hostname}${event.data.checkout.lineItems[0].variant.product.url}`,
      value: (
        event.data.checkout.lineItems[0].variant.price.amount *
        event.data.checkout.lineItems[0].quantity
      ).toFixed(2),
      variant: event.data.checkout.lineItems[0].variant.title,
      source: "becausemarket.com",
    };

    segment.track(formatEventName(event.name), eventData);
  });

  analytics.subscribe("page_viewed", async (event) => {
    let pageData;
    const { navigator, document } = event;

    if (document && navigator) {
      pageData = {
        title: document.title,
        path: document.location.pathname,
        referrer: document.referrer,
        search: document.location.search,
        url: document.location.href,
        keywords: [],
        userAgent: navigator.userAgent,
        userAgentData: [],
      };
    }
    const eventData = {
      ...(await getCustomerInfo()),
      ...pageData,
    };

    segment.page(formatEventName(event.name), eventData);
  });
})();
