const UserRegistrationSchema = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const UsersValidator = {

  validateUserRegistration: (payload) => {
    const validationResult = UserRegistrationSchema.validate(payload);

    if (validationResult.error) {
      console.log(validationResult.error.details);
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = UsersValidator;
