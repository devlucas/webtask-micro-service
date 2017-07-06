import Express from 'express';

import MiddlewareBinder from '@/lib/middleware-binder';
import ResourceBinder from '@/lib/resource-binder';
import Mapper from '@/lib/mapper';

import * as Middlewares from '@/middlewares';
import * as Resources from '@/resources';

export const Factory = (deps = {}) => {
    const {
        express = Express,
        mapper = Mapper,
        resourceBinder = ResourceBinder,
        middlewareBinder = MiddlewareBinder,
        resources = Resources,
        middlewares = Middlewares
    } = deps;

    return () => {
        const app = new express();

        app.use('/', mapper(resources, resourceBinder));
        app.use('/', mapper(middlewares, middlewareBinder));

        return app;
    };
};

export default Factory();
