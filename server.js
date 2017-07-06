import Http from 'http';

import App from '~/app';

const [ app, port ] = [ App(), process.argv[2] || 8080 ];

console.log(`Listening on port ${port}`);

app.server = Http.createServer(app);
app.server.listen(port);
