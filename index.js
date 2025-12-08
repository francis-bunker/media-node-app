import express from "express";
import cors from "cors";
import session from "express-session";
import "dotenv/config";
import Posts from "./Posts/routes.js";
import db from "./Database/index.js";
import mongoose from "mongoose";
import Users from "./Users/routes.js";
import MapRoutes from "./maps/routes.js";

const CONNECTION_STRING = process.env.DATABASE_CONNECTION_STRING || "mongodb://127.0.0.1:27017/sm"
mongoose.connect(CONNECTION_STRING);

const app = express()
app.use(
    cors({
        credentials: true,
        origin: process.env.CLIENT_URL || "http://localhost:3000",
    })
);
const sessionOptions = {
    secret: process.env.SESSION_SECRET || "kambaz",
    resave: false,
    saveUninitialized: false,
};
if (process.env.SERVER_ENV !== "development") {
    sessionOptions.proxy = true;
    sessionOptions.cookie = {
        sameSite: "none",
        secure: true,
        //domain: process.env.SERVER_URL,
    };
}
app.use(session(sessionOptions));
app.use(express.json());
Posts(app, db);
Users(app);
MapRoutes(app);
app.get('/hello', (req, res) => { res.send('Hello World!') })
app.listen(4000)