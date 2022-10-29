# Wiki REST API

REST API for a basic Wiki site. This uses Express and Mongoose.

This has no actual webpage. This is meant to be accessed through API. I used "Postman" for testing it, and created routes according to REST. This does some error checking but is not fool-proof.

## Routes Available

| HTTP Verbs | /articles                | /articles/:articleTitle           |
|:----------:|:------------------------:|:---------------------------------:|
| **GET**    | Fetches ALL the articles | Fetches THE article :articleTitle |
| **POST**   | Creates ONE new article  | -                                 |
| **PUT**    | -                        | Updates THE article :articleTitle |
| **PATCH**  | -                        | Updates THE article :articleTitle |
| **DELETE** | Deletes ALL the articles | Deletes THE article :articleTitle |

### Route Details
Unless otherwise stated below, no body key/value pairs are needed.

For `/articles/:articleTitle`, the `articleTitle` must match the entire string of an existing article title, although case is ignored.

#### POST `/articles`
-   Needs the following urlencoded key/value pairs in the request body:
    -   title: String
    -   content: String

#### PUT `/articles/:articleTitle`
-   Replaces the entire article document with information in the body of the request.
-   Needs the following urlencoded key/value pairs in the request body:
    -   title: String
    -   content: String

#### PATCH `/articles/:articleTitle`
-   Replaces just the key/value pairs contained within the body of the request. 
-   Needs **ONE** of the following urlencoded key/value pairs in the request body:
    -   title: String
    -   content: String

## Dependencies

-   Node modules - inside project run `npm install`
    -   express
    -   mongoose
    -   dotenv
    -   eslint - if desired for linting
        -   [ESLint Getting Started Guide](https://eslint.org/docs/latest/user-guide/getting-started)
-   MongoDB installed. You will need to install the free community server, as well as mongo shell for local DB testing
    -   Installation files:
        -   https://www.mongodb.com/try/download/community
        -   https://www.mongodb.com/try/download/shell
    -   You will then need to add both to your "PATH" environment variable
    -   You can then start your local MongoDB with the command "mongod", and the shell can be accessed with command "mongosh"
-   Other tools you may wish to have
    -   Studio 3T - free GUI for working with MongoDB
    -   Postman - free tool for testing APIs

## Includes

-   JS includes
    -   express
    -   mongoose
    -   lodash
    -   dotenv
    -   eslint - if desired for linting
        -   [ESLint Getting Started Guide](https://eslint.org/docs/latest/user-guide/getting-started)
-   Mongoose
    -   Connecting to MongoDB Atlas, as well as local (commented out)
    -   CRUD operations
