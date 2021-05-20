const authCheck = (req, res, next) => {
  if (!req.user) {
    return res.status(403).json({
      authenticated: false,
    });}
  next();
};

module.exports = authCheck
