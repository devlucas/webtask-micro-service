import { describe, it } from 'mocha';
import { expect } from 'chai';
import { stub } from 'sinon';

import bind from '~/lib/resource-binder';

describe('When binding a resource to a route in the router', () => {

    it('should bind a route corresponding to the method, address and handler of the resource', () => {
        const [ router, address, handler ] = [ { get: stub() }, '/hello-world', Symbol('handler') ];

        expect(bind(router, { endpoint: { method: 'get', address, handler } })).to.equal(router);
        expect(router.get.withArgs(address, handler).calledOnce).to.equal(true);
    });
});
