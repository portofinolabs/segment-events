/**
 * Self-invoking function to initialize Segment tracking and intercept navigation changes.
 * @param {Window} global - The global window object.
 */
(function (global) {
    const segment = global.analytics;
    const loopProps = global.loopProps;
    const customer = loopProps.customer;
    const shopifyId = customer.shopifyId;

    function initSegmentTracking() {
        console.log('LOOP ok', shopifyId)
    }

    initSegmentTracking();
}(typeof window !== 'undefined' ? window : this));