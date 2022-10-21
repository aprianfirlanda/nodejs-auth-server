const autoBind = require('auto-bind');

class UsersHandler {
  constructor(usersService) {
    this._usersService = usersService;

    autoBind(this);
  }

  async postUserHandler(request, h) {
    const { username, password, fullname } = request.payload;

    const userId = await this._usersService.userRegistration({ username, password, fullname });

    const response = h.response({
      status: 'Success',
      message: 'New user registration successful',
      data: {
        userId,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = UsersHandler;
