import { comparePassword, hashPassword } from "./../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    //destructing all data from body
    const { name, email, password, phone, address, answer } = req.body;

    //validation
    if (!name) {
      return res.send({ message: "Name is required" });
    }
    if (!email) {
      return res.send({ message: "Email is required" });
    }
    if (!password) {
      return res.send({ message: "Password is required" });
    }
    if (!phone) {
      return res.send({ message: "Phone  is required" });
    }
    if (!address) {
      return res.send({ error: "Address is required" });
    }
    if (!answer) {
      return res.send({ error: "Answer is required" });
    }

    //check  user with email feild
    const existingUser = await userModel.findOne({ email });

    //existing user
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Register please Login",
      });
    }
    //register user
    const hashedPassword = await hashPassword(password);

    //save
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer,
    }).save();

    res
      .status(201)
      .send({ success: true, message: "User Register Successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Registration ",
      error,
    });
  }
};

//POST| LOGIN

export const loginController = async (req, res) => {
  console.log("login controller line 65 authcontroller", req.body);
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res
        .status(404)
        .send({ success: false, message: "Invalid email or password" });
    }

    const user = await userModel.findOne({ email });
    console.log(
      " user data in database after finding by email in logincontroller login api line 76 ",
      user
    );
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "Email is not register" });
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return res
        .status(200)
        .send({ success: false, message: "Invalid Password" });
    }
    //token generated by sign method on the basis of _id
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "|||||||||||||||Login successfully|||||||||||||||||||||||",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error in Login", error });
  }
};
//forgot password

export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).send({
        message: "Email  is required",
      });
    }
    if (!answer) {
      res.status(400).send({
        message: "answer  is required",
      });
    }
    if (!newPassword) {
      res.status(400).send({
        message: "newPassword  is required",
      });
    }
    //check

    const user = await userModel.findOne({ email, answer });

    //validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong Email or Answer",
      });
    }

    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    res
      .status(200)
      .send({ success: true, message: "Password reset Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};
//test controller

export const testController = (req, res) => {
  res.send("Protected route//////////");
};