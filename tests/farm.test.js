jest.mock('../models', () => ({
  Farm: {
    findAll: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
  },
  User: {
    findByPk: jest.fn(),
  },
  Location: {},
  Storage: {},
}));

const { Farm, User } = require('../models');
const FarmService = require('./farm.service');

describe('FarmService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getAllFarms returns formatted farms', async () => {
    const mockFarms = [
      {
        toJSON: () => ({
          farmID: 1,
          farmName: 'Farm A',
          Storages: [{ typeStorage: 'image', file: 'pic.jpg' }],
        }),
        Storages: [{ typeStorage: 'image', file: 'pic.jpg' }],
      },
    ];
    Farm.findAll.mockResolvedValue(mockFarms);

    const result = await FarmService.getAllFarms();

    expect(Farm.findAll).toHaveBeenCalled();
    expect(result[0]).toHaveProperty('storages');
    expect(result[0].storages).toContain('image:pic.jpg');
  });

  test('createFarm throws if user not farmer', async () => {
    User.findByPk.mockResolvedValue({ type: 'Customer' });

    await expect(FarmService.createFarm(1, {}))
      .rejects.toThrow();
  });

  test('createFarm creates farm for farmer user', async () => {
    User.findByPk.mockResolvedValue({ type: 'Farmer', NID: 1 });
    Farm.create.mockResolvedValue({ farmID: 1, farmName: 'Farm A' });

    const result = await FarmService.createFarm(1, { farmName: 'Farm A' });

    expect(Farm.create).toHaveBeenCalled();
    expect(result).toBeDefined();
  });
});