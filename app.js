import express from 'express';
import https from 'https'
import fs from 'fs'

const app = express();
const port = 9057

app.disable('x-powered-by');

app.use('/public', express.static('public'));
app.use('/', express.static('dist'));



if (process.env.NODE_ENV == "production") {

} else {
    const options = {
        key: fs.readFileSync('./key/private.pem'),
        cert: fs.readFileSync('./key/public.pem')
    };

    const server = https.createServer(options, app);

    server.listen(port, () => {
      console.log("HTTPS server listening on port " + port);
    });
}    

// app.listen(port, err => {
//     console.log(`[ + ] The server is running.`);
// });