const router = require("express").Router();
//Auth Middleware
const auth = require("../middlewares/auth");

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

router.post("/", auth, upload.array('images', 5), addPost);
router.delete("/", auth, deletePost);
router.get("/search", getAllPost);
router.post("/home", getAllPostHome);
router.get("/:id", getPost);
router.post("/:id/bid", auth, openBid);
router.delete("/:id/bid", auth, deleteBid);

module.exports = router;