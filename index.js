import initSegment from "./segment.js";
import { getCustomerInfo, formatCheckoutData } from "./utils.js";

/**
 * Self-invoking function to initialize Segment tracking and intercept navigation changes.
 * @param {Window} global - The global window object.
 */
function initialize() {
  initSegment();
  const segment = window.segment;
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
    console.log(event);
    const { event_name, ...restEvents } = event;
    const eventData = {
      ...restEvents,
      ...(await getCustomerInfo()),
    };

    if (segment?.page) segment.page("Page Viewed", eventData);
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
