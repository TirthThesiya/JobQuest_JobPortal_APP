import { Company } from "../models/company.model.js";

// registeration of company
export const registerCompany = async (req, res) => {
  try {
    const { companyName } = req.body;
    if (!companyName) {
      return res.status(400).json({
        message: "Company name is required",
        success: false,
      });
    }

    let company = await Company.findOne({ name: companyName });
    if (company) {
      return res.status(400).json({
        message: "This Company is already registered",
        success: false,
      });
    }

    company = await Company.create({
      name: companyName,
      userId: req.id,
    });

    return res.status(201).json({
      message: "Company registered Succssfully",
      company,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// getting the company

export const getCompany = async (req, res) => {
  try {
    const userId = req.id; //id of the user who is currentlly logged in
    const companies = await Company.find({ userId });

    if (!companies) {
      return res.status(404).json({
        message: "Companies Not Found!",
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// getting companies by id

export const getCompanyById = async (req, res) => {
  try {
    const companyid = req.params.id;
    const company = await Company.findById(companyid);
    if (!company) {
      return res.status(404).json({
        message: "Company Not Found!",
        success: false,
      });
    }

    return res.status(200).json({
      company,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// update company's info

export const updateCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;
    const file = req.file;
    // cloudinary

    const updateData = { name, description, website, location };

    const company = await Company.findByIdAndUpdate(rwq.params.id, updateData, {
      new: true,
    });
    if (!company) {
      return res.status(404).json({
        message: "Company not found!",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Company Information updated succesfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
