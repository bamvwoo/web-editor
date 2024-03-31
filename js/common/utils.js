const createUniqueId = () => {
    return Number(Math.random()).toString(32).substring(2);
};
const throttle = (callback, delay) => {
    let timer;
    return function () {
        if (!timer) {
            timer = setTimeout(() => {
                callback.apply(this, arguments);
                timer = undefined;
            }, delay);
        }
    };
};
export { createUniqueId, throttle };
