import { Validator, ValidatorTemplate } from "./types";

const validatorTemplate = (validator: Validator): ValidatorTemplate => ({
  valid: Object.values(validator).every((value) => value.valid),
  texts: Object.values(validator)
    .filter((value) => !value.valid)
    .map((value) => value.text),
});

const emailValidator = (email: string) => {
  const isNonEmpty = email.length > 0;
  const isValidEmail = !!email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );

  const validator = {
    isNonEmpty: {
      valid: isNonEmpty,
      text: "Email is required",
    },
    isValidEmail: {
      valid: isValidEmail,
      text: "Please enter valid email",
    },
  };

  return validatorTemplate(validator);
};

const usernameValidator = (username: string) => {
  const isMoreThan = username.length > 3;
  const isLessThan = username.length < 21;
  const isAlphanumeric = !!username.match(/^[a-zA-Z0-9_-]+$/);

  const validator = {
    isMoreThan: {
      valid: isMoreThan,
      text: "Username must be more than 3 characters",
    },
    isLessThan: {
      valid: isLessThan,
      text: "Username must be less than 21 characters",
    },
    isAlphanumeric: {
      valid: isAlphanumeric,
      text: "Username must contain only these characters: a-z, A-Z, 0-9, _ and -",
    },
  };

  return validatorTemplate(validator);
};

const passwordValidator = (password: string) => {
  const hasNonAlphaNumeric = /[\W]/.test(password);
  const hasNumeric = /\d/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasMinimumLength = password.length >= 8;

  const validator = {
    hasNonAlphaNumeric: {
      valid: hasNonAlphaNumeric,
      text: "Password must contain at least 1 symbol (!@#$...)",
    },
    hasNumeric: {
      valid: hasNumeric,
      text: "Password must contain at least 1 numeric character",
    },
    hasUppercase: {
      valid: hasUppercase,
      text: "Password must contain at least 1 uppercase character",
    },
    hasLowercase: {
      valid: hasLowercase,
      text: "Password must contain at least 1 lowercase character",
    },
    hasMinimumLength: {
      valid: hasMinimumLength,
      text: "Password must be at least 8 characters long",
    },
  };

  return validatorTemplate(validator);
};

const validators = {
  emailValidator,
  usernameValidator,
  passwordValidator,
};

export default validators;
