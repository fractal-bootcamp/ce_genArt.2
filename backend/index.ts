import "dotenv/config";
import express, { type RequestHandler } from "express";
import {
  authenticateRequest,
  clerkClient,
  clerkMiddleware,
  createClerkClient,
  requireAuth,
} from "@clerk/express";
import prisma from "./client";
import { getOrCreateUser } from "./queries/createUser";

const app = express();

app.use(clerkMiddleware());

const client = createClerkClient({
  secretKey: "sk_test_XIpmlAceHCXfoJLKTCPgoFtOGD6w7NWqMMOkguGxX2",
});

app.get(
  "/protected",
  requireAuth({ signInUrl: "/sign-in" }),
  async (req, res) => {
    const { userId } = req.auth;
    const user = await clerkClient.users.getUser(userId);
    return res.json({ user });
  }
);

// I want to authenticate a request (identify who is sending this request)
// optional authentication
const authMiddleware: RequestHandler = async (req, res, next) => {
  // find the clerk id for that user
  const reqState = await authenticateRequest({
    clerkClient: client,
    request: req,
  });
  const auth = reqState.toAuth();
  const clerkId = auth?.userId;

  // change this behavior to return not found if you wanted to make auth required
  if (!clerkId) {
    console.log("user's not logged in");
    next();
    return;
  }

  // get the user information from clerk
  const clerkUser = await client.users.getUser(clerkId);

  // get the user from the database (or create if don't exist)
  const user = await getOrCreateUser(
    clerkId,
    clerkUser.primaryEmailAddress!.emailAddress,
    clerkUser.fullName!
  );

  console.log(" ???", user);

  // attach the user to the request at req.user
  req.user = user;

  next();
};

app.get("/testAuth", authMiddleware, (req, res) => {
  const authobj = req.auth;
  return res.json(authobj);
});
app.get("/", authMiddleware, (req, res) => {
  res.json("Hello " + req.user?.name);
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
