const traitKey = "ajs_user_traits";

export const formatProductData = (products) =>
  products.map((product) => ({
    brand: product.variant.product.vendor,
    category: product.variant.product.type,
    coupon: product.discountAllocations,
    image_url: product.variant.image.src,
    name: product.variant.product.title,
    price: product.variant.price.amount,
    product_id: product.variant.product.id,
    quantity: product.quantity,
    sku: product.variant.sku,
    subscription: null,
    variant: product.variant.title,
    url: `${window.location.hostname}${product.variant.product.url}`,
    value: (product.variant.price.amount * product.quantity).toFixed(2),
  }));

export const formatCheckoutData = (checkout) => {
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

export const getCustomerInfo = async () => {
  const customer = JSON.parse(await browser.localStorage.getItem(traitKey));

  return {
    email: customer.email,
    first_name: customer.firstName,
    last_name: customer.lastName,
  };
};
