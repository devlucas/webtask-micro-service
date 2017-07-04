import Express from 'express';

import MapMiddlewares from '@/lib/middleware-mapper';
import MapRoutes from '@/lib/route-mapper';
import * as Resources from '@/resources';
import * as Middlewares from '@/middlewares';

export const Factory = (deps = {}) => {
    const {
        express = Express,
        mapRoutes = MapRoutes,
        mapMiddlewares = MapMiddlewares,
        resources = Resources,
        middlewares = Middlewares
    } = deps;

    return () => {
        let app = new express();

        app.use('/', mapMiddlewares(middlewares));
        app.use('/', mapRoutes(resources));

        return app;
    };
};

export default Factory();
