const IMMEDIATE_ORDER = 'Immediate Order';
const SKIP_ORDER = 'Skip Order';
const RESCHEDULE_ORDER = 'Re-schedule Order';
const PAUSE_SUBSCRIPTION = 'Pause Subscription';
const CANCEL_SUBSCRIPTION = 'Cancel Subscription';
const EDIT_PRODUCT = 'Edit Product';
const ADD_PRODUCT = 'Add Product';

let modalType = null;
let drawerType = null;

let eventData = {
    source: 'PORTAL'
};

(async () => {
    const getDrawerContent = (e) => {
        const drawerContent = document.querySelector('.loop-drawer-content');

        if (drawerContent) {
            switch (drawerType) {
                case RESCHEDULE_ORDER:
                    console.log('inside reschedule order');

                    break;
                case PAUSE_SUBSCRIPTION:
                    console.log('inside pause subscription')
                    const pauseDurations = drawerContent.querySelectorAll('.loop-drawer-body input');
                    const date = drawerContent.querySelector('.loop-drawer-body strong').textContent;
                    [...pauseDurations].forEach((input, i) => {
                        const label = pauseDurations[i].nextElementSibling;

                        if (input.checked) {
                            eventData.text = `Paused for ${label.textContent}`
                            eventData.unpause_date = date;
                        }
                    });
                    break;
                case CANCEL_SUBSCRIPTION:
                    console.log('inside cancel subscription')
                    break;

                case EDIT_PRODUCT:
                    console.log('inside edit product')
                    break;
                case ADD_PRODUCT:
                    console.log('inside add product')
                    const radios = drawerContent.querySelectorAll('.loop-drawer-body .loop-form-choice-input');
                    const quantity = drawerContent.querySelector('.loop-drawer-body input[type="number"]');
                    const price = drawerContent.querySelectorAll('.loop-drawer-body .loop-text-p1')[0];
                    const name = drawerContent.querySelector('.loop-drawer-body .loop-h2');
                    const packSize = drawerContent.querySelector('.loop-drawer-body .loop-form-select');

                    [...radios].forEach((input, i) => {
                        const label = radios[i].nextElementSibling;
                        if (input.checked) {
                            eventData.text = label.textContent;
                            eventData.quantity = quantity.value
                            eventData.price = price.textContent
                            eventData.name = name.textContent

                            if (packSize) {
                                eventData.packSize = packSize.value
                            }
                        }
                    });
                    break;

                default:
                    break;
            }

        }
    }


    const modalConfirmClickEvent = (e) => {
        eventData.type = 'button';
        eventData = {
            ...eventData,
            userId: window?.loopProps?.customer.shopifyId,
            anonymousId: window?.segment?.user()?.anonymousId(),
        };
        window.segment.track(modalType, eventData, { context: getContext() });
        modalType = null;
        eventData = {};
    }


    const drawerConfirmClickEvent = (e) => {

        eventData.type = 'button';
        eventData = {
            ...eventData,
            userId: window?.loopProps?.customer.shopifyId,
            anonymousId: window?.segment?.user()?.anonymousId(),
        };

        window.segment.track(drawerType, eventData, { context: getContext() });
        drawerType = null;
        eventData = {};
    }

    const drawerCancelClickEvent = (e) => {
        if (drawerType === CANCEL_SUBSCRIPTION) {

            eventData.type = 'button';
            eventData = {
                ...eventData,
                userId: window?.loopProps?.customer.shopifyId,
                anonymousId: window?.segment?.user()?.anonymousId(),
            };


            window.segment.track(drawerType, eventData, { context: getContext() });

            drawerType = null;
            eventData = {};
        }
    }

    const initDrawerButtons = () => {
        const footerBtns = document.querySelectorAll('.loop-drawer-footer button');

        if (footerBtns) {
            const confirmBtn = footerBtns[0];
            const closeBtn = footerBtns[1];
            if (confirmBtn) {
                confirmBtn.addEventListener('click', drawerConfirmClickEvent);
            }

            if (closeBtn) {
                closeBtn.addEventListener('click', drawerCancelClickEvent);
            }
        }
    }

    const initModalButtons = () => {
        const confirmBtn = document.querySelector('.loop-modal-footer button');
        if (confirmBtn) confirmBtn.addEventListener('click', modalConfirmClickEvent);
    }

    document.body.addEventListener('click', async (e) => {

        setTimeout(async () => {
            const modalIsOpen = !!document.querySelector('.loop-modal-content');
            const drawerIsOpen = !!document.querySelector('.loop-drawer-content');

            if (modalIsOpen) {

                switch (e.target.id) {
                    case 'loop-order-card-order-now-btn':
                        modalType = IMMEDIATE_ORDER;
                        break;
                    case 'loop-order-card-skip-btn':
                        modalType = SKIP_ORDER;
                        break;

                }
                initModalButtons();
            }

            if (drawerIsOpen) {
                switch (e.target.id) {
                    case 'loop-order-card-reschedule-btn':
                        drawerType = RESCHEDULE_ORDER;
                        break;
                    case 'loop-pause-btn':
                        drawerType = PAUSE_SUBSCRIPTION;
                        break;
                    case 'loop-cancel-btn':
                        drawerType = CANCEL_SUBSCRIPTION;
                        break;
                    default:
                        const header = document.querySelector('.loop-drawer-header .loop-h2');
                        if (header.textContent.toLowerCase().includes('edit')) {
                            drawerType = EDIT_PRODUCT;
                        } else {
                            drawerType = ADD_PRODUCT;

                        }
                }
                initDrawerButtons();
                getDrawerContent();
            }
        }, 300);
    });





})()