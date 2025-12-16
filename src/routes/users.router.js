import { Router } from "express";
import UserManager from "../managers/UserManager.js";

const router = Router();
const userManager = new UserManager("./src/data/users.json");

router.get("/", async (req, res) => {
  const users = await userManager.getUsers();
  res.json(users);
});

router.get("/:username", async (req, res) => {
  const user = await userManager.getUserByUsername(req.params.username);
  user
    ? res.json(user)
    : res.status(404).json({ error: "Usuario no encontrado" });
});

export default router;
