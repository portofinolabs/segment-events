const traitKey = "ajs_user_traits";

export const formatEventName = (name) => {
  return name
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

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

const formatProductData2 = (product) => ({
  brand: product.vendor,
  category: product.product_type,
  coupon: product.discounts,
  image_url: product.image.substring(2),
  name: product.product_title,
  position: null,
  price: formatProductPrice(product.line_price),
  product_id: product.id,
  quantity: product.quantity,
  sku: product.sku,
  subscription: !!product.selling_plan_allocation,
  variant: product.variant_title,
  variant_id: product.variant_id,
  url: `${window.location.hostname}${product.url}`,
});

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
