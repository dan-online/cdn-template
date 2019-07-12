const createError = require("http-errors"),
  express = require("express"),
  path = require("path"),
  session = require("express-session"),
  bodyParser = require("body-parser"),
  cookieParser = require("cookie-parser"),
  logger = require("morgan"),
  helmet = require("helmet"),
  log = require("./tests/logger"),
  compression = require("compression"),
  minify = require("express-minify");

require("./utils/handlers/database");
require("./utils/handlers/custom");

const indexRouter = require("./routes/index");
const cdnRouter = require("./routes/cdn");

const app = express();
log("server");
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const cooky = {
  secret: "work hard",
  resave: true,
  expires: new Date() * 60 * 60 * 24 * 7,
  saveUninitialized: true
};

app.set("trust proxy", 1);
app.use(helmet());
app.use(session(cooky));
app.use(logger("tiny"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());
app.use(
  minify({
    cache: true
  })
);
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/f", cdnRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.reply(err.status || 500, err.message);
});

log("routes");

module.exports = app;
