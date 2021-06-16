const authCheck = (req, res, next) => {
  if (!req.user) {
    return res.status(403).json({
      authenticated: false,
    });}
  next();
};

const addToken = (req, res, next) => {
  if (req.user) {
    console.log(req.user)
  };
};

module.exports = {authCheck, addToken}
