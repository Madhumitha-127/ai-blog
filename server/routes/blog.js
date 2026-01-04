import express from "express";
import Blog from "../models/blog.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/* CREATE BLOG */
router.post("/", auth, async (req, res) => {
  try {
    const blog = await Blog.create({
      title: req.body.title,
      content: req.body.content,
      author: req.user.id
    });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* GET ALL BLOGS */
router.get("/", async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.json(blogs);
});

/* LIKE BLOG */
router.put("/like/:id", auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blog.likes.includes(req.user.id)) {
      return res.status(400).json({ message: "Already liked" });
    }

    blog.likes.push(req.user.id);
    await blog.save();

    res.json(blog);
  } catch (error) {
    console.error("LIKE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});
/* ADD COMMENT */
router.post("/comment/:id", auth, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Comment text required" });
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    blog.comments.push({
      user: req.user.id,
      text
    });

    await blog.save();
    res.json(blog);
  } catch (error) {
    console.error("COMMENT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});
/* UPDATE BLOG */
router.put("/:id", auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    blog.title = req.body.title;
    blog.content = req.body.content;

    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* DELETE BLOG */
router.delete("/:id", auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blog.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await blog.deleteOne();
    res.json({ message: "Blog deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


export default router;
