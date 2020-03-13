//requiring the express library
const express = require("express");
//setting router variable equal to the express.router method
const router = express.Router();

//requiring auth middlewar
const auth = require("../../middleware/auth");
//requiring our express validator
const { check, validationResult } = require("express-validator");

//requiring our User model
const User = require("../../models/User");
//requiring our Post model
const Post = require("../../models/Post");
//requiring our Profile model
const Profile = require("../../models/Profile");

//@route   POST api/posts
//@desc    Create a post
//@access  Private
router.post(
  "/",
  //setting middleware to authenticate user and check if required data is valid
  [
    auth,
    [
      check("text", "Text is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    //checking if errors occur and logging them if true
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      //setting our user from our User model and disabling the password from being returned
      const user = await User.findById(req.user.id).select("-password");

      //setting a new post object
      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      });

      //setting and saving newPost to database
      const post = await newPost.save();
      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//@route   GET api/posts
//@desc    Get All posts
//@access  Private
router.get("/", auth, async (req, res) => {
  try {
    //setting posts const to all posts sorted by most current posted date
    const posts = await Post.find().sort({ date: -1 });
    //returning our posts
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route   GET api/posts/:id
//@desc    Get specific posts by id
//@access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    //setting post const to specific post by ID
    const post = await Post.findById(req.params.id);
    //check to see if post exists
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    //returning our specific post
    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Server Error");
  }
});

//@route   DELETE api/posts/:id
//@desc    Delete a post by id
//@access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    //setting post const to specific post by ID
    const post = await Post.findById(req.params.id);

    //check to see if post exists
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    //check user to see if its the user that can delete the post - have to set post.user to a string given iuts an object
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not Authorized to delete" });
    }

    //removing specific post
    await post.remove();

    //sending back that the post was deleted
    res.json({ msg: "Post removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Server Error");
  }
});

//@route   PUT api/posts/like/:id
//@desc    Like a post
//@access  Private
router.put("/like/:id", auth, async (req, res) => {
  try {
    //setting post equal to queried post
    const post = await Post.findById(req.params.id);

    //Check if the post has already been liked by this user using the filter method equaling current user to current post being compared
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length > 0
    ) {
      return res.status(400).json({ msg: "Post already liked" });
    }

    //setting new like to a post
    post.likes.unshift({ user: req.user.id });

    //saving new like to the database
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route   PUT api/posts/unlike/:id
//@desc    Unlike a post
//@access  Private
router.put("/unlike/:id", auth, async (req, res) => {
  try {
    //setting post equal to queried post
    const post = await Post.findById(req.params.id);

    //Check if the post has already been liked by this user using the filter method equaling current user to current post being compared
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length ===
      0
    ) {
      return res.status(400).json({ msg: "Post has not yet been liked" });
    }

    //unliking a post
    const removeIndex = post.likes
      .map(like => like.user.toString())
      .indexOf(req.user.id);

    //removing post from array
    post.likes.splice(removeIndex, 1);
    //saving new like to the database
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
