require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const wikiRouter = require("./routes/wikiRoute");
const userRouter = require("./routes/userRoutes");
const globalErrorHandler = require("./controller/errorController");
const AppError = require("./utils/appError");

const app = express();
app.use(bodyParser.json());
// app.enable("trust proxy");

// Set security HTTP headers
app.use(helmet())

// Implement CORS
app.use(cors());
// Access-Control-Allow-Origin *
app.options("*", cors());

// Development logging
app.use(morgan("dev"));

// Limit request from same Ip
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from thus IP, please try again in an hour",
});
app.use("/api", limiter);

//  Data sanitization against NoSQL query injection
app.use(mongoSanitize());

app.use(hpp())

// Routes
app.use("/api/v1/wiki", wikiRouter);
app.use("/api/v1/user", userRouter);

// Handling unhandled routes
// For all http methods
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Error handling middleware
app.use(globalErrorHandler);


// Server
module.exports = app;