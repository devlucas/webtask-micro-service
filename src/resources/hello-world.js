export default () => {
    const sayHello = { method: 'get', address: '/hello-world', handler: (req, res) => {
        res.end('Hello World');
    }};

    return { sayHello };
};
