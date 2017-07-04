import { describe, it, beforeEach } from 'mocha';
import { expect } from 'chai';
import { spy, stub } from 'sinon';

import { Factory } from '~/app';

describe('When bootstrapping the app', () => {
    let bootstrap;
    let routeMapStub;
    let middlewareMapStub;

    beforeEach(() => {
        routeMapStub = stub();
        middlewareMapStub = stub();

        bootstrap = Factory({
            express: spy(() => {
                return { use: stub() };
            }),
            mapRoutes: routeMapStub,
            mapMiddlewares: middlewareMapStub
        });
    });

    it('should bind whatever routes are returned by mapRoutes', () => {
        const expectedRouteMap = 'expectedRouteMap';

        routeMapStub.returns(expectedRouteMap);

        let app = bootstrap();

        expect(app.use.withArgs('/', expectedRouteMap).calledOnce).to.equal(true);
    });

    it('should bind whatever middlewares are return by mapMiddlewares', () => {
        const expectedMiddlewareMap = 'expectedMiddlewareMap';

        middlewareMapStub.returns(expectedMiddlewareMap);

        let app = bootstrap();

        expect(app.use.withArgs('/', expectedMiddlewareMap).calledOnce).to.equal(true);
    });
});
