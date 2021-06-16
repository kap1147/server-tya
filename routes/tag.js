const router = require("express").Router();

/////Functions/////
const { createTag } = require('../functions/tag');
/////Middlewares/////
const {authCheck} = require("../middlewares/auth")
/////ROUTES/////
router.post('/', authCheck, createTag);

module.exports = router;
