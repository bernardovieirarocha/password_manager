const crypto = require("crypto");

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash("sha256");
    const hash = sha256.update(password).digest("base64");
    return hash;
};
const generateAuthToken = () => {
    return crypto.randomBytes(30).toString("hex");
};

const getFull_name = (arrayNames) => {
    let name = "";
    arrayNames[0] += " ";
    arrayNames.forEach((element) => {
        name += element;
    });
    return name;
};

module.exports = { generateAuthToken, getHashedPassword,getFull_name };
