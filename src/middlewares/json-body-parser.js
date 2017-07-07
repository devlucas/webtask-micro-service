import BodyParser from 'body-parser';

export const Factory = (deps = {}) => {
    const {
        bodyParser = BodyParser
    } = deps;

    return () => bodyParser.json();
};

export default Factory();
