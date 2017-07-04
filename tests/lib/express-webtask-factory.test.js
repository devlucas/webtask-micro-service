import { describe, it } from 'mocha';
import { expect } from 'chai';
import { stub } from 'sinon';

import webtaskFactory from '~/lib/express-webtask-factory';

describe('When factoring the express webtask', () => {

    it('should delegate to Webtask::fromExpress', () => {
        const [ expectedTask, appMock, webtaskMock ] = [ 'expectedTask', 'appMock', { fromExpress: stub() } ];

        const factory = webtaskFactory(appMock, {
            $Webtask: webtaskMock
        });

        webtaskMock.fromExpress.returns(expectedTask);

        expect(factory()).to.equal(expectedTask);
        expect(webtaskMock.fromExpress.withArgs(appMock).calledOnce).to.equal(true);
    });
});
