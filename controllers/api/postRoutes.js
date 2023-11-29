const router = require('express').Router();
const { Post } = require('../../models');
const withAuth = require('../../utils/auth');

// Endpoint to create a post
router.post('/', withAuth, async (req, res) => {
  console.log('Request Body:', req.body);

  try {
    const newPost = await Post.create({
      name: req.body.name,
      post_content: req.body.post_content,
      postUserName: req.session.username,
      user_id: req.session.user_id,
    });

    res.status(200).json(newPost);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

// Endpoint to delete a specific post by ID
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!postData) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    }

    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Endpoint to update a specific post by ID
router.put('/:id', withAuth, async (req, res) => {
  try {
    // Check if the logged-in user has the necessary permissions to update the post
    const post = await Post.findByPk(req.params.id);

    if (!post) {
      // Post not found
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the logged-in user is the author of the post
    if (post.user_id !== req.session.user_id) {
      return res
        .status(403)
        .json({ message: 'You do not have permission to update this post' });
    }

    // Update post data
    const [updatedRows] = await Post.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    // Check if the update was successful
    if (updatedRows === 0) {
      // No rows were updated (post not found)
      return res.status(404).json({ message: 'Post not found' });
    }

    // Send a success response
    res.status(200).json({ message: 'Post updated successfully' });
  } catch (err) {
    // Handle errors
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
