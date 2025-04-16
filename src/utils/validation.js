import {
  allowedGenders,
  allowedLoginFields,
  allowedResetPasswordFields,
  allowedSignUpFields,
  allowedUserFieldUpdate,
} from "../constants.js";
import validator from "validator";

// Signup
const getSignUpValidations = (body) => {
  //validate
  const { firstName, lastName, email, password, age, gender, about, photoUrl } =
    body;
  return [
    {
      valid: firstName,
      message: "Enter First Name",
    },
    {
      valid: lastName,
      message: "Enter Last Name",
    },
    {
      valid: email,
      message: "Enter Email",
    },
    {
      valid: password,
      message: "Enter Password",
    },
    {
      valid: gender,
      message: "Enter Gender",
    },
    {
      valid: age,
      message: "Enter Age",
    },
    {
      valid: about,
      message: "Enter About",
    },
    {
      valid: photoUrl,
      message: "Enter Photourl",
    },
    {
      valid: !(firstName.length < 0 || firstName.length > 15),
      message: "Length of firstName should be between 1 to 15",
    },
    {
      valid: !(lastName.length < 0 || lastName.length > 15),
      message: "Length of lastName should be between 1 to 15",
    },
    {
      valid: validator.isEmail(email || ""),
      message: "Email is not valid",
    },
    {
      valid: validator.isStrongPassword(password || "", {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minSymbols: 1,
        minNumbers: 1,
      }),
      message:
        "Password must be at least 8 characters with uppercase, lowercase, number, and symbol",
    },
    {
      valid: !(age < 18 || age > 60),
      message: "Age must be between 18 to 60",
    },
    {
      valid: allowedGenders.includes(gender),
      message: `Gender must be one of: ${allowedGenders.join(", ")}`,
    },
    {
      valid: about.length <= 200,
      message: `About length exceeds 200`,
    },
    {
      valid: validator.isURL(photoUrl),
      message: `Photo url must be a valid url`,
    },
  ];
};

export const validateSignUpData = (body) => {
  // Validate request body
  if (!body) throw new Error("Request body is missing");

  //validation for invalid fields
  const invalidFields = Object.keys(body).filter((field) => {
    return !allowedSignUpFields.includes(field);
  });
  if (invalidFields.length > 0) {
    throw new Error(`Invalid field : ${invalidFields.join(", ")}`);
  }

  //validation for missing fields
  const isFieldMissing = allowedSignUpFields.every((field) =>
    Object.keys(body).includes(field)
  );
  if (!isFieldMissing) {
    throw new Error("Missing fields in request body");
  }

  //validate fields

  const validations = getSignUpValidations(body);
  for (const check of validations) {
    if (!check.valid) {
      throw new Error(check.message);
    }
  }
};

//Login
const getLoginValidations = (body) => {
  const { email, password } = body;
  return [
    {
      valid: email,
      message: "Enter Email",
    },
    {
      valid: password,
      message: "Enter Password",
    },
    {
      valid: validator.isEmail(email || ""),
      message: "Email is not valid",
    },
  ];
};

export const validateLoginData = (body) => {
  if (!body) throw new Error("Request body is missing");

  const invalidFields = Object.keys(body).filter((field) => {
    return !allowedLoginFields.includes(field);
  });
  if (invalidFields.length > 0) {
    throw new Error(`Invalid fields: ${invalidFields.join(", ")}`);
  }

  const isFieldMissing = allowedLoginFields.every((field) => {
    return Object.keys(body).includes(field);
  });
  if (!isFieldMissing) {
    throw new Error(`Missing fields in request body`);
  }

  const validations = getLoginValidations(body);

  for (const check of validations) {
    if (!check.valid) {
      throw new Error(check.message);
    }
  }
};

//update profile
const getUpdateUserValidation = (body) => {
  const { firstName, lastName, gender, photoUrl, about } = body;
  const fields = Object.keys(body);
  if (fields.length === 0) {
    throw new Error("Request body fields are missing");
  }
  const validations = [];

  if ("firstName" in body) {
    if (!firstName || firstName.trim() === "") {
      validations.push({ valid: false, message: "First Name cannot be empty" });
    }
  }
  if ("lastName" in body) {
    if (!lastName || lastName === "") {
      validations.push({ valid: false, message: "Last Name cannot be empty" });
    }
  }
  if ("gender" in body) {
    if (!allowedGenders.includes(gender)) {
      validations.push({ valid: false, message: "Invalid Gender" });
    }
  }
  if ("photoUrl" in body) {
    if (!validator.isURL(photoUrl) || "") {
      validations.push({ valid: false, message: "Invlaid URL" });
    }
  }

  return validations;
};

export const validateUpdateProfileData = (req) => {
  const body = req.body;
  const userId = req.params.userId;
  if (!body) throw new Error("Request body is missing");
  if (!userId) throw new Error("Cannot find userId param");

  const invalidFields = Object.keys(body).filter(
    (field) => !allowedUserFieldUpdate.includes(field)
  );
  if (invalidFields.length > 0)
    throw new Error(`Invalid fields: ${invalidFields.join(", ")}`);

  const validations = getUpdateUserValidation(body);

  for (const check of validations) {
    if (!check.valid) {
      throw new Error(check.message);
    }
  }
};

export const validateResetPassword = (req) => {
  if (!req.body) throw new Error("Request body is missing");
  const body = req.body;

  const fields = Object.keys(body);

  const invalidFields = fields.filter(
    (field) => !allowedResetPasswordFields.includes(field)
  );
  if (invalidFields.length > 0) {
    throw new Error(`Invalid Fields : ${invalidFields.join(", ")}`);
  }

  const isMissingFields = allowedResetPasswordFields.filter(
    (field) => !fields.includes(field)
  );
  if (isMissingFields.length > 0)
    throw new Error(`Missing fields : ${isMissingFields.join(", ")}`);

  const { currentPassword, newPassword, confirmPassword } = body;

  const validation = [
    { valid: currentPassword, message: "currentPassword should not be empty" },
    { valid: newPassword, message: "newPassword should not be empty" },
    { valid: confirmPassword, message: "confirmPassword should not be empty" },
    {
      valid: validator.isStrongPassword(newPassword, {
        minLength: 8,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1,
      }),
      message: "Password is invalid",
    },
    {
      valid: newPassword === confirmPassword,
      message: "new and confirm password is not matched",
    },
  ];

  for (const check of validation) {
    if (!check.valid) {
      throw new Error(check.message);
    }
  }
};
