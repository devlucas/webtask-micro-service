export default (router, middleware) => {
    router.use(middleware());

    return router;
};
