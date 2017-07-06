export default (router, resource) => {
    for (let endpoint in resource) {
        const { method, address, handler } = resource[endpoint];

        router[method](address, handler);
    }

    return router;
};
