import express from 'express';
import https from 'https'
import fs from 'fs'

const app = express();
const port = 9056

app.disable('x-powered-by');

app.use('/public', express.static('public'));
app.use('/', express.static('dist'));

const options = {
    key: fs.readFileSync('./key/private.pem'),
    cert: fs.readFileSync('./key/public.pem')
};

if (process.env.NODE_ENV == "production") {
    app.listen(port, err => {
        console.log(`[ + ] The server is running.`);
    });
} else {
    const server = https.createServer(options, app);

    server.listen(port, () => {
      console.log("HTTPS server listening on port " + port);
    });
}