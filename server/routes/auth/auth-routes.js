const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware,
  refreshTokenController,
  updateProfile,
} = require("../../controllers/auth/auth-controller");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/refresh-token", refreshTokenController);
router.put("/update-profile/:userId", authMiddleware, updateProfile);
router.get("/check-auths", authMiddleware, (req, res) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    message: "Authenticated user!",
    user,
  });
});

module.exports = router;
