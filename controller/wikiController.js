const Article = require("../models/wikiModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const sharp = require("sharp");

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(1080, 1080) // Square images resize heigh and width
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

// Available to both users and authors
exports.getAllArticles = catchAsync(async (req, res, next) => {
  const articles = await Article.find();
  res.status(200).json({
    status: "success",
    results: articles.length,
    data: {
      articles,
    },
  });
});

exports.getOneArticle = catchAsync(async (req, res, next) => {
  const article = await Article.findById(req.params.id);
  if (!article) {
    return next(new AppError("No article found with that id", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      article,
    },
  });
});

// exports.getOneArticle = catchAsync(async (req, res, next) => {
//   const article = await Article.findOne({ title: req.params.title });
//   if (!article) {
//     return next(new Error("No article found with that title"));
//   }
//   res.status(200).json({
//     status: "success",
//     data: {
//       article,
//     },
//   });
// });

// Available to authors only
exports.getAllArticlesByAuthor = catchAsync(async (req, res, next) => {
  const articles = await Article.find({ createdBy: req.user.id }).sort(
    "createdAt"
  );

  res.status(200).json({
    status: "success",
    results: articles.length,
    data: {
      articles,
    },
  });
});

// exports.createArticle = catchAsync(async (req, res, next) => {
//   const { title, content, author } = req.body;
//   req.body.createdBy = req.user.id;
//   // console.log("new")
//   if (!title || !content || !author) {
//     return new AppError("Missing required fields", 400);
//   }

//   const newArticle = await Article.create(
//     { title, content, author },
//     req.body.createdBy
//   );
//   res.status(201).json({
//     status: "success",
//     data: {
//       article: newArticle,
//     },
//   });
// });

exports.createArticle = catchAsync(async (req, res, next) => {
  req.body.createdBy = req.user.id;

  const newArticle = await Article.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      article: newArticle,
    },
  });
});

exports.updateArticle = catchAsync(async (req, res, next) => {
  // Prepare the update object
  const updateData = {};

  // Check if a photo was uploaded
  if (req.file) {
    updateData.photo = `public/img/users/${req.file.filename}`;
  }

  // Include other fields from req.body
  if (req.body.title) {
    updateData.title = req.body.title;
  }

  if (req.body.content) {
    updateData.content = req.body.content;
  }

  // Update the article
  const article = await Article.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!article) {
    return next(new AppError("No article found with that ID", 400));
  }

  res.status(200).json({
    status: "success",
    data: {
      article,
    },
  });
});

exports.deleteArticle = catchAsync(async (req, res, next) => {
  const article = await Article.findByIdAndDelete(req.params.id, {
    user: req.user.id,
  });
  if (!article) {
    return next(new AppError("No article found with that ID", 400));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});
