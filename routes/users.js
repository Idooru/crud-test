const express = require("express");
const User = require("../models/user");

const router = express.Router();

router.get("/userProvide", async (req, res, next) => {
    try {
        const provided = await User.findAll();
        if (provided === []) {
            res.send("현재 유저가 없습니다.");
        }
        res.send("Hello");
        // const result = JSON.stringify(provided);
        // const message = "유저가 제공되었습니다!";
        // res.render("show", { result, message });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.post("/userCreate", async (req, res, next) => {
    const { name, age, married, comment } = req.body;
    try {
        const created = await User.create({
            name,
            age,
            married,
            comment,
        });
        const result = JSON.stringify(created);
        const message = "유저가 생성되었습니다!";
        res.render("show", { result, message });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.patch("/userModify/:who", async (req, res, next) => {
    const { name, age, married, comment } = req.body;
    try {
        const params = req.params.who;
        const modified = await User.update(
            {
                name,
                age,
                married,
                comment,
            },
            {
                where: { name: params },
            }
        );
        const result = JSON.stringify(modified);
        const message = "유저가 변경되었습니다!";
        res.render("show", { result, message });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.delete("/userRemove/:who", async (req, res, next) => {
    try {
        const params = req.params.who;
        const removed = await User.destroy({
            where: { name: params },
        });
        const result = JSON.stringify(removed);
        const message = "유저가 삭제되었습니다.";
        res.render("show", { result, message });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;
