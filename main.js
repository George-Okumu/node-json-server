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



server.listen(PORT, () => {
    console.log(`server started on port: ${PORT}`);
});