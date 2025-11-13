jest.mock('../models', () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
  },
}));
jest.mock('bcrypt', () => ({
  hash: jest.fn(() => Promise.resolve('hashed-pw')),
  compare: jest.fn(() => Promise.resolve(true)),
}));

const { User } = require('../models');
const bcrypt = require('bcrypt');
const UserService = require('./user.service');

describe('UserService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('registerUser creates new user when username free', async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({ NID: 1, username: 'u1' });

    const result = await UserService.registerUser({ username: 'u1', password: 'p' });

    expect(User.findOne).toHaveBeenCalledWith({ where: { username: 'u1' } });
    expect(bcrypt.hash).toHaveBeenCalled();
    expect(User.create).toHaveBeenCalled();
    expect(result).toMatchObject({ username: 'u1' });
  });

  test('loginUser throws on missing user', async () => {
    User.findOne.mockResolvedValue(null);

    await expect(UserService.loginUser('nope', 'p')).rejects.toThrow('User not found');
  });

  test('loginUser returns user when password ok', async () => {
    User.findOne.mockResolvedValue({ password: 'hashed-pw', username: 'u1' });
    bcrypt.compare.mockResolvedValue(true);

    const u = await UserService.loginUser('u1', 'p');
    expect(u).toBeDefined();
  });
});