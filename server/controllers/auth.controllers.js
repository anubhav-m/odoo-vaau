import User from "../models/user.models.js";
import bcryptjs from "bcryptjs";
import { errorThrower, errorSetter } from "../utils/error.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";

export const SignUp = async (req, res, next) => {
  const { username, email, password, role } = req.body;

  try {
    //Server-side Validation
    if (
      !username ||
      !email ||
      !password ||
      !role ||
      username.trim() === "" ||
      email.trim() === "" ||
      password.trim() === "" ||
      role.trim() === ""
    ) {
      errorThrower(400, "All fields are required");
    }

    if (password.length < 5 || password.length > 14) {
      errorThrower(400, "Password must be atleast 5 and atmost 14 characters");
    }

    if (password.includes(" ")) {
      errorThrower(400, "Password cannot contain spaces");
    }

    //username and email validation handled by User model

    //-------------------------------------------------------

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      isFacilityOwner: role === "facility-owner",
    });

    await newUser.save();
    res.status(201).json({
      success: true,
      message: "User signed up successfully",
    });
  } catch (err) {
    if (err.code === 11000) {
      const duplicateField = Object.keys(err.keyPattern)[0];

      if (duplicateField === "username") {
        const usernameError = errorSetter(
          400,
          `${username} - Username not available`
        );
        return next(usernameError);
      } else if (duplicateField === "email") {
        const emailError = errorSetter(400, `${email} is already registered`);
        return next(emailError);
      }
    }
    next(err);
  }
};

export const SignIn = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password || email.trim() === "" || password.trim() === "") {
      errorThrower(400, "All fields are required");
    }

    console.log("[SignIn] Incoming Email:", email);

    const validUser = await User.findOne({ email: email.trim() });

    if (!validUser) {
      console.warn(`[SignIn] No user found with email: ${email}`);
      errorThrower(404, "User not found");
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      console.warn(`[SignIn] Invalid password attempt for email: ${email}`);
      errorThrower(400, "Invalid Password");
    }

    const token = jwt.sign({ id: validUser._id }, JWT_SECRET, {
      expiresIn: "1d",
    });

    const { password: pass, ...rest } = validUser._doc;

    res.status(200).cookie("access_token", token, { httpOnly: true }).json({
      success: true,
      message: "User signed in successfully",
      user: rest,
    });
  } catch (err) {
    next(err);
  }
};

export const Google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user) {
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });
      const { password, ...rest } = user._doc;
      res.status(200).cookie("access_token", token, { httpOnly: true }).json({
        success: true,
        message: "User signed in successfully",
        user: rest,
      });
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePic: googlePhotoUrl,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, JWT_SECRET, {
        expiresIn: "1d",
      });
      const { password, ...rest } = newUser._doc;
      res.status(201).cookie("access_token", token, { httpOnly: true }).json({
        success: true,
        message: "User signed in successfully",
        user: rest,
      });
    }
  } catch (err) {
    next(err);
  }
};
