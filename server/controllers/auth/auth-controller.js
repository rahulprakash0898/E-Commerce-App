const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

//register
const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (checkUser)
      return res.json({
        success: false,
        message: "User Already exists with the same email! Please try again",
      });

    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      userName,
      email,
      password: hashPassword,
    });

    await newUser.save();

    const userPayload = {
      id: newUser._id,
      role: newUser.role,
      email: newUser.email,
      userName: newUser.userName,
    };

    const accessToken = jwt.sign(userPayload, "CLIENT_SECRET_KEY", {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign(userPayload, "REFRESH_SECRET_KEY", {
      expiresIn: "7d",
    });

    res
      .cookie("refreshToken", refreshToken, { httpOnly: true, secure: false })
      .status(201)
      .json({
        success: true,
        message: "Registration successful",
        accessToken,
        user: userPayload,
      });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

// login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser)
      return res.json({
        success: false,
        message: "User doesn't exists! Please register first",
      });

    const checkPasswordMatch = await bcrypt.compare(
      password,
      checkUser.password
    );
    if (!checkPasswordMatch)
      return res.json({
        success: false,
        message: "Incorrect password! Please try again",
      });

    const userPayload = {
      id: checkUser._id,
      role: checkUser.role,
      email: checkUser.email,
      userName: checkUser.userName,
    };

    const accessToken = jwt.sign(userPayload, "CLIENT_SECRET_KEY", {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign(userPayload, "REFRESH_SECRET_KEY", {
      expiresIn: "7d",
    });

    res
      .cookie("refreshToken", refreshToken, { httpOnly: true, secure: false })
      .json({
        success: true,
        message: "Logged in successfully",
        accessToken,
        user: {
          email: checkUser.email,
          role: checkUser.role,
          id: checkUser._id,
          userName: checkUser.userName,
        },
      });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

// refresh token
const refreshTokenController = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: "No refresh token provided!",
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, "REFRESH_SECRET_KEY");
    const userPayload = {
      id: decoded.id,
      role: decoded.role,
      email: decoded.email,
      userName: decoded.userName,
    };

    const newAccessToken = jwt.sign(userPayload, "CLIENT_SECRET_KEY", {
      expiresIn: "15m",
    });

    res.json({
      success: true,
      message: "Token refreshed successfully",
      accessToken: newAccessToken,
      user: userPayload,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token!",
    });
  }
};

// logout
const logoutUser = (req, res) => {
  res
    .clearCookie("token")
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json({
      success: true,
      message: "Logged out successfully!",
    });
};

// auth middleware
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  let token = null;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.cookies && (req.cookies.accessToken || req.cookies.token)) {
    token = req.cookies.accessToken || req.cookies.token;
  }

  if (!token)
    return res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });

  try {
    const decoded = jwt.verify(token, "CLIENT_SECRET_KEY");
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });
  }
};

// update profile & password
const updateProfile = async (req, res) => {
  const { userId } = req.params;
  const { userName, oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    if (userName) {
      user.userName = userName;
    }

    if (newPassword) {
      if (!oldPassword) {
        return res.json({
          success: false,
          message: "Please provide current password to change password!",
        });
      }

      const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isPasswordMatch) {
        return res.json({
          success: false,
          message: "Current password is incorrect!",
        });
      }

      user.password = await bcrypt.hash(newPassword, 12);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
      user: {
        email: user.email,
        role: user.role,
        id: user._id,
        userName: user.userName,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error updating profile!",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware,
  refreshTokenController,
  updateProfile,
};

