// import initSegment from "./segment.js";
import { AnalyticsBrowser, Context } from "@segment/analytics-next";
import { getCustomerInfo, formatCheckoutData } from "./utils.js";

const segment = AnalyticsBrowser.load({
  writeKey: "bevOsoWqV9duPDtFxcCpLG7DJQbKdbLM",
});

/**
 * Self-invoking function to initialize Segment tracking and intercept navigation changes.
 * @param {Window} global - The global window object.
 */
function initialize() {
  const analytics = window.analytics;
  const browser = window.browser;

  analytics.subscribe("product_viewed", (event) => {
    console.log(event);
    const productPrice = event.data.productVariant.price.amount;
    const productTitle = event.data.productVariant.title;
    const payload = {
      event_name: event.name,
      event_data: {
        productPrice: productPrice,
        productTitle: productTitle,
      },
    };
  });

  analytics.subscribe("checkout_started", (event) => {
    segment.track("Checkout Started", formatCheckoutData(event.data.checkout));
  });

  analytics.subscribe("checkout_completed", (event) => {
    segment.track(
      "Checkout Completed",
      formatCheckoutData(event.data.checkout)
    );
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

    segment.page("Page Viewed", eventData);
  });
}

//   initSegment();

if (document.readyState === "loading") {
  // If document is still loading
  document.addEventListener("DOMContentLoaded", initialize); // Wait for it to finish loading before running initialize
} else {
  // Otherwise, if document has already loaded
  initialize(); // Run initialize immediately
}
