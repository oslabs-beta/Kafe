import express from 'express';
import path from 'path';
// import http from 'http';


const PORT: number | string = process.env.PORT || 3000;

const app: express.Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', express.static(path.resolve(__dirname, '../../build')));


app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
});
