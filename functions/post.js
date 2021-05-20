const Post = require("../model/Post");
const Profile = require("../model/Profile");
const Bid = require("../model/Bid");
const mongoose = require('mongoose');

const deletePost = async (req, res) => {
  Post.findByIdAndDelete(req.body.id, function (err, doc) {
    if (err) return res.send(err);
    let update = {
      $pull: { posts: doc._id },
    };
    Profile.findByIdAndUpdate(doc.author, update, function (err, doc) {
      if (err) return res.send(err);
      return res.send({ message: "Post deleted." });
    });
  });
};

const addPost = async (req, res) => {
  if (req.body.tags.length) {
    var data = req.body.tags.split(',');
    var tags = [];
    for (var i = 0; i < data.length; i++){
      tags.push(mongoose.Types.ObjectId(data[i]))
    }
  }

  let postData = {
    authorID: req.user._id,
    content: req.body.content,
    status: "open",
    price: req.body.price,
    photos: req.files[0].location,
    location: {
      type: "Point",
      coordinates: [req.body.lng, req.body.lat],
    },
    tags: tags
  };
  Post.create(postData, function (err, doc) {
    if (req.files){
      for (let i = 0; i < req.files.length; i++){
        doc.photos.push(req.files[i].location)
      }
    }
    doc.save();
    if (err) return res.send(err);
    let update = {
      $push: { posts: doc._id },
    };
    Profile.findByIdAndUpdate(doc.author, update, function (err, doc) {
      if (err) return res.send(err);
      return res.send({ message: "Post created successfully" });
    });
  });
};

const getPost = async (req, res) => {

  try {
    const post = await Post.findById(req.params.id)
    .populate("likes")
    .populate("author")
    .populate("tags")
    .populate("location");

  return res.json(post);
  } catch(err) { console.log(err)}
  
};

const getAllPost = async (req, res) => {
  let local = {
    location: {
      $nearSphere: {
        $geometry: {
          type: "Point",
          coordinates: [-84.43165, 33.75805],
        }, //meters
        $maxDistance: 30 * 1609.34,
      },
    },
  };
  const posts = await Post.find(
    local,
    "content price location timestamp"
  ).populate("author");
  return res.json(posts);
};

const getAllPostHome = async (req, res) => {
  let local = {
    location: {
      $nearSphere: {
        $geometry: {
          type: "Point",
          coordinates: [req.body.lng, req.body.lat],
        }, //meters
        $maxDistance: 30 * 1609.34,
      },
    },
  };
  const posts = await Post.find(
    local
  ).populate("author", "avatar");
  return res.json(posts);
};

const openBid = (req, res) => {
  let data = {
    contractor: req.user._id,
    status: "open",
    content: req.body.message,
    offer: req.body.offer,
  };
  Bid.create(data, function (err, doc) {
    if (err) res.send(err);
    Post.findByIdAndUpdate(
      req.params.id,
      { $push: { bids: doc._id } },
      function (err, doc) {
        if (err) return res.send(err);
        return res.send({ message: "Bid placed." });
      }
    );
  });
};

const deleteBid = (req, res) => {
  let bidId = req.body.bidId;
  Bid.findOneAndDelete(bidId, function (err, doc) {
    if (err) return res.send(err);
    Post.findOneAndUpdate(
      { bids: bidId },
      { $pull: { bids: bidId } },
      function (err, doc) {
        if (err) return res.send(err);
        return res.send({ message: "Bid removed." });
      }
    );
  });
};
module.exports = {
  addPost,
  getPost,
  getAllPost,
  deletePost,
  openBid,
  deleteBid,
  getAllPostHome,
};