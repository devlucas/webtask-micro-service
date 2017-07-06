import Express from 'express';

export const Factory = (deps = {}) => {
    const {
        express = Express
    } = deps;

    return (routes, callback) => {
        let router = express.Router();

        for (let route in routes) {
            router = callback(router, routes[route]);
        }

        return router;
    };
};

export default Factory();
