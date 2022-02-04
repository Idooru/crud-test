const express = require("express");
const path = require("path");
const morgan = require("morgan");
const dotenv = require("dotenv");
const nunjucks = require("nunjucks");

const { sequelize } = require("./models");

dotenv.config();
const app = express();

app.set("port", process.env.PORT || 1234);
app.set("view engine", "html");
nunjucks.configure("views", {
    express: app,
    watch: true,
});

const indexRouter = require("./routes");
const userRouter = require("./routes/users");

sequelize
    .sync({ force: false })
    .then(() => {
        console.log("DB 연결 성공");
    })
    .catch((err) => {
        console.error(err);
    });

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/favicon", (req, res) => {
    res.send();
});

app.use("/", indexRouter);
app.use("/", userRouter);

app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url}이 존재하지 않습니다.`);
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
    res.status(err.status || 500);
    res.render("error");
});

app.listen(app.get("port"), () => {
    console.log(`server is running at http://localhost:${app.get("port")}`);
});
