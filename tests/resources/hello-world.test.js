import { describe, it } from 'mocha';
import { expect } from 'chai';
import { spy } from 'sinon';

import helloWorld from '~/resources/hello-world';

describe('Hello World resource', () => {

    it('should declare an endpoint at /hello-world for GET operations', () => {
        expect(helloWorld()).to.have.deep.property('sayHello').that.includes({ method: 'get', address: '/hello-world' });
    });

    describe('GET on /hello-world', () => {

        it('should respond with Hello World', () => {
            const response = { end: spy() };

            helloWorld().sayHello.handler({}, response);

            expect(response.end.withArgs('Hello World').calledOnce).to.equal(true);
        });
    });
});
