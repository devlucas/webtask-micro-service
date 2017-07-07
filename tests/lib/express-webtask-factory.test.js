import { describe, it } from 'mocha';
import { expect } from 'chai';
import { stub } from 'sinon';

import { Factory } from '@/lib/express-webtask-factory';

describe('When creating an express webtask', () => {

    it('should call fromExpress method of webtask passing along the app', () => {
        const [ expectedTask, appMock, webtaskMock ] = [ 'expectedTask', 'appMock', { fromExpress: stub() } ];

        const expressWebtaskFactory = Factory({
            webtask: webtaskMock
        });

        webtaskMock.fromExpress.returns(expectedTask);

        let webtask = expressWebtaskFactory(appMock);

        expect(webtask).to.equal(expectedTask);
        expect(webtaskMock.fromExpress.withArgs(appMock).calledOnce).to.equal(true);
    });
});
