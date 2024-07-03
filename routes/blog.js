import upload from "../libs/multer";

module.exports = (app) => {
  const Posts = app.db.models.Posts;
  const Comments = app.db.models.Comments;
  const Users = app.db.models.Users;

  app
    .route("/posts")
    .get((req, res) => {
      /**
       * @api {get} /posts Get all posts
       * @apiGroup Posts
       * @apiSuccess {Object[]} posts List of posts
       * @apiSuccess {Number} posts.id Post id
       * @apiSuccess {String} posts.title Post title
       * @apiSuccess {String} posts.description Post description
       * @apiSuccess {String} posts.image_url Post image URL
       * @apiSuccess {String} posts.video_url Post video URL
       * @apiSuccess {Number} posts.views Post views count
       * @apiSuccess {Number} posts.user_id User id associated with the post
       * @apiSuccessExample {json} Success
       * HTTP/1.1 200 OK
       * [
       *   {
       *     "id": 1,
       *     "title": "Sample Post",
       *     "description": "This is a sample post",
       *     "image_url": "http://example.com/image.jpg",
       *     "video_url": "http://example.com/video.mp4",
       *     "views": 100,
       *     "user_id": 1
       *   },
       *   {
       *     "id": 2,
       *     "title": "Another Post",
       *     "description": "This is another sample post",
       *     "image_url": null,
       *     "video_url": null,
       *     "views": 50,
       *     "user_id": 2
       *   }
       * ]
       * @apiErrorExample {json} Error
       * HTTP/1.1 412 Precondition Failed
       */
      Posts.findAll({
        include: [
          {
            model: Users,
            attributes: [
              "id",
              "email",
              "first_name",
              "last_name",
              "phone",
              "image_url",
            ], // Specify which user attributes to include
          },
        ],
      })
        .then((result) => {
          res.json(result);
        })
        .catch((error) => {
          res.status(412).json({ msg: error.message });
        });
    })
    .post(app.auth.authenticate(), upload.single("image"), (req, res) => {
      /**
       * @api {post} /posts Create a new post
       * @apiGroup Posts
       * @apiParam {String} title Post title
       * @apiParam {String} description Post description
       * @apiParam {String} [image_url] Post image URL (optional)
       * @apiParam {String} [video_url] Post video URL (optional)
       * @apiParamExample {json} Input
       * {
       *    "title": "New Post",
       *    "description": "This is a new post",
       *    "image_url": "http://example.com/new_image.jpg",
       *    "video_url": "http://example.com/new_video.mp4"
       * }
       * @apiHeaderExample {json} Header-Example:
       *     {
       *        'Content-Type': 'application/json',
       *         'Authorization': '••••••'
       *     }
       * @apiSuccess {Number} id Post id
       * @apiSuccess {String} title Post title
       * @apiSuccess {String} description Post description
       * @apiSuccess {String} image_url Post image URL
       * @apiSuccess {String} video_url Post video URL
       * @apiSuccess {Number} views Post views count (default: 0)
       * @apiSuccess {Number} user_id User id associated with the post
       * @apiSuccessExample {json} Success
       * HTTP/1.1 200 OK
       * {
       *   "id": 3,
       *   "title": "New Post",
       *   "description": "This is a new post",
       *   "image_url": "http://example.com/new_image.jpg",
       *   "video_url": "http://example.com/new_video.mp4",
       *   "views": 0,
       *   "user_id": 1
       * }
       * @apiErrorExample {json} Error
       * HTTP/1.1 412 Precondition Failed
       */
      req.body.user_id = req.user.id;

      // Check if an image file is uploaded
      if (req.file) {
        req.body.image_url = `/uploads/images/${req.file.filename}`;
      }

      Posts.create(req.body)
        .then((result) => {
          res.json(result);
        })
        .catch((error) => {
          res.status(412).json({ msg: error.message });
        });
    });
  app.get("/posts/:id", (req, res) => {
    /**
     * @api {get} /posts/:id Get a post by ID
     * @apiGroup Posts
     * @apiParam {Number} id Post ID
     * @apiSuccess {Number} id Post id
     * @apiSuccess {String} title Post title
     * @apiSuccess {String} description Post description
     * @apiSuccess {String} image_url Post image URL
     * @apiSuccess {String} video_url Post video URL
     * @apiSuccess {Number} views Post views count
     * @apiSuccess {Number} user_id User id associated with the post
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *   "id": 1,
     *   "title": "Sample Post",
     *   "description": "This is a sample post",
     *   "image_url": "http://example.com/image.jpg",
     *   "video_url": "http://example.com/video.mp4",
     *   "views": 100,
     *   "user_id": 1
     * }
     * @apiErrorExample {json} Error - Post Not Found
     * HTTP/1.1 404 Not Found
     */

    Posts.findByPk(req.params.id, {
      include: [
        {
          model: Users,
          attributes: [
            "id",
            "email",
            "first_name",
            "last_name",
            "phone",
            "image_url",
          ], // Specify which user attributes to include
        },
        {
          model: Comments,
          attributes: ["id", "comment"],
        },
      ],
    })
      .then((result) => {
        if (result) {
          res.json(result);
        } else {
          res.status(404).json({ msg: "Post Not Found" });
        }
      })
      .catch((error) => {
        res.status(412).json({ msg: error.message });
      });
  });

  app.put(
    "/posts/:id",
    app.auth.authenticate(),
    upload.single("image"),
    (req, res) => {
      /**
       * @api {put} /posts/:id Update a post
       * @apiGroup Posts
       * @apiParam {Number} id Post ID
       * @apiParam {String} [title] Post title
       * @apiParam {String} [description] Post description
       * @apiParam {String} [image_url] Post image URL
       * @apiParam {String} [video_url] Post video URL
       * @apiParamExample {json} Input
       * {
       *   "title": "Updated Post Title",
       *   "description": "Updated post description",
       *   "image_url": "http://example.com/updated_image.jpg",
       *   "video_url": "http://example.com/updated_video.mp4"
       * }
       * @apiHeaderExample {json} Header-Example:
       *     {
       *        'Content-Type': 'application/json',
       *         'Authorization': '••••••'
       *     }
       * @apiSuccessExample {json} Success
       * HTTP/1.1 204 No Content
       * @apiErrorExample {json} Error - Post Not Found
       * HTTP/1.1 404 Not Found
       */

      req.body.user_id = req.user.id;

      // Check if an image file is uploaded
      if (req.file) {
        req.body.image_url = `/uploads/images/${req.file.filename}`;
      }

      Posts.update(req.body, {
        where: { id: req.params.id, user_id: req.user.id },
      })
        .then((result) => {
          if (result) {
            res.sendStatus(204);
          } else {
            res.status(404).json({ msg: "Post not found" });
          }
        })
        .catch((error) => {
          res.json({ msg: error.message });
        });
    }
  );

  app.delete("/posts/:id", app.auth.authenticate(), (req, res) => {
    /**
     * @api {delete} /posts/:id Delete a post
     * @apiGroup Posts
     * @apiParam {Number} id Post ID
     * @apiHeaderExample {json} Header-Example:
     *     {
     *        'Content-Type': 'application/json',
     *         'Authorization': '••••••'
     *     }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 204 No Content
     * @apiErrorExample {json} Error - Post Not Found
     * HTTP/1.1 404 Not Found
     */
    Posts.destroy({ where: { id: req.params.id, user_id: req.user.id } })
      .then((result) => {
        if (result) {
          res.sendStatus(204);
        } else res.status(404).json({ msg: "Post  not found" });
      })
      .catch((error) => {
        res.status(412).json({ msg: error.message });
      });
  });

  //TODO
  app.get("/posts/:post_id/comments", (req, res) => {
    /**
     * @api {get} /posts/:post_id/comments Get comments for a post
     * @apiGroup Comments
     * @apiParam {Number} post_id Post ID
     * @apiSuccess {Object[]} comments List of comments
     * @apiSuccess {Number} comments.id Comment ID
     * @apiSuccess {String} comments.comment Comment content
     * @apiSuccess {Number} comments.user_id User ID who posted the comment
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * [
     *   {
     *     "id": 1,
     *     "comment": "This is a comment",
     *     "user_id": 1
     *   },
     *   {
     *     "id": 2,
     *     "comment": "Another comment",
     *     "user_id": 2
     *   }
     * ]
     * @apiErrorExample {json} Error - Comments Not Found
     * HTTP/1.1 404 Not Found
     */
    Comments.findAll({ where: req.params })
      .then((result) => {
        res.json(result);
      })
      .catch((error) => {
        (error) => {
          res.sttatus(412).json({ msg: error.message });
        };
      });
  });

  app.post("/posts/:post_id/comments", app.auth.authenticate(), (req, res) => {
    /**
     * @api {post} /posts/:post_id/comments Create a new comment
     * @apiGroup Comments
     * @apiParam {Number} post_id Post ID
     * @apiParam {String} comment Comment content
     * @apiParamExample {json} Input
     * {
     *    "comment": "This is a new comment"
     *    "post_id": 1
     * }
     * @apiHeaderExample {json} Header-Example:
     *     {
     *        'Content-Type': 'application/json',
     *         'Authorization': '••••••'
     *     }
     * @apiSuccess {Number} id Comment ID
     * @apiSuccess {String} comment Comment content
     * @apiSuccess {Number} user_id User ID who posted the comment
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *    "id": 1,
     *    "comment": "This is a new comment",
     *    "user_id": 1
     * }
     * @apiErrorExample {json} Error
     * HTTP/1.1 400 Bad Request
     */
    req.body.user_id = req.user.id;
    Comments.create(req.body)
      .then((result) => {
        res.json(result);
      })
      .catch((error) => {
        res.json({ msg: error.message });
      });
  });

  app.delete("/comments/:id", app.auth.authenticate(), (req, res) => {
    /**
     * @api {delete} /comments/:id Delete a comment
     * @apiGroup Comments
     * @apiParam {Number} id Comment ID
     * @apiHeaderExample {json} Header-Example:
     *     {
     *        'Content-Type': 'application/json',
     *         'Authorization': '••••••'
     *     }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 204 No Content
     * @apiErrorExample {json} Error - Comment Not Found
     * HTTP/1.1 404 Not Found
     */

    Comments.destroy({ where: { id: req.params.id, user_id: req.user.id } })
      .then((result) => {
        if (result) {
          res.sendStatus(204);
        } else res.status(404).json({ msg: "Comment not found" });
      })
      .catch((error) => res.json({ msg: error.message }));
  });
};
