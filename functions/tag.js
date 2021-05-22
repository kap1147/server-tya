const Tag = require("../models/Tag");

const createTag = async (req, res) => {
	try{
        tagRef = new Tag({
        _id: req.body.id,
        name: req.body.name,
        description: req.body.description
    });
    await tagRef.save();
    res.send("Tag created successfully!")
    }catch(err){
        res.send(err);
    };
	

};

module.exports = { createTag };
