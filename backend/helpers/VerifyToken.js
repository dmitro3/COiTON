const jwt = require("jsonwebtoken");

const VerifyToken = async (req, res, next) => {
    // const token = req.header("auth");
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token === undefined) return res.status(401).json({
        success: false,
        message: "send a valid token"
    });

    const userToken = process.env.ACCESS_TOKEN;
    if (userToken !== token) return res.status(401).json({ success: false, message: "send a valid token" });

    //verify token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, _) => {
        if (err) return res.status(403).json({ success: false, message: "invalid token" });
        next();
    })
}


module.exports = VerifyToken;