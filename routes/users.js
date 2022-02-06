const express = require("express");
const User = require("../models/user");

const router = express.Router();

router.get("/userProvide", async (req, res, next) => {
    try {
        const provided = await User.findAll();
        if (provided.length === 0) {
            res.send("현재 유저가 없습니다.");
            return;
        }
        const result = JSON.stringify(provided);
        const message = "유저가 제공되었습니다!";
        res.render("CR", { result, message });
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
        res.render("CR", { result, message });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.patch("/userModify/:who", async (req, res, next) => {
    const { name, age, married, comment } = req.body;
    try {
        const params = decodeURIComponent(req.params.who);

        const getOld = async () => {
            const usersBefore = await User.findAll({
                where: { name: params },
            });
            return JSON.stringify(usersBefore[0].dataValues);
        };

        const result1 = await getOld();

        await User.update(
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

        const getNew = async () => {
            const usersAfter = await User.findAll({
                where: { name: params },
            });
            return JSON.stringify(usersAfter[0].dataValues);
        };

        const result2 = await getNew();
        const message = "유저가 변경되었습니다!";

        res.render("UD", { result1, result2, message });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.delete("/userRemove/:who", async (req, res, next) => {
    try {
        const params = decodeURIComponent(req.params.who);

        const getOld = async () => {
            const usersBefore = await User.findAll({
                where: { name: params },
            });

            return JSON.stringify(usersBefore[0].dataValues);
        };

        const result1 = await getOld();

        await User.destroy({
            where: { name: params },
        });

        const getNew = async () => {
            const usersAfter = await User.findAll({
                where: { name: params },
            });
            return JSON.stringify(usersAfter);
        };

        const result2 = await getNew();
        const message = "유저가 삭제되었습니다.";

        res.render("UD", { result1, result2, message });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;
