const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    const token = req.header('todo-token');
    if (!token) return res.status(401).send({ msg: "Access Denied" });

    try {
        const verified = jwt.verify(token, process.env.SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).send({ msg: "Not Verified" });
    }
}