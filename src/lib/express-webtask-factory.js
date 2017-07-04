import Webtask from 'webtask-tools';

export default (app, deps = {}) => {
    const { $Webtask = Webtask } = deps;

    return () => $Webtask.fromExpress(app);
};
