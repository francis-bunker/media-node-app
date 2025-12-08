import express from "express";
import cors from "cors";
import session from "express-session";
import "dotenv/config";
import Posts from "./Posts/routes.js";
import db from "./Database/index.js";
import mongoose from "mongoose";
import Users from "./Users/routes.js";
import MapRoutes from "./maps/routes.js";
import connectMongoDBSession from "connect-mongodb-session";

const CONNECTION_STRING = process.env.DATABASE_CONNECTION_STRING || "mongodb://127.0.0.1:27017/sm";

mongoose.connect(CONNECTION_STRING);

const MongoDBStore = connectMongoDBSession(session);
const store = new MongoDBStore({
    uri: CONNECTION_STRING,
    collection: "sessions",
});

const app = express();
app.set("trust proxy", 1);
app.use(
    cors({
        credentials: true,
        origin: process.env.CLIENT_URL || "http://localhost:3000",
    })
);

const dev = process.env.SERVER_ENV === "development";

const sessionOptions = {
    secret: process.env.SESSION_SECRET || "sm",
    resave: false,
    saveUninitialized: false,
    proxy: !dev,
    store: dev ? undefined : store,
    cookie: dev
        ? { sameSite: "lax", secure: false }
        : {
              sameSite: "none",
              secure: true,
              maxAge: 1000 * 60 * 60 * 24 * 7,
          },
};

const addPartitionedAttribute = (req, res, next) => {
    const original = res.setHeader.bind(res);

    res.setHeader = (name, value) => {
        if (name === "Set-Cookie") {
            if (Array.isArray(value)) {
                value = value.map(v => v + "; Partitioned");
            } else {
                value = value + "; Partitioned";
            }
        }
        return original(name, value);
    };

    next();
};

app.use(addPartitionedAttribute);
app.use(session(sessionOptions));

app.use(express.json());
Posts(app, db);
Users(app);
MapRoutes(app);

app.listen(4000, () => console.log("Server running on 4000"));
