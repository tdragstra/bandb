const jwt = require("jsonwebtoken");

const secret =
	process.env.JWT_SECRET || "guh597ghksdjrbowruhgfjoiewjoiefwjfoij";

// Data -> JWT
function toJWT(data) {
	return jwt.sign(data, secret, { expiresIn: "2h" });
}
// JWT -> Data
function toData(token) {
	return jwt.verify(token, secret);
}

module.exports = { toJWT, toData };
