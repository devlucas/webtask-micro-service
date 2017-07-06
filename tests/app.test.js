import { describe, it, beforeEach } from 'mocha';
import { expect } from 'chai';
import { spy, stub } from 'sinon';

import { Factory } from '~/app';

describe('When bootstrapping the app', () => {
    const [ resourcesRouter, middlewaresRouter, resources, middlewares, resourceBinder, middlewareBinder ] = [
        Symbol('expectedResourcesRouter'),
        Symbol('expectedMiddlewaresRouter'),
        Symbol('expectedResources'),
        Symbol('expectedMiddlewares'),
        Symbol('expectedResourceBinder'),
        Symbol('expectedMiddlewareBinder')
    ];

    let app;

    beforeEach(() => {
        let [ mapper, express ] = [ stub(), stub().returns({ use: spy() }) ];

        mapper.withArgs(resources, resourceBinder).returns(resourcesRouter);
        mapper.withArgs(middlewares, middlewareBinder).returns(middlewaresRouter);

        app = Factory({ express, mapper, resourceBinder, middlewareBinder, resources, middlewares })();
    });

    it('should bind resources Router onto the root path', () => {
        expect(app.use.withArgs('/', resourcesRouter).calledOnce).to.equal(true);
    });

    it('should bind middlewares Router onto the root path', () => {
        expect(app.use.withArgs('/', middlewaresRouter).calledOnce).to.equal(true);
    });
});
