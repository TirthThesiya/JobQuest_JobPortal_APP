// bussiness logic like login logout etc
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// for register of new users
export const register = async (req, res) => {
    const { fullName, email, phoneNO, password, Role } = req.body;

    // Check if any field is missing
    if (!fullName || !email || !phoneNO || !password || !Role) {
        return res.status(400).json({
            message: "Please fill all the fields",
            success: false
        });
    }

    try {
        // Hash the password
        const salt = await bcrypt.genSalt(10);  // Generate salt
        const hashedPassword = await bcrypt.hash(password, salt);  // Hash the password

        // Create a new user with hashed password
        const newUser = new User({
            fullName,
            email,
            phoneNO,
            password: hashedPassword,  // Store the hashed password
            Role
        });

        await newUser.save();  // Save the new user to the database

        res.status(201).json({
            message: "User registered successfully",
            success: true
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
            success: false
        });
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
      phoneNo: user.phoneNO,
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
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged Out succesfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// update Profile

export const updateProfile = async (req, res) => {
  try {
    const { fullName, email, phoneNo, bio, Skills } = req.body;
    const file = req.file;
    
    // cloudinary will come here:
    let SkillsArray;

    if (Skills) {
      
       SkillsArray = Skills.split(",");
    }
    const userid = req.id; //it will come from middleware authentication
    let user = await User.findById(userid);
    if (!user) {
      return res.status(400).json({
        message: "User not found!",
        success: false,
      });
    }
    // Updating data
    if(fullName) (user.fullName = fullName)
    if(email) (user.email = email)
    if(phoneNo) (user.phoneNO = phoneNo)
    if(bio) (user.Profile.bio = bio)
    if(SkillsArray) (user.Profile.Skills = SkillsArray)
      

    // resume

    await user.save();

    user = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      phoneNo: user.phoneNO,
      Role: user.Role,
      Profile: user.Profile,
    };

    return res.status(200).json({
      message:"Profile Updated Succesfully",
      user,
      success:true
    })
  } catch (error) {
    console.log(error);
  }
};
