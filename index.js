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
  console.log(utmSource);

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
  let customerId = "";
  let subscriptionId = "";

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

