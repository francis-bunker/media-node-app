import { v4 as uuidv4 } from "uuid";
import model from "./model.js";
export default function UserDao() {
    async function createUser(user) {
        const new_user = { ...user, user_type: "regular" };
        const createdUser = await model.create(new_user);
        return createdUser;
    }
    async function createAdminUser(user) {
        const adminUser = { ...user, user_type: "admin" };
        const createdUser = await model.create(adminUser);
        return createdUser;
    }
    async function findUserByUsername(username) {
        return model.findOne({ username });
    }
    async function findUserById(userId) {
        return model.findById(userId);
    }
    const findUserByCredentials = (username, password) => model.findOne({ username, password });
    return {
        createUser,
        findUserByCredentials,
        findUserByUsername,
        findUserById,
        createAdminUser
    };

}