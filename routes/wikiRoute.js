const express = require("express");
const wikiController = require("./../controller/wikiController");
const authController = require("../controller/authControler");
const userController = require("../controller/userController");

const router = express.Router();

// Protect all all route after this middleware
router.use(authController.protect);

router.route("/article").get(wikiController.getAllArticles);

router
  .route("/authorArticle")
  .get(
    authController.restrictTo("author"),
    wikiController.getAllArticlesByAuthor
  )
  .post(authController.restrictTo("author"), wikiController.createArticle);

router
  .route("/authorArticle/:id")
  .get(wikiController.getOneArticle)
  .patch(
    authController.restrictTo("author", "admin"),
    userController.uploadUserPhoto,
    wikiController.resizeUserPhoto,
    wikiController.updateArticle
  )
  .delete(
    authController.restrictTo("author", "admin"),
    wikiController.deleteArticle
  );

module.exports = router;
