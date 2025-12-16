import fs from "fs";

export default class UserManager {
  constructor(path) {
    this.path = path;
  }

  async getUsers() {
    if (!fs.existsSync(this.path)) return [];
    return JSON.parse(await fs.promises.readFile(this.path, "utf-8"));
  }

  async getUserByUsername(username) {
    const users = await this.getUsers();
    return users.find(u => u.username === username);
  }
}
