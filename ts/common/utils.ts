const createUniqueId = (): string => {
    return Number(Math.random()).toString(32).substring(2);
}

const throttle = (callback: Function, delay: number) :Function => {
    let timer :number;
    return function() {
        if (!timer) {
            timer = setTimeout(() => {
                callback.apply(this, arguments);
                timer = undefined;
            }, delay);
        }
    };
}

type ModalOptions = {
    title?: string,
    confirmText?: string
    cancelText?: string
}

const openModal = (modalTemplate: string, options?: ModalOptions, callback?: Function): void => {
    let title = options ? (options.title ? options.title : "팝업") : "팝업";
    let confirmText = options ? (options.confirmText ? options.confirmText : "확인") : "확인";
    let cancelText = options ? (options.cancelText ? options.cancelText : "취소") : "취소";

    let modalElem: HTMLElement = document.getElementById("modal") || document.createElement("div");
    modalElem.id = "modal";
    modalElem.innerHTML = `
        <div class="modal-title-area"><h4>${title}</h4></div>
        <div class="modal-content-area">${modalTemplate}</div>
        <div class="modal-btn-area">
            <button class="btn-modal-confirm">${confirmText}</button>
            <button class="btn-modal-cancel">${cancelText}</button>
        </div>
    `;

    document.body.appendChild(modalElem);

    let modalBackgroundElem: HTMLElement = document.getElementById("modalBackground") || document.createElement("div");
    modalBackgroundElem.id = "modalBackground";

    document.body.appendChild(modalBackgroundElem);

    document.getElementById("wrapper").style.pointerEvents = "none";

    modalElem.querySelector(".btn-modal-confirm").addEventListener("click", (e) => {
        if (callback) {
            callback(modalElem);
        }
        closeModal();
    });

    modalElem.querySelector(".btn-modal-cancel").addEventListener("click", (e) => {
        closeModal();
    });
}

const closeModal = () => {
    const modalElem: HTMLElement = document.getElementById("modal");
    if (modalElem) {
        modalElem.remove();
    }

    const modalBackgroundElem: HTMLElement = document.getElementById("modalBackground");
    if (modalBackgroundElem) {
        modalBackgroundElem.remove();
    }

    document.getElementById("wrapper").style.pointerEvents = "auto";
}

export { createUniqueId, throttle, openModal };