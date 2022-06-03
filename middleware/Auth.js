const jwt = require("jsonwebtoken")
const secret = require("../auth/secret") // const secret = "blabla..."

module.exports = function (req, res, next) {
    const authToken = req.headers['authorization']

    if (authToken !== undefined) {
        const bearer = authToken.split(" ")
        const token = bearer[1]

        try {
            const decodedInfo = jwt.verify(token, secret)
            
            if (decodedInfo.role == 1) {
                next()
            } else {
                res.status(403)
                res.send("No authorized!")
            }
        } catch (err) {
            res.status(403)
            res.send("No authorized!")
        }
    } else {
        res.status(403)
        res.send("No authorized!")
    }
}