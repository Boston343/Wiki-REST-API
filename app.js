// npm aincludes
import express from "express"; // npm install express
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
// import _ from "lodash"; // nice string manipulation
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
// ------------------------------------ Routes ---------------------------------------
// -----------------------------------------------------------------------------------
app.route("/articles")
    // GET /articles will return all articles in the collection
    .get((req, res) => {
        Article.find((err, articles) => {
            if (err) {
                // console.log(err);
                res.send(err);
            } else {
                // console.log(articles);
                res.send(articles);
            }
        });
    })

    // POST /articles will add a new article specified by the body
    .post((req, res) => {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content,
        });

        newArticle.save((err) => {
            if (err) {
                res.send(err);
            } else {
                res.send("Successfully added your article: " + req.body.title);
            }
        });
    })

    // DELETE /articles will delete all articles from the database
    .delete((req, res) => {
        Article.deleteMany((err) => {
            if (err) {
                res.send(err);
            } else {
                res.send("Successfully deleted all articles.");
            }
        });
    });

// -----------------------------------------------------------------------------------
app.route("/articles/:articleTitle")

    // GET /articles/:articleTitle will fetch this specific article
    .get((req, res) => {
        Article.find(
            {
                title: {
                    // regex for the entire string (not just part matching), and ignoring case
                    $regex: "^" + req.params.articleTitle + "$",
                    $options: "i",
                },
            },
            (err, articles) => {
                if (err) {
                    res.send(err);
                } else {
                    if (!(Array.isArray(articles) && articles.length)) {
                        // if no errors, but no article was found
                        res.send(
                            "The article '" +
                                req.params.articleTitle +
                                "' was not found."
                        );
                    } else {
                        // if article was found
                        res.send(articles);
                    }
                }
            }
        );
    })

    // PUT /articles/:articleTitle will update this specific article - the ENTIRE document
    .put((req, res) => {
        Article.replaceOne(
            {
                title: {
                    // regex for the entire string (not just part matching), and ignoring case
                    $regex: "^" + req.params.articleTitle + "$",
                    $options: "i",
                },
            },
            {
                title: req.body.title,
                content: req.body.content,
            },
            (err, updateResults) => {
                if (err) {
                    res.send(err);
                } else {
                    // check if we actually found the article
                    if (
                        updateResults.acknowledged &&
                        updateResults.matchedCount
                    ) {
                        res.send(
                            "Successfully replaced article: '" +
                                req.params.articleTitle +
                                "', with article: '" +
                                req.body.title +
                                "'"
                        );
                    } else {
                        // command was acknowledged but no match was found
                        res.send(
                            "The article '" +
                                req.params.articleTitle +
                                "' was not found."
                        );
                    }
                }
            }
        );
    })

    // PATCH /articles/:articleTitle will update this specific article - just the content
    .patch((req, res) => {
        Article.updateOne(
            {
                title: {
                    // regex for the entire string (not just part matching), and ignoring case
                    $regex: "^" + req.params.articleTitle + "$",
                    $options: "i",
                },
            },
            { $set: req.body },
            (err, updateResults) => {
                if (err) {
                    res.send(err);
                } else {
                    // check if we actually found the article
                    if (
                        updateResults.acknowledged &&
                        updateResults.matchedCount
                    ) {
                        res.send(
                            "Successfully updated article: " +
                                req.params.articleTitle
                        );
                    } else {
                        // command was acknowledged but no match was found
                        res.send(
                            "The article '" +
                                req.params.articleTitle +
                                "' was not found."
                        );
                    }
                }
            }
        );
    })

    // DELETE /articles/:articleTitle will delete this specific article from the database
    .delete((req, res) => {
        Article.deleteOne(
            {
                title: {
                    // regex for the entire string (not just part matching), and ignoring case
                    $regex: "^" + req.params.articleTitle + "$",
                    $options: "i",
                },
            },
            (err, deleteResults) => {
                console.log(deleteResults);
                if (err) {
                    res.send(err);
                } else {
                    // check if we actually found the article
                    if (
                        deleteResults.acknowledged &&
                        deleteResults.deletedCount
                    ) {
                        res.send(
                            "Successfully deleted article: " +
                                req.params.articleTitle
                        );
                    } else {
                        // command was acknowledged but no match was found
                        res.send(
                            "The article '" +
                                req.params.articleTitle +
                                "' was not found."
                        );
                    }
                }
            }
        );
    });
