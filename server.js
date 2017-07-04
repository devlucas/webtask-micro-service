import Http from 'http';
import App from '~/app';

const app = App();
const port = process.argv[2] || 8080;

console.log(`Listening on port ${port}`);

app.server = Http.createServer(app);
app.server.listen(port);
