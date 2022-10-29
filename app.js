// npm aincludes
import express from "express"; // npm install express
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
// import _ from "lodash";        // nice string manipulation
// import https from "https";     // for forming external get requests

// local includes
// import * as date from "./src/date.js";

dotenv.config(); // gets the .env data for use with process.env.
const app = express();
app.set("view engine", "ejs"); // using EJS
const port = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true })); // this is for parsing data from html form

// __dirname is only available with CJS. Since I am using ESM I need to get it another way
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// static items like other js or css files will not load unless you define where the server should
//      start looking for those files.
app.use(express.static(path.join(__dirname, "/public")));

// -----------------------------------------------------------------------------------
// ------------------------------- Mongoose Setup ------------------------------------
// -----------------------------------------------------------------------------------
// connect to MongoDB - local connection
mongoose.connect("mongodb://localhost:27017/wikiDB", {
    useNewUrlParser: true,
});
// connect to MongoDB Atlas (the cloud)
// mongoose.connect(
//     "mongodb+srv://" +
//         process.env.MONGODB_USER +
//         ":" +
//         process.env.MONGODB_PASS +
//         "@cluster0.ovomich.mongodb.net/wikiDB?retryWrites=true&w=majority",
//     {
//         useNewUrlParser: true,
//     }
// );

// schema
const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "ERROR: Your article post needs a title."],
    },
    content: {
        type: String,
        required: [true, "ERROR: Your article post needs some content."],
    },
});

// model: mongoose will auto make it plural "posts"
const Article = mongoose.model("Article", articleSchema);

// -----------------------------------------------------------------------------------
// ---------------------------------- Listening --------------------------------------
// -----------------------------------------------------------------------------------
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

// -----------------------------------------------------------------------------------
// --------------------------------- Get Requests ------------------------------------
// -----------------------------------------------------------------------------------
// /articles will return all articles in the collection
app.get("/articles", (req, res) => {
    Article.find((err, articles) => {
        if (err) {
            // console.log(err);
            res.send(err);
        } else {
            // console.log(articles);
            res.send(articles);
        }
    });
});

// -----------------------------------------------------------------------------------
// -------------------------------- Post Requests ------------------------------------
// -----------------------------------------------------------------------------------
