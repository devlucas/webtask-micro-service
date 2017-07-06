export default (router, resource) => {
    let endpoints = resource();

    for (let endpoint in endpoints) {
        const { method, address, handler } = endpoints[endpoint];

        router[method](address, handler);
    }

    return router;
};
