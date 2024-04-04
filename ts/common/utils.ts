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

export { createUniqueId, throttle };