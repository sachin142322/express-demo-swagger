const { Router } = require("express");
const userRouter = Router();
const { getUsers, createUser, deleteUser, updateUser, getUserById, } = require("../controllers/user.controller");
const { createUserValidation, updateUserValidation, otherValidation, } = require("../validators/user.validator");
const { validate } = require("express-validation");
const { authorization, isAuthenticate } = require("../middlewares/auth.middleware");
require("../middlewares/auth.middleware");


userRouter.get("/", validate(otherValidation), isAuthenticate, authorization(["admin"]), getUsers);
userRouter.get("/:userId", validate(otherValidation), isAuthenticate, authorization(["admin", "user"]), getUserById);
userRouter.delete("/:userId", validate(otherValidation), isAuthenticate, authorization(["admin", "user"]), deleteUser);
userRouter.put("/:userId", validate(updateUserValidation), isAuthenticate, authorization(["user"]), updateUser);
userRouter.post("/", validate(createUserValidation), createUser);



exports.userRouter = userRouter;
