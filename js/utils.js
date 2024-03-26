const createUniqueId = () => {
    return Number(Math.random()).toString(32).substring(2);
}

export { createUniqueId };