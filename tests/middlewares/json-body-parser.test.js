import { describe, it } from 'mocha';
import { expect } from 'chai';
import { stub } from 'sinon';

import { Factory } from '~/middlewares/json-body-parser';

describe('When creating the json body parser middleware', () => {

    it('should return whatever bodyParser json method returns', () => {
        const expectedResult = Symbol('expectedResult');
        const middleware = Factory({ bodyParser: { json: stub().returns(expectedResult) } });

        expect(middleware()).to.equal(expectedResult);
    });
});
