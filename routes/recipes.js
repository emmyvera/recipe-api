import upload from "../libs/multer";

module.exports = (app) => {
  const Recipes = app.db.models.Recipes;
  const Reviews = app.db.models.Reviews;
  const Users = app.db.models.Users;

  app
    .route("/recipes")
    // Get Recipes
    .get((req, res) => {
      /**
       * @api {get} /recipes Get all recipes
       * @apiGroup Recipes
       * @apiSuccess {Object[]} recipes List of recipes
       * @apiSuccess {Number} recipes.id Recipe id
       * @apiSuccess {String} recipes.food_name Recipe name
       * @apiSuccess {String} recipes.description Recipe description
       * @apiSuccess {String} recipes.ingredients Recipe ingredients
       * @apiSuccess {String} recipes.preparation Recipe preparation method
       * @apiSuccess {String} recipes.image_url Image URL
       * @apiSuccess {String} recipes.video_url Video URL
       * @apiSuccess {Number} recipes.views Number of views
       * @apiSuccess {Number} recipes.user_id User id
       * @apiSuccess {Date} recipes.created_at Creation date
       * @apiSuccess {Date} recipes.updated_at Last update date
       * @apiSuccessExample {json} Success
       * HTTP/1.1 200 OK
       * {
       *   "recipes": [
       *     {
       *       "id": 1,
       *       "food_name": "Spaghetti Bolognese",
       *       "description": "A classic Italian pasta dish",
       *       "ingredients": "Spaghetti, ground beef, tomatoes, garlic, onion, olive oil, herbs",
       *       "preparation": "Cook the spaghetti. Prepare the sauce with ground beef and tomatoes.",
       *       "image_url": "http://example.com/image.jpg",
       *       "video_url": "http://example.com/video.mp4",
       *       "views": 100,
       *       "user_id": 1,
       *       "created_at": "2024-06-16T15:29:11.700Z",
       *       "updated_at": "2024-06-16T15:29:11.700Z"
       *     }
       *   ]
       * }
       * @apiErrorExample {json} Error
       * HTTP/1.1 500 Internal Server Error
       */
      Recipes.findAll({
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
        .then((recipes) => {
          res.json({ recipes: recipes });
        })
        .catch((err) => {
          res.json({ message: "An error occured that we can fix" });
        });
    })
    // Create a Recipe
    .post(app.auth.authenticate(), upload.single("image"), (req, res) => {
      /**
       * @api {post} /recipes Create a new recipe
       * @apiGroup Recipes
       * @apiParam {String} food_name Recipe name
       * @apiParam {String} description Recipe description
       * @apiParam {String} ingredients Recipe ingredients
       * @apiParam {String} preparation Recipe preparation method
       * @apiParam {String} [image_url] Image URL
       * @apiParam {String} [video_url] Video URL
       * @apiParamExample {json} Input
       * {
       *   "food_name": "Spaghetti Bolognese",
       *   "description": "A classic Italian pasta dish",
       *   "ingredients": "Spaghetti, ground beef, tomatoes, garlic, onion, olive oil, herbs",
       *   "preparation": "Cook the spaghetti. Prepare the sauce with ground beef and tomatoes.",
       *   "image_url": "http://example.com/image.jpg",
       *   "video_url": "http://example.com/video.mp4"
       * }
       * @apiHeaderExample {json} Header-Example:
       *     {
       *        'Content-Type': 'application/json',
       *         'Authorization': '••••••'
       *     }
       * @apiSuccess {Number} id Recipe id
       * @apiSuccess {String} food_name Recipe name
       * @apiSuccess {String} description Recipe description
       * @apiSuccess {String} ingredients Recipe ingredients
       * @apiSuccess {String} preparation Recipe preparation method
       * @apiSuccess {String} image_url Image URL
       * @apiSuccess {String} video_url Video URL
       * @apiSuccess {Number} views Number of views
       * @apiSuccess {Number} user_id User id
       * @apiSuccess {Date} created_at Creation date
       * @apiSuccess {Date} updated_at Last update date
       * @apiSuccessExample {json} Success
       * HTTP/1.1 200 OK
       * {
       *   "id": 1,
       *   "food_name": "Spaghetti Bolognese",
       *   "description": "A classic Italian pasta dish",
       *   "ingredients": "Spaghetti, ground beef, tomatoes, garlic, onion, olive oil, herbs",
       *   "preparation": "Cook the spaghetti. Prepare the sauce with ground beef and tomatoes.",
       *   "image_url": "http://example.com/image.jpg",
       *   "video_url": "http://example.com/video.mp4",
       *   "views": 0,
       *   "user_id": 1,
       *   "created_at": "2024-06-16T15:29:11.700Z",
       *   "updated_at": "2024-06-16T15:29:11.700Z"
       * }
       * @apiErrorExample {json} Error
       * HTTP/1.1 412 Precondition Failed
       */
      req.body.user_id = req.user.id;

      // Check if an image file is uploaded
      if (req.file) {
        req.body.image_url = `/uploads/images/${req.file.filename}`;
      }

      Recipes.create(req.body)
        .then((result) => {
          res.json(result);
        })
        .catch((error) => {
          res.status(412).json({ msg: error.message });
        });
    });
  // Updated a Recipe
  app.put(
    "/recipes/:id",
    app.auth.authenticate(),
    upload.single("image"),
    (req, res) => {
      /**
     * @api {put} /recipes/:id Update a recipe
     * @apiGroup Recipes
     * @apiParam {String} food_name Recipe name
     * @apiParam {String} description Recipe description
     * @apiParam {String} ingredients Recipe ingredients
     * @apiParam {String} preparation Recipe preparation method
     * @apiParam {String} [image_url] Image URL
     * @apiParam {String} [video_url] Video URL
     * @apiParamExample {json} Input
     * {
     *   "food_name": "Spaghetti Bolognese",
     *   "description": "A classic Italian pasta dish",
     *   "ingredients": "Spaghetti, ground beef, tomatoes, garlic, onion, olive oil, herbs",
     *   "preparation": "Cook the spaghetti. Prepare the sauce with ground beef and tomatoes.",
     *   "image_url": "http://example.com/image.jpg",
     *   "video_url": "http://example.com/video.mp4"
     * }
     * 
     * @apiHeaderExample {json} Header-Example:
       *     {
       *        'Content-Type': 'application/json',
       *         'Authorization': '••••••'
       *     }
       
     * @apiSuccessExample {json} Success
     * HTTP/1.1 204 No Content
     * @apiErrorExample {json} Error
     * HTTP/1.1 412 Precondition Failed
     */
      req.body.user_id = req.user.id;

      // Check if an image file is uploaded
      if (req.file) {
        req.body.image_url = `/uploads/images/${req.file.filename}`;
      }

      Recipes.update(req.body, {
        where: { id: req.params.id, user_id: req.user.id },
      })
        .then((result) => {
          if (result === null) {
            res.json({ msg: "Recipe Not Found" });
          } else {
            res.sendStatus(204);
          }
        })
        .catch((error) => {
          res.status(412).json({ msg: error.message });
        });
    }
  );

  app.get("/recipes/search", (req, res) => {
    /**
     * @api {get} /recipes/search Search for recipes
     * @apiGroup Recipes
     * @apiParam {String} query Search query
     * @apiSuccess {Object[]} recipes List of matching recipes
     * @apiSuccess {Number} recipes.id Recipe id
     * @apiSuccess {String} recipes.food_name Recipe name
     * @apiSuccess {String} recipes.description Recipe description
     * @apiSuccess {String} recipes.ingredients Recipe ingredients
     * @apiSuccess {String} recipes.preparation Recipe preparation method
     * @apiSuccess {String} recipes.image_url Image URL
     * @apiSuccess {String} recipes.video_url Video URL
     * @apiSuccess {Number} recipes.views Number of views
     * @apiSuccess {Number} recipes.user_id User id
     * @apiSuccess {Date} recipes.created_at Creation date
     * @apiSuccess {Date} recipes.updated_at Last update date
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *   "recipes": [
     *     {
     *       "id": 1,
     *       "food_name": "Spaghetti Bolognese",
     *       "description": "A classic Italian pasta dish",
     *       "ingredients": "Spaghetti, ground beef, tomatoes, garlic, onion, olive oil, herbs",
     *       "preparation": "Cook the spaghetti. Prepare the sauce with ground beef and tomatoes.",
     *       "image_url": "http://example.com/image.jpg",
     *       "video_url": "http://example.com/video.mp4",
     *       "views": 100,
     *       "user_id": 1,
     *       "created_at": "2024-06-16T15:29:11.700Z",
     *       "updated_at": "2024-06-16T15:29:11.700Z"
     *     }
     *   ]
     * }
     * @apiErrorExample {json} Error
     * HTTP/1.1 500 Internal Server Error
     * {
     *   "message": "An error occurred while searching for recipes"
     * }
     */
    const query = req.query.query || "";
    Recipes.findAll({
      where: {
        food_name: {
          [app.db.Sequelize.Op.like]: `%${query}%`,
        },
      },
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
          ],
        },
      ],
    })
      .then((recipes) => {
        res.json({ recipes });
      })
      .catch((err) => {
        res
          .status(500)
          .json({ message: "An error occurred while searching for recipes" });
      });
  });

  // Get Recipe Details
  app.get("/recipes/:id", (req, res) => {
    /**
     * @api {get} /recipes/:id Get recipe details
     * @apiGroup Recipes
     * @apiParam {Number} id Recipe id
     * @apiSuccess {Number} id Recipe id
     * @apiSuccess {String} food_name Recipe name
     * @apiSuccess {String} description Recipe description
     * @apiSuccess {String} ingredients Recipe ingredients
     * @apiSuccess {String} preparation Recipe preparation method
     * @apiSuccess {String} [image_url] Image URL
     * @apiSuccess {String} [video_url] Video URL
     * @apiSuccess {Number} views Number of views
     * @apiSuccess {Number} user_id User id
     * @apiSuccess {Date} created_at Creation date
     * @apiSuccess {Date} updated_at Last update date
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *   "id": 1,
     *   "food_name": "Spaghetti Bolognese",
     *   "description": "A classic Italian pasta dish",
     *   "ingredients": "Spaghetti, ground beef, tomatoes, garlic, onion, olive oil, herbs",
     *   "preparation": "Cook the spaghetti. Prepare the sauce with ground beef and tomatoes.",
     *   "image_url": "http://example.com/image.jpg",
     *   "video_url": "http://example.com/video.mp4",
     *   "views": 100,
     *   "user_id": 1,
     *   "created_at": "2024-06-16T15:29:11.700Z",
     *   "updated_at": "2024-06-16T15:29:11.700Z"
     * }
     * @apiError {String} msg Error message
     * @apiErrorExample {json} Recipe Not Found
     * HTTP/1.1 200 OK
     * {
     *   "msg": "Recipe Not Found"
     * }
     * @apiErrorExample {json} Error
     * HTTP/1.1 412 Precondition Failed
     * {
     *   "msg": "Error message"
     * }
     */
    Recipes.findByPk(req.params.id, {
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
          model: Reviews,
          attributes: ["id", "description", "rate"], // Specify which user attributes to include
        },
      ],
    })
      .then((result) => {
        if (result === null) {
          res.json({ msg: "Recipe Not Found" });
        } else {
          res.json(result);
        }
      })
      .catch((error) => {
        res.status(412).json({ msg: error.message });
      });
  });

  // Delete a Recipe
  app.delete("/recipes/:id", app.auth.authenticate(), (req, res) => {
    /**
     * @api {delete} /recipes/:id Delete a recipe
     * @apiGroup Recipes
     * @apiParam {Number} id Recipe id
     * 
    * @apiHeaderExample {json} Header-Example:
    *     {
    *        'Content-Type': 'application/json',
    *         'Authorization': '••••••'
    *     }
       
     * @apiSuccessExample {json} Success
     * HTTP/1.1 204 No Content
     * @apiError {String} msg Error message
     * @apiErrorExample {json} Recipe Not Found
     * HTTP/1.1 200 OK
     * {
     *   "msg": "Recipe Not Found"
     * }
     * @apiErrorExample {json} Error
     * HTTP/1.1 412 Precondition Failed
     * {
     *   "msg": "Error message"
     * }
     */
    Recipes.destroy({ where: { id: req.params.id, user_id: req.user.id } })
      .then((result) => {
        if (result === null) {
          res.json({ msg: "Recipe Not Found" });
        } else {
          res.sendStatus(204);
        }
      })
      .catch((error) => {
        res.status(412).json({ msg: error.message });
      });
  });

  app.get("/recipes/:recipe_id/reviews", (req, res) => {
    /**
     * @api {get} /recipes/:recipe_id/reviews Get reviews for a recipe
     * @apiGroup Reviews
     * @apiParam {Number} recipe_id Recipe id
     * @apiSuccess {Object[]} result List of reviews
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * [
     *   {
     *     "id": 1,
     *     "text": "Great recipe!",
     *     "rating": 5,
     *     "createdAt": "2024-06-18T12:00:00Z",
     *     "updatedAt": "2024-06-18T12:00:00Z"
     *   },
     *   {
     *     "id": 2,
     *     "text": "Awesome dish!",
     *     "rating": 4,
     *     "createdAt": "2024-06-17T12:00:00Z",
     *     "updatedAt": "2024-06-17T12:00:00Z"
     *   }
     * ]
     * @apiError {String} msg Error message
     * @apiErrorExample {json} Error
     * HTTP/1.1 200 OK
     * {
     *   "msg": "Error message"
     * }
     */
    Reviews.findAll({ where: req.params })
      .then((result) => {
        res.json(result);
      })
      .catch((error) => {
        res.json({ msg: error.message });
      });
  });

  app.post(
    "/recipes/:recipe_id/reviews",
    app.auth.authenticate(),
    (req, res) => {
      /**
       * @api {post} /recipes/:recipe_id/reviews Create a review for a recipe
       * @apiGroup Reviews
       * @apiParam {Number} recipe_id Recipe id
       * @apiParam {String} text Review text
       * @apiParam {Number} rating Review rating (1-5)
       * @apiParamExample {json} Input
       * {
       *   "text": "Great recipe!",
       *   "rating": 5
       * }
       * @apiHeaderExample {json} Header-Example:
       *     {
       *        'Content-Type': 'application/json',
       *         'Authorization': '••••••'
       *     }
       * @apiSuccess {Number} id Review id
       * @apiSuccess {String} text Review text
       * @apiSuccess {Number} rating Review rating
       * @apiSuccess {Date} createdAt Review creation date
       * @apiSuccess {Date} updatedAt Review update date
       * @apiSuccessExample {json} Success
       * HTTP/1.1 200 OK
       * {
       *   "id": 1,
       *   "text": "Great recipe!",
       *   "rating": 5,
       *   "createdAt": "2024-06-18T12:00:00Z",
       *   "updatedAt": "2024-06-18T12:00:00Z"
       * }
       * @apiError {String} msg Error message
       * @apiErrorExample {json} Error
       * HTTP/1.1 200 OK
       * {
       *   "msg": "Error message"
       * }
       */
      req.body.user_id = req.user.id;
      Reviews.create(req.body)
        .then((result) => {
          res.json(result);
        })
        .catch((error) => {
          res.json({ msg: error.message });
        });
    }
  );

  app.delete("/reviews/:id", app.auth.authenticate(), (req, res) => {
    /**
     * @api {delete} /reviews/:id Delete a review
     * @apiGroup Reviews
     * @apiParam {Number} id Review id
     * @apiHeaderExample {json} Header-Example:
       *     {
       *        'Content-Type': 'application/json',
       *         'Authorization': '••••••'
       *     }
       
     * @apiSuccessExample {json} Success
     * HTTP/1.1 204 No Content
     * @apiError {String} msg Error message
     * @apiErrorExample {json} Error
     * HTTP/1.1 200 OK
     * {
     *   "msg": "Review Not Found"
     * }
     */
    Reviews.destroy({ where: { id: req.params.id, user_id: req.user.id } })
      .then((result) => {
        if (result === null) {
          res.json({ msg: "Review Not Found" });
        } else {
          res.sendStatus(204);
        }
      })
      .catch((error) => {
        res.json({ msg: error.message });
      });
  });
};
