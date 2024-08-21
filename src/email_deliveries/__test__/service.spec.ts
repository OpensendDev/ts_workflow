import { IExtensions } from "../../db";
import { mockAdd, mockAll } from "../__mocks__/repository";
import { IEmailDelivery } from "../interfaces";
import EmailDeliveryServices from "../services";

const db = {
  emailDeliveries: {
    all: mockAll,
    add: mockAdd
  }
};
describe('email_deliveries > service', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('addNew > client is empty', async () => {
    const emailDeliveryServices = new EmailDeliveryServices(db as unknown as IExtensions);
    try {
      await emailDeliveryServices.addNew(undefined, 'test@test.com');
    } catch (error) {
      expect(error).toHaveProperty('message', 'client id is empty');
      expect(mockAdd).toHaveBeenCalledTimes(0);
    }
  });

  it('addNew > email is empty', async () => {
    const emailDeliveryServices = new EmailDeliveryServices(db as unknown as IExtensions);
    try {
      await emailDeliveryServices.addNew(1, undefined);
    } catch (error) {
      expect(error).toHaveProperty('message', 'email is empty');
      expect(mockAdd).toHaveBeenCalledTimes(0);
    }
  });

  it('addNew > database throw error', async () => {
    const emailDeliveryServices = new EmailDeliveryServices(db as unknown as IExtensions);
    try {
      mockAdd.mockRejectedValue(new Error('database error'))
      await emailDeliveryServices.addNew(1, 'test@test.com');
    } catch (error) {
      expect(error).toHaveProperty('message', 'database error');
      expect(mockAdd).toHaveBeenCalledTimes(1);
    }
  });

  it('addNew > database return data', async () => {
    const emailDeliveryServices = new EmailDeliveryServices(db as unknown as IExtensions);
    mockAdd.mockResolvedValue({} as IEmailDelivery)
    const data = await emailDeliveryServices.addNew(1, 'test@test.com');
    expect(mockAdd).toHaveBeenCalledTimes(1);
    expect(data).not.toBeNull();
  });
});