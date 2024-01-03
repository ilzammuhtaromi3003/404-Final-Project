const { body, validationResult } = require('express-validator');

const registrationValidationRules = [
  body('full_name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('affiliateCodeInput').optional(),
];

const loginValidationRules = [
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({
    errors: extractedErrors,
  });
};

module.exports = {
  registrationValidationRules,
  loginValidationRules,
  validate,
};
