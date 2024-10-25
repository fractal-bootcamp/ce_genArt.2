import "dotenv/config";
import express from "express";
import { clerkClient, clerkMiddleware, requireAuth } from "@clerk/express";

const app = express();

app.use(clerkMiddleware());

app.get(
  "/protected",
  requireAuth({ signInUrl: "/sign-in" }),
  async (req, res) => {
    const { userId } = req.auth;
    const user = await clerkClient.users.getUser(userId);
    return res.json({ user });
  }
);

app.get("/testAuth", (req, res) => {
  const authobj = req.auth;
  return res.json(authobj);
});
app.get("/", (req, res) => {
  res.json("Hello World");
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
