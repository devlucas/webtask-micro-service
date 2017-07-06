import { describe, it } from 'mocha';
import { expect } from 'chai';
import { stub } from 'sinon';

import bind from '~/lib/middleware-binder';

describe('When binding a middleware', () => {

    it('should call the use method on router passing the middleware', () => {
        const expectedMiddleware = Symbol('expectedMiddleware');

        const [ router, middleware ] = [
            { use: stub() },
            stub().returns(expectedMiddleware)
        ];

        expect(bind(router, middleware)).to.equal(router);
        expect(router.use.withArgs(expectedMiddleware).calledOnce).to.equal(true);
    });
});
