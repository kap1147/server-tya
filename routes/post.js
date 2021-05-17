const router = require("express").Router();
//Auth Middleware
const authCheck = require("../middlewares/authCheck");

const {upload} = require('../utils/aws-multer-upload')

const {
  addPost,
  getPost,
  getAllPost,
  deletePost,
  openBid,
  deleteBid,
  getAllPostHome,
} = require("../functions/post");

router.post("/", authCheck, upload.array('images', 5), addPost);
router.delete("/", authCheck, deletePost);
router.get("/search", getAllPost);
router.post("/home", getAllPostHome);
router.get("/:id", getPost);
router.post("/:id/bid", authCheck, openBid);
router.delete("/:id/bid", authCheck, deleteBid);

module.exports = router;