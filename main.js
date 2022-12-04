const http = require("http"); // to run only through http
const fs = require('fs'); // for file reader

const PORT = process.env.PORT || 3000;

// This function reads a json file.
function jsonReader(filePath, cb) {
    fs.readFile(filePath, (err, fileData) => {
        if (err) {
            return cb && cb(err);
        }
        try {
            const object = JSON.parse(fileData);
            return cb && cb(null, object);
        } catch (err) {
            return cb && cb(err);
        }
    });
}

const server = http.createServer(async (req, res) => {

    // : GET all tweets
    if (req.url === "/alltweets" && req.method === "GET") {
        jsonReader("./twitter.json", (err, twitter) => {
            if (err) {
                console.log(err);
                return;
            }
            // set the status code, and content-type
            res.writeHead(200, { "Content-Type": "application/json" });
            // send the data
            res.end(JSON.stringify(twitter));
        });

    }
    // /single/tweet:id : GET
    else if (req.url.match(/\/single\/tweet\/([0-9]+)/) && req.method === "GET") {
        jsonReader("./twitter.json", (err, tweets) => {
            if (err) {
                // if there is error with reading the json file, console log it
                console.log(err);
                return;
            }
            // // get id from url
            const id = req.url.split("/")[3];
            // // get single tweet
            let singletweet = tweets.find((tweet) => tweet.id === parseInt(id));
            if (singletweet) {
                // set the status code, and content-type
                res.writeHead(200, { "Content-Type": "application/json" });
                // send the data
                res.end(JSON.stringify(singletweet));
            } else {
                // set the status code and content-type
                res.writeHead(404, { "Content-Type": "application/json" });
                // send the error
                res.end(JSON.stringify({ message: `Tweet with id ${id} not found` }));
            }

        });

    }
    // /user/:name : GET detailed profile information given user's screen name
    else if (req.url.match(/^\/user\/.+/)[0] && req.method === "GET") {
        jsonReader("./twitter.json", (err, tweets) => {
            if (err) {
                // if there is error with reading the json file, console log it
                console.log(err);
                return;
            }
            // // get id from url
            const name = req.url.split("/")[2];
            console.log(name);
            // // get single tweet
            let singletweet = tweets.find((tweet) => tweet.user.screen_name === name);
            if (singletweet) {
                // set the status code, and content-type
                res.writeHead(200, { "Content-Type": "application/json" });
                // send the data
                res.end(JSON.stringify(singletweet));
            } else {
                // set the status code and content-type
                res.writeHead(404, { "Content-Type": "application/json" });
                // send the error
                res.end(JSON.stringify({ message: `Tweet with username ${name}  not found` }));
            }

        });

    }

    // No route present
    else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Route not found" }));
    }
});

server.listen(PORT, () => {
    console.log(`server started on port: ${PORT}`);
});