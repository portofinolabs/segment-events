const segment = window.segment;

const formatProductData = (products) =>
  products.map((product) => ({
    brand: product.variant.product.vendor,
    ...product,
  }));

const formatCheckoutData = (checkout) => {
  const {
    lineItems,
    currencyCode: currency,
    discountApplications: coupon,
    token: checkout_id,
  } = checkout;

  return {
    affiliation: "Website",
    source: "becausemarket.com",
    coupon,
    discount: coupon,
    currency,
    checkout_id,
    products: formatProductData(lineItems),
  };
};

function checkoutStartedEvent(event) {
  const { checkout } = event.data;
  segment.track("Checkout Started", formatCheckoutData(checkout));
}

function checkoutCompletedEvent(event) {
  const { checkout } = event.data;
  segment.track("Checkout Completed", formatCheckoutData(checkout));
}
