import upload from "../libs/multer";

module.exports = (app) => {
  const Users = app.db.models.Users;
  const Recipes = app.db.models.Recipes;
  const Posts = app.db.models.Posts;
  app.post("/users", upload.single("image"), (req, res) => {
    /**
     * @api {post} /users Register a new user
     * @apiGroup User
     * @apiParam {String} first_name User first name
     * @apiParam {String} last_name User last name
     * @apiParam {String} phone User phone number
     * @apiParam {String} email User email
     * @apiParam {String} password User password
     * @apiParamExample {json} Input
     *  {
     *     "email":"example1234@example.com",
     *     "first_name":"James",
     *     "last_name":"Doe",
     *     "phone":"08098765432",
     *     "password":"123456789"
     *    }
     * @apiSuccess {Number} id User id
     * @apiSuccess {String} name User name
     * @apiSuccess {String} email User email
     * @apiSuccess {String} password User encrypted password
     * @apiSuccess {Date} updated_at Update's date
     * @apiSuccess {Date} created_at Register's date
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     *  {
     *    “id": 1,
     *    "email":"example1234@example.com",
     *    "first_name":"James",
     *    "last_name":"Doe",
     *    "phone":"08098765432",
     *    "updated_at": "2016-02-10T15:20:11.700Z",
     *    "created_at": "2016-02-10T15:29:11.700Z"
     *  }
     * * @apiErrorExample {json} Register error
     * * HTTP/1.1 412 Precondition Failed */

    // Check if an image file is uploaded
    if (req.file) {
      req.body.image_url = `/uploads/images/${req.file.filename}`;
    }
    Users.create(req.body)
      .then((result) => {
        res.json(result);
      })
      .catch((error) => {
        res.status(412).json({ msg: error.message });
      });
  });

  app
    .route("/user")
    .all(app.auth.authenticate())
    .get((req, res) => {
      /**
       * @api {get} /user Return the authenticated user's data
       * @apiGroup User
       * @apiHeader {String} Authorization Token of authenticated user
       * @apiHeaderExample {json} Header
       * {"Authorization": "JWT xyz.abc.123.hgf"}
       * @apiSuccess {Number} id User id
       * @apiSuccess {String} name User name
       * @apiSuccess {String} email User email
       * @apiSuccessExample {json} Success
       * HTTP/1.1 200 OK
       * {
       *      "id": 1,
       *      "name": "John Connor",
       *      "email": "john@connor.net"
       * }
       * @apiErrorExample {json} Find error
       * HTTP/1.1 412 Precondition Failed
       */

      Users.findByPk(req.user.id, {
        attributes: ["id", "first_name", "last_name", "email", "image_url"],
        include: [
          {
            model: Recipes,
            attributes: [
              "id",
              "food_name",
              "description",
              "image_url",
              "views",
            ], // Specify which user attributes to include
          },

          {
            model: Posts,
            attributes: ["id", "title", "image_url", "views"], // Specify which user attributes to include
          },
        ],
      })
        .then((result) => {
          if (result === null) {
            res.status(404).json({ msg: "User Not Found" });
          } else {
            res.json(result);
          }
        })
        .catch((error) => {
          res.status(412).json({ msg: error.message });
        });
    })
    .put(upload.single("image"), (req, res) => {
      /**
       * @api {put} /users Update a user
       * @apiGroup User
       * @apiParam {String} first_name User first name
       * @apiParam {String} last_name User last name
       * @apiParam {String} phone User phone number
       * @apiParamExample {json} Input
       *  {
       *    "first_name":"James",
       *    "last_name":"Doe",
       *    "phone":"08098765432",
       *  }
       *
       * * @apiErrorExample {json} Update error
       * * HTTP/1.1 412 Precondition Failed */

      // Check if an image file is uploaded
      if (req.file) {
        req.body.image_url = `/uploads/images/${req.file.filename}`;
      }

      Users.update(req.body, { where: { id: req.user.id } })
        .then((result) => {
          if (result === null) {
            res.json({ msg: "Users Not Found" });
          } else {
            res.sendStatus(204);
          }
        })
        .catch((error) => {
          res.status(412).json({ msg: error.message });
        });
    });
};
