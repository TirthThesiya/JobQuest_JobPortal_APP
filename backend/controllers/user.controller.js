// bussiness logic like login logout etc
import { User } from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// for register of new users

export const register = async (req, res) => {
  try {
    const { fullName, email, phonNumber, password, Role } = req.body;
    if (!fullName || !email || !phonNumber || !password || !Role) {
      return res.status(400).json({
        message: "Please fill all the fields",
        success: false,
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
        success: false,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      fullName,
      email,
      phonNumber,
      password: hashedPassword,
      Role,
    });

    return res.status(201).json({
      message: "User Account created successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// for login

export const login = async (req, res) => {
  try {
    const { email, password, Role } = req.body;
    if (!email || !password || !Role) {
      return res.status(400).json({
        message: "Please fill all the fields",
        success: false,
      });
    }
    // check the Email is correct or not
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Email or password is incorrect",
        success: false,
      });
    }
    // check the Password is correct or not
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Email or password is incorrect",
        success: false,
      });
    }
    // check the role is correct or not
    if (user.Role !== Role) {
      return res.status(400).json({
        message: "Account doesn't exists with the current role!",
        success: false,
      });
    }
    // if all are correct then return the token
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    user = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      phonNumber: user.phonNumber,
      Role: user.Role,
      Profile: user.Profile,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpsOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome back ${user.fullName}`,
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};

// logout
export const logout = async (req, res) => {
  
};