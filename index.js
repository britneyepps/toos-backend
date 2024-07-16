
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';
import rootRouter from './routes/index.js';


const app = express();
dotenv.config()

app.use(bodyParser.json({ limit: "30mb", extended: true }))
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }))
app.use(cors());
app.use('/', rootRouter);


const PORT = process.env.PORT;

app.listen(PORT, function (err) {
    if (err) console.log("Error in server setup");
    console.log("Server listening on Port", PORT);
})
