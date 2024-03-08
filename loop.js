//DRAWERS
const RESCHEDULE_ORDER = 'Reschedule order';
const PAUSE_SUBSCRIPTION = 'Pause subscription';
const CANCEL_SUBSCRIPTION = 'Before you cancel';

// MODALS
const IMMEDIATE_ORDER = 'Place an Immediate Order';
const SKIP_ORDER = 'Skip order';
const EDIT_PRODUCT = 'Edit product';
const ADD_PRODUCT = 'Add product';

let modalType = null;
let drawerType = null;

// let eventData = {
//     source: 'PORTAL'
// };

let isOpen = null
let purchaseOption = null

const initDrawerButtons = () => {
    const footerBtns = document.querySelectorAll('.loop-drawer-footer button');

    if (footerBtns) {
        const confirmBtn = footerBtns[0];
        const cancelOrCloseBtn = footerBtns[1];

        if (confirmBtn && isOpen !== CANCEL_SUBSCRIPTION) {
            confirmBtn.addEventListener('click', ctaClickEvent);
        }
        if (cancelOrCloseBtn && isOpen === CANCEL_SUBSCRIPTION) {
            console.log(cancelOrCloseBtn.textContent);
            cancelOrCloseBtn.addEventListener('click', ctaClickEvent);
        }
    }
}


const initModalButtons = () => {
    const footerBtns = document.querySelectorAll('.loop-modal-footer button');

    if (footerBtns) {
        console.log('footerBtns')
        console.log(isOpen)

        const confirmBtn = footerBtns[0];
        if (confirmBtn && isOpen !== CANCEL_SUBSCRIPTION) {
            console.log('confirmBtn')
            confirmBtn.addEventListener('click', ctaClickEvent);
        }
    }
}


const getIsOpen = () => {
    const isDrawer = !!document.querySelector('.loop-drawer-content');
    const isModal = !!document.querySelector('.loop-modal-content');
    const oneTimeOption = document.querySelector('input#onetime')
    const subscriptionOption = document.querySelector('input#subscription')


    if (isDrawer) {
        const drawerHeader = document.body.querySelector('.loop-drawer-header .loop-h2');

        switch (drawerHeader.textContent) {
            case PAUSE_SUBSCRIPTION:
                isOpen = PAUSE_SUBSCRIPTION;
                break;
            case CANCEL_SUBSCRIPTION:
                isOpen = CANCEL_SUBSCRIPTION;
                break;
            case RESCHEDULE_ORDER:
                isOpen = RESCHEDULE_ORDER;
                break;
            case ADD_PRODUCT:
                isOpen = ADD_PRODUCT;

                if (oneTimeOption && oneTimeOption.checked) {
                    purchaseOption = 'onetime'
                } else if (subscriptionOption && subscriptionOption.checked) {
                    purchaseOption = 'subscription'
                }
                break;
            default:
                isOpen = null;
                purchaseOption = null
        }
        initDrawerButtons();

        return;
    }

    if (isModal) {
        const modalHeader = document.body.querySelector('.loop-modal-header .loop-h2');
        switch (modalHeader.textContent) {
            case IMMEDIATE_ORDER:
                isOpen = IMMEDIATE_ORDER;
                break;
            case SKIP_ORDER:
                isOpen = SKIP_ORDER;
                break;
            default:
                isOpen = null;
        }
        initModalButtons();

        return;
    }
    isOpen = null
    purchaseOption = null
}


const ctaClickEvent = async (e) => {
    console.log('ctaClickEvent', isOpen, purchaseOption)
    let eventName = isOpen

    if (purchaseOption) {
        if (purchaseOption === 'onetime') {
            eventName = 'Add One Time'
        } else if (purchaseOption === 'subscription') {
            eventName = 'Add Subscription'
        }
    } else if (isOpen == CANCEL_SUBSCRIPTION) {
        eventName = 'Cancel Subscription'
    }

    const eventData = {
        text: eventName,
        url: window.location.href,
        type: 'button',
        userId: window?.loopProps?.customer.shopifyId,
        anonymousId: window?.analytics?.user()?.anonymousId(),
    };

    if (isOpen) {
        await window.analytics.track('CTA Clicked', eventData);

    }

}

//     const getDrawerContent = (e) => {
//         const drawerContent = document.querySelector('.loop-drawer-content');

//         if (drawerContent) {
//             switch (drawerType) {
//                 case RESCHEDULE_ORDER:
//                     console.log('inside reschedule order');

//                     break;
//                 case PAUSE_SUBSCRIPTION:
//                     console.log('inside pause subscription')
//                     const pauseDurations = drawerContent.querySelectorAll('.loop-drawer-body input');
//                     const date = drawerContent.querySelector('.loop-drawer-body strong').textContent;
//                     [...pauseDurations].forEach((input, i) => {
//                         const label = pauseDurations[i].nextElementSibling;

//                         if (input.checked) {
//                             eventData.text = `Paused for ${label.textContent}`
//                             eventData.unpause_date = date;
//                         }
//                     });
//                     break;
//                 case CANCEL_SUBSCRIPTION:
//                     console.log('inside cancel subscription')
//                     break;

//                 case EDIT_PRODUCT:
//                     console.log('inside edit product')
//                     break;
//                 case ADD_PRODUCT:
//                     console.log('inside add product')
//                     const radios = drawerContent.querySelectorAll('.loop-drawer-body .loop-form-choice-input');
//                     const quantity = drawerContent.querySelector('.loop-drawer-body input[type="number"]');
//                     const price = drawerContent.querySelectorAll('.loop-drawer-body .loop-text-p1')[0];
//                     const name = drawerContent.querySelector('.loop-drawer-body .loop-h2');
//                     const packSize = drawerContent.querySelector('.loop-drawer-body .loop-form-select');

//                     [...radios].forEach((input, i) => {
//                         const label = radios[i].nextElementSibling;
//                         if (input.checked) {
//                             eventData.text = label.textContent;
//                             eventData.quantity = quantity.value
//                             eventData.price = price.textContent
//                             eventData.name = name.textContent

//                             if (packSize) {
//                                 eventData.packSize = packSize.value
//                             }
//                         }
//                     });
//                     break;

//                 default:
//                     break;
//             }

//         }
//     }


// const modalConfirmClickEvent = (e) => {
//     eventData.type = 'button';
//     eventData = {
//         ...eventData,
//         userId: window?.loopProps?.customer.shopifyId,
//         anonymousId: window?.segment?.user()?.anonymousId(),
//     };
//     window.segment.track(modalType, eventData, { context: getContext() });
//     modalType = null;
//     eventData = {};
// }


// const drawerConfirmClickEvent = (e) => {

//     eventData.type = 'button';
//     eventData = {
//         ...eventData,
//         userId: window?.loopProps?.customer.shopifyId,
//         anonymousId: window?.segment?.user()?.anonymousId(),
//     };

//     window.segment.track(drawerType, eventData, { context: getContext() });
//     drawerType = null;
//     eventData = {};
// }

// const drawerCancelClickEvent = (e) => {
//     if (drawerType === CANCEL_SUBSCRIPTION) {

//         eventData.type = 'button';
//         eventData = {
//             ...eventData,
//             userId: window?.loopProps?.customer.shopifyId,
//             anonymousId: window?.segment?.user()?.anonymousId(),
//         };


//         window.segment.track(drawerType, eventData, { context: getContext() });

//         drawerType = null;
//         eventData = {};
//     }
// }

// const initDrawerButtons = () => {
//     const footerBtns = document.querySelectorAll('.loop-drawer-footer button');

//     if (footerBtns) {
//         const confirmBtn = footerBtns[0];
//         const closeBtn = footerBtns[1];
//         if (confirmBtn) {
//             confirmBtn.addEventListener('click', drawerConfirmClickEvent);
//         }

//         if (closeBtn) {
//             closeBtn.addEventListener('click', drawerCancelClickEvent);
//         }
//     }
// }

// const initModalButtons = () => {
//     const confirmBtn = document.querySelector('.loop-modal-footer button');
//     if (confirmBtn) confirmBtn.addEventListener('click', modalConfirmClickEvent);
// }

document.body.addEventListener('click', (e) => {

    setTimeout(() => {
        getIsOpen();
    }, 300);

    // setTimeout(async () => {
    //     const modalIsOpen = !!document.querySelector('.loop-modal-content');
    //     const drawerIsOpen = !!document.querySelector('.loop-drawer-content');

    //     if (modalIsOpen) {

    //         switch (e.target.id) {
    //             case 'loop-order-card-order-now-btn':
    //                 modalType = IMMEDIATE_ORDER;
    //                 break;
    //             case 'loop-order-card-skip-btn':
    //                 modalType = SKIP_ORDER;
    //                 break;

    //         }
    //         initModalButtons();
    //     }

    //     if (drawerIsOpen) {
    //         switch (e.target.id) {
    //             case 'loop-order-card-reschedule-btn':
    //                 drawerType = RESCHEDULE_ORDER;
    //                 break;
    //             case 'loop-pause-btn':
    //                 drawerType = PAUSE_SUBSCRIPTION;
    //                 break;
    //             case 'loop-cancel-btn':
    //                 drawerType = CANCEL_SUBSCRIPTION;
    //                 break;
    //             default:
    //                 const header = document.querySelector('.loop-drawer-header .loop-h2');
    //                 if (header.textContent.toLowerCase().includes('edit')) {
    //                     drawerType = EDIT_PRODUCT;
    //                 } else {
    //                     drawerType = ADD_PRODUCT;

    //                 }
    //         }
    //         initDrawerButtons();
    //         getDrawerContent();
    //     }
    // }, 300);
});
