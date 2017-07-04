const endpoint = '/';

const get = (req, res) => {
    res.send('Hello from get handler!');
};

const post = (req, res) => {
    res.send('Hello from post handler!');
};

export default { endpoint, actions: { get, post } };
