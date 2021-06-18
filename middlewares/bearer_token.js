const jwt = require('jsonwebtoken');
require('dotenv').config({path: './config.env'});
const { verifySession } = require('../utils/helpers');
const serializeToken = async  (req, res, next) => {
    if (req.header('Authorization')) {
        let token = req.header('Authorization').split(' ')[1];
	jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
            req.user = {};
            req.user._id = decoded._id;
	});
	if (await !verifySession(req.user._id)) return res.send({authenticated: false});
	next()
    }else {
        return res.send({authenticated: false});
    };
};

module.exports = serializeToken;
