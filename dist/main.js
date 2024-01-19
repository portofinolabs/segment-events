var $c5L0i$segmentanalyticsnext = require("@segment/analytics-next");


const $f8565ec1cbd1f665$var$traitKey = "ajs_user_traits";
const $f8565ec1cbd1f665$export$4a5f2003196ec3c7 = (name)=>{
    return name.split("_").map((word)=>word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
};
const $f8565ec1cbd1f665$export$28936c37d922dc4c = (products)=>products.map((product)=>({
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
            value: (product.variant.price.amount * product.quantity).toFixed(2)
        }));
const $f8565ec1cbd1f665$var$formatProductData2 = (product)=>({
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
        url: `${window.location.hostname}${product.url}`
    });
const $f8565ec1cbd1f665$export$68561b76b3e86457 = (checkout)=>{
    const { lineItems: lineItems, currencyCode: currency, discountApplications: coupon, token: checkout_id } = checkout;
    return {
        affiliation: "Website",
        source: "becausemarket.com",
        coupon: coupon,
        discount: coupon,
        currency: currency,
        checkout_id: checkout_id,
        products: $f8565ec1cbd1f665$export$28936c37d922dc4c(lineItems)
    };
};
const $f8565ec1cbd1f665$export$34e327c98e0c303 = async ()=>{
    const customer = JSON.parse(await browser.localStorage.getItem($f8565ec1cbd1f665$var$traitKey));
    return {
        email: customer.email,
        first_name: customer.firstName,
        last_name: customer.lastName
    };
};


const $43d7963e56408b24$var$segment = window.segment = (0, $c5L0i$segmentanalyticsnext.AnalyticsBrowser).load({
    writeKey: "bevOsoWqV9duPDtFxcCpLG7DJQbKdbLM"
});
console.log($43d7963e56408b24$var$segment);
function $43d7963e56408b24$var$initialize() {
    const analytics = window.analytics;
    const browser = window.browser;
    analytics.subscribe("checkout_started", (event)=>{
        $43d7963e56408b24$var$segment.track((0, $f8565ec1cbd1f665$export$4a5f2003196ec3c7)(event.name), (0, $f8565ec1cbd1f665$export$68561b76b3e86457)(event.data.checkout));
    });
    analytics.subscribe("checkout_completed", (event)=>{
        const eventData = {
            affiliation: "Website",
            checkout_id: event.data.checkout.token,
            coupon: event.data.checkout.discountApplications,
            currency: event.data.checkout.currencyCode,
            discount: event.data.checkout.discountApplications,
            products: (0, $f8565ec1cbd1f665$export$28936c37d922dc4c)(event.data.checkout.lineItems),
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
            value: (event.data.checkout.lineItems[0].variant.price.amount * event.data.checkout.lineItems[0].quantity).toFixed(2),
            variant: event.data.checkout.lineItems[0].variant.title,
            source: "becausemarket.com"
        };
        $43d7963e56408b24$var$segment.track((0, $f8565ec1cbd1f665$export$4a5f2003196ec3c7)(event.name), eventData);
    });
    analytics.subscribe("page_viewed", async (event)=>{
        let pageData;
        const { navigator: navigator, document: document1 } = event;
        if (document1 && navigator) pageData = {
            title: document1.title,
            path: document1.location.pathname,
            referrer: document1.referrer,
            search: document1.location.search,
            url: document1.location.href,
            keywords: [],
            userAgent: navigator.userAgent,
            userAgentData: []
        };
        const eventData = {
            ...await (0, $f8565ec1cbd1f665$export$34e327c98e0c303)(),
            ...pageData
        };
        $43d7963e56408b24$var$segment.page((0, $f8565ec1cbd1f665$export$4a5f2003196ec3c7)(event.name), eventData);
    });
}
if (document.readyState === "loading") // If document is still loading
document.addEventListener("DOMContentLoaded", $43d7963e56408b24$var$initialize); // Wait for it to finish loading before running initialize
else // Otherwise, if document has already loaded
$43d7963e56408b24$var$initialize(); // Run initialize immediately


//# sourceMappingURL=main.js.map
