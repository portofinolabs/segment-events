
/**
 *
 * UTILS
 *
 */


!function () {
  var i = "segment", analytics = window[i] = window[i] || []; if (!analytics.initialize) if (analytics.invoked) window.console && console.error && console.error("Segment snippet included twice."); else {
    analytics.invoked = !0; analytics.methods = ["trackSubmit", "trackClick", "trackLink", "trackForm", "pageview", "identify", "reset", "group", "track", "ready", "alias", "debug", "page", "screen", "once", "off", "on", "addSourceMiddleware", "addIntegrationMiddleware", "setAnonymousId", "addDestinationMiddleware", "register"]; analytics.factory = function (e) { return function () { if (window[i].initialized) return window[i][e].apply(window[i], arguments); var n = Array.prototype.slice.call(arguments); if (["track", "screen", "alias", "group", "page", "identify"].indexOf(e) > -1) { var c = document.querySelector("link[rel='canonical']"); n.push({ __t: "bpc", c: c && c.getAttribute("href") || void 0, p: location.pathname, u: location.href, s: location.search, t: document.title, r: document.referrer }) } n.unshift(e); analytics.push(n); return analytics } }; for (var n = 0; n < analytics.methods.length; n++) { var key = analytics.methods[n]; analytics[key] = analytics.factory(key) } analytics.load = function (key, n) { var t = document.createElement("script"); t.type = "text/javascript"; t.async = !0; t.setAttribute("data-global-segment-analytics-key", i); t.src = "https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js"; var r = document.getElementsByTagName("script")[0]; r.parentNode.insertBefore(t, r); analytics._loadOptions = n }; analytics._writeKey = "bevOsoWqV9duPDtFxcCpLG7DJQbKdbLM";; analytics.SNIPPET_VERSION = "5.2.0";
    analytics.load("bevOsoWqV9duPDtFxcCpLG7DJQbKdbLM");
  }
}();

const analytics = window.shopevents

const getSegment = async () => {
  return await window.segment
}



const formatEventName = (name) => {
  return name
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatCheckoutProductData = (products) =>
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


const formatThemeProductsData = (products) =>
  products.map((product) => ({
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
  }));


const formatThemeProductData = (product) => {
  console.log("product", product);

  return {
    brand: product.vendor,
    category: product.product_type,
    coupon: product.discounts,
    image_url: product.featured_image.substring(2),
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
  }
}

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
    products: formatCheckoutProductData(lineItems),
  };
};


const getCustomerInfo = async () => {
  const traitKey = 'ajs_user_traits'
  const customer = localStorage.getItem(traitKey)

  return {
    email: customer?.email,
    first_name: customer?.firstName,
    last_name: customer?.lastName,
  };
};


const formatProductPrice = (price) => {
  return (price / 100).toFixed(2);
};

const getProductFromCart = (cart, variantId) => {
  const { items } = cart;
  return items.filter((item) => variantId === item.variant_id)[0];
};
const getIsAddOn = (url) => getUrlParams(url);

const getUrlParams = (url) => {
  var params = {};
  var queryString = url.substring(url.indexOf("?") + 1);
  var paramPairs = queryString.split("&");

  paramPairs.forEach(function (pair) {
    var keyValue = pair.split("=");
    var key = decodeURIComponent(keyValue[0]);
    var value = decodeURIComponent(keyValue[1] || "");
    params[key] = value;
  });

  return params;
};

const getContext = () => ({
  campaign: getUTMParams(),
  page: window.location.href,
  device: window.navigator.userAgent,
});


/** END UTILS */


/**
 *
 * THEME EVENTS
 *
 */



const pageViewedEvent = async () => {
  const segment = await getSegment()

  const { customerId, subscriptionId } = getCustomerPortalInfo()


  const pageData = {
    ...(await getCustomerInfo()),
    keywords: [],
    userAgent: navigator.userAgent,
    userAgentData: navigator.userAgentData.brands.map(({ brand }) => brand),
    user_id: customerId || segment?.user().id(),
    anonymous_id: segment.user().anonymousId(),
  };
  segment.page("Page Viewed", pageData);
}



const cartViewedEvent = async (cart) => {
  const segment = await getSegment();
  const { customerId } = getCustomerPortalInfo()

  try {
    const eventData = {
      cart_id: null,
      products: formatThemeProductsData(cart?.items),
      user_id: customerId || segment.user().id(),
      anonymous_id: segment.user().anonymousId(),
    };

    segment.track("Cart Viewed", eventData);
  } catch (e) {
    console.log(e);
  }
};


const productViewedEvent = async (product) => {
  const productData = formatThemeProductData(product);

  try {
    const eventData = {
      ...productData,
      currency: "USD",
      coupon: "",
      offer: [],
      position: null,
      ...(await getCustomerInfo()),
    };

    const segment = await getSegment();
    segment.track("Product Viewed", eventData);
  } catch (e) {
    console.log(e);
  }
};

const productAddedEvent = async (data) => {
  const { variantId, cart } = data;
  const product = getProductFromCart(cart, variantId);
  const { customerId } = getCustomerPortalInfo()
  const segment = await getSegment();

  try {
    const eventData = {
      brand: product.vendor,
      cart_id: cart.token,
      category: product.product_type,
      currency: cart.currency,
      image_url: product,
      is_addon: null,
      name: product.title,
      offer: product.discounts,
      position: null,
      price: formatProductPrice(product.price),
      product_id: product.id,
      quantity: product.quantity,
      size: product.variant_title,
      sku: product.sku,
      subscription: !!product.selling_plan_allocation,
      url: window.location.href,
      value: formatProductPrice(product.final_line_price),
      variant: product.variant_id,
      wishlist_id: null,
      wishlist_name: null,
      user_id: customerId || segment.user().id(),
      anonymous_id: segment.user().anonymousId(),
    };

    segment.identify()
    segment.track("Product Added to Cart", eventData);
  } catch (e) {
    console.log(e);
  }
};

const productRemovedEvent = async (product) => {
  const { customerId } = getCustomerPortalInfo()
  const segment = await getSegment()

  try {
    const eventData = {
      brand: product.vendor,
      cart_id: cart.token,
      category: product.product_type,
      currency: cart.currency,
      image_url: product,
      is_addon: null,
      name: product.title,
      offer: product.discounts,
      position: null,
      price: formatProductPrice(product.price),
      product_id: product.id,
      quantity: product.quantity,
      size: product.variant_title,
      sku: product.sku,
      url: window.location.href,
      value: formatProductPrice(product.final_line_price),
      user_id: customerId || segment.user().id(),
      anonymous_id: segment.user().anonymousId(),
    };

    segment.track("Product Removed From Cart", eventData, {
      context: getContext(),
    });
  } catch (e) {
    console.log(e);
  }
};

window.shopevents && analytics.subscribe("checkout_started", (event) => {
  segment.track(
    formatEventName(event.name),
    formatCheckoutData(event.data.checkout)
  );
});


window.shopevents && analytics.subscribe("checkout_completed", async (event) => {
  const segment = await getSegment()
  const eventData = {
    affiliation: "Website",
    checkout_id: event.data.checkout.token,
    coupon: event.data.checkout.discountApplications,
    currency: event.data.checkout.currencyCode,
    discount: event.data.checkout.discountApplications,
    products: formatCheckoutData(event.data.checkout.lineItems),
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
  segment.identify()
});


/**
 * 
 * END THEME EVENTS
 */

/**
 * 
 * PORTAL EVENTS
 * 
 */


const productAddedToNextBoxEvent = async (product) => {
  const productData = formatThemeProductData(product);
  try {
    const eventData = {
      ...productData,
      currency: "USD",
      coupon: "",
      offer: [],
      quantity: null,
      size: "",
      value: null,
      variant: "",
    };

    const segment = await getSegment();
    segment.track("Product Added to Next Box", eventData);
  } catch (e) {
    console.log(e);
  }
};

// const accountUpdatedEvent = async (customer) => {
//   let currentCustomer = customer;

//   try {
//     if (!currentCustomer) {
//       currentCustomer = await getCustomerData();
//     }

//     const eventData = {
//       address_account: currentCustomer?.address_account,
//       city_account: currentCustomer?.city_account,
//       country_account: currentCustomer?.country_account,
//       email: currentCustomer?.email,
//       first_name: currentCustomer?.firstName,
//       last_name: currentCustomer?.lastName,
//       name: `${currentCustomer?.firstName} ${currentCustomer?.lastName}`,
//       phone_account: currentCustomer?.phone_account,
//       state_account: currentCustomer?.state_account,
//       zip_account: currentCustomer?.zip_account,
//       ...currentCustomer,
//     };

//     segment = await getSegment();
//     identifyUser(currentCustomer);
//     segment.track("Account Updated", eventData);
//   } catch (e) {
//     console.log(e);
//   }
// };

/**
 *  END PORTAL EVENTS
 */


/**
 * 
 * CLICK EVENTS
 * 
 */

const ctaClickedEvent = async (cta) => {
  const ctaId = cta?.target?.id;
  const ctaText = cta?.target?.innerText || ''
  const ctaType = cta?.target?.dataset?.type;

  // Check if the clicked CTA has both ID and data-type attributes
  if (ctaId && ctaType) {

    const eventData = {
      destination: cta.target.href,
      text: ctaText,
      type: ctaType
    }

    const segment = await getSegment();
    segment.track("CTA Clicked", eventData, {
      context: getContext(),
    });
  }

};

/**
 * 
 * END CLICK EVENTS
 */

/**
 * 
 * UTM UTILS
 * 
 */

const UTM_SOURCE_QUERY = "utm_source";
const UTM_MEDIUM_QUERY = "utm_medium";
const UTM_CAMPAIGN_QUERY = "utm_campaign";
const UTM_CONTENT_QUERY = "utm_content";
const UTM_TERM_QUERY = "utm_term";
const GCLID_QUERY = "gclid";
const OID = "oid";
const AFFID = "affid";

const UTM_QUERY_PARAMS = [
  UTM_SOURCE_QUERY,
  UTM_MEDIUM_QUERY,
  UTM_CAMPAIGN_QUERY,
  UTM_CONTENT_QUERY,
  UTM_TERM_QUERY,
  GCLID_QUERY,
  OID,
  AFFID,
];



function extractUTMParams() {
  const query = new URLSearchParams(location.search);
  const utmSource = query.get(UTM_SOURCE_QUERY);

  if (!utmSource) {
    return undefined;
  }

  return UTM_QUERY_PARAMS.reduce((acc, param) => {
    const value = query.get(param);

    if (!value) {
      return acc;
    }

    acc[param] = query.get(param);
    return acc;
  }, {});
};

function storeUTMParams() {
  const utmParams = extractUTMParams();
  console.log(utmParams);
  if (!utmParams) {
    return;
  }
  sessionStorage.setItem("utmParams", JSON.stringify(utmParams));
};

function getUTMParams() {
  const sessionUtm = sessionStorage.getItem("utmParams");
  console.debug("sessionUtm", sessionUtm);
  const urlUtm = JSON.stringify(extractUTMParams());
  const utmParams = sessionUtm || urlUtm;
  console.debug("sessionUtm", sessionUtm);
  console.debug("urlUtm", urlUtm);

  if (!utmParams) {
    return undefined;
  }

  return JSON.parse(utmParams);
};

function getUTMParamsAsStringArray() {
  const utmParams = getUTMParams();

  if (!utmParams) {
    return undefined;
  }

  return Object.entries(utmParams).reduce((acc, [key, value]) => {
    acc.push(`${key}=${value}`);
    return acc;
  }, []);
};

function removeUMTParams() {
  const utmParams = extractUTMParams();
  const url = new URL(global.location.href);
  if (utmParams) {
    for (let param in utmParams) {
      if (Object.hasOwnProperty.call(utmParams, param)) {
        url.searchParams.delete(param);
      }
    }

    global.history.pushState({}, "", url.toString());
  }
};


function getCustomerPortalInfo() {
  // Retrieve the URL from sessionStorage
  let storedUrl = JSON.parse(sessionStorage.getItem('_attn_'));
  let customerId = null
  let subscriptionId = null

  // Check if the URL is not null or undefined
  if (storedUrl && storedUrl['pd']) {
    var urlParts = storedUrl['pd'].split('/');

    // Find the index of 'customer' and 'subscription'
    var customerIndex = urlParts.indexOf('customer');
    var subscriptionIndex = urlParts.indexOf('subscription');

    // If 'customer' exists
    if (customerIndex !== -1 && urlParts.length > customerIndex + 1) {
      customerId = urlParts[customerIndex + 1].split('?')[0]; // Get customer ID
      console.log("Customer ID: ", customerId);
    } else {
      console.log("Customer ID not found in the URL.");
    }

    // If 'subscription' exists
    if (subscriptionIndex !== -1 && urlParts.length > subscriptionIndex + 1) {
      subscriptionId = urlParts[subscriptionIndex + 1].split('?')[0]; // Get subscription ID
      console.log("Subscription ID: ", subscriptionId);
    } else {
      console.log("Subscription ID not found in the URL.");
    }
  } else {
    console.log("URL not found in sessionStorage.");
  }

  return { customerId, subscriptionId }
};

/**
 * 
 * END UTM UTILS
 * 
 */


/**
 * 
 * GTM UTILS
 * 
 */

(function (w, d, s, l, i) {
  w[l] = w[l] || []; w[l].push({
    'gtm.start':
      new Date().getTime(), event: 'gtm.js'
  }); var f = d.getElementsByTagName(s)[0],
    j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = true; j.src =
      'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f);
})(window, document, 'script', 'dataLayer', 'GTM-MFVKGQH');


document.addEventListener("DOMContentLoaded", function () {
  var iframe = document.createElement('iframe');
  iframe.src = "https://www.googletagmanager.com/ns.html?id=GTM-MFVKGQH";
  iframe.height = "0";
  iframe.width = "0";
  iframe.style.display = "none";
  iframe.style.visibility = "hidden";

  var noscript = document.createElement('noscript');
  noscript.appendChild(iframe);

  // Insert noscript as the first child of the body
  document.body.insertBefore(noscript, document.body.firstChild);
});

/**
 * 
 * END GTM UTILS
 * 
 */