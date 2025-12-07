import UserDao from "./dao.js";
export default function Users(app) {
    const dao = UserDao();
    const signin = async (req, res) => {
        const { username, password } = req.body;
        const currentUser = await dao.findUserByCredentials(username, password);
        if (currentUser) {
            req.session["currentUser"] = currentUser;
            res.json(currentUser);
        } else {
            res.status(401).json({ message: "Unable to login. Try again later." });
        }
    };
    const signup = async (req, res) => {
        const user = await dao.findUserByUsername(req.body.username);
        if (user) {
            res.status(400).json({ message: "Username already in use" });
            return;
        }
        const { username, password } = req.body;
        const currentUser = await dao.createUser({ username, password });
        req.session["currentUser"] = currentUser;
        res.json(currentUser);
    };
    const signupAdmin = async (req, res) => {
        const user = await dao.findUserByUsername(req.body.username);
        if (user) {
            res.status(400).json({ message: "Username already in use" });
            return;
        }
        const { username, password } = req.body;
        const currentUser = await dao.createAdminUser({ username, password });
        req.session["currentUser"] = currentUser;
        res.json(currentUser);
    }
    const profile = async (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        res.json(currentUser);
    };
    const signout = (req, res) => {
        req.session.destroy();
        res.sendStatus(200);
    };
    const findUserById = async (req, res) => {
        const userId = req.params.userId;
        const user = await dao.findUserById(userId);
        if (user) {
            res.json(user);
        } else {
            res.sendStatus(404);
        }
    };
    app.get("/api/users/profile", profile);
    app.get("/api/users/:userId", findUserById);
    app.post("/api/users/signout", signout);
    app.get("/api/users/profile", profile);

    app.post("/api/users/signin", signin);
    app.post("/api/users/signup", signup);
    app.post("/api/users/signup-admin", signupAdmin);

}