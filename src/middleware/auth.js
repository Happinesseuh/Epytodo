const jwt = require("jsonwebtoken");

module.exports = {
    checkToken: (req, res, next) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            try {
                const check = jwt.verify(token, process.env.SECRET);
                req.userData = check;
                next();
            } catch (err) {
                return res.status(401).json({
                    msg: 'Token is not valid'
                })
            }
        } catch (err) {
            return res.status(401).json({
                msg: 'No token, authorization denied'
            });
        }
    }
}