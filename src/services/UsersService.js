const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');

class UsersService {
  constructor(usersValidator, usersRepository) {
    this._usersValidator = usersValidator;
    this._usersRepository = usersRepository;
  }

  async userRegistration({ username, password, fullname }) {
    await this._usersValidator.validateUserRegistration({ username, password, fullname });

    await this._usersRepository.verifyNewUsername(username);

    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 11);

    return this._usersRepository.addUser({
      id, username, hashedPassword, fullname,
    });
  }
}
module.exports = UsersService;
