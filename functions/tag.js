const Tag = require("../models/Tag");

const createTag = async (req, res) => {
  try{
    tagRef = new Tag({
      title: req.body.title,
      desc: req.body.disc
    });
    await tagRef.save();
    res.send("Tag created successfully!")
  }catch(err){
    res.send(err);
  };
};

module.exports = { createTag };
