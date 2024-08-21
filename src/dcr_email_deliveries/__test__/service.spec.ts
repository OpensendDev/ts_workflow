import { IExtensions } from "../../db";
import { mockAdd, mockAll, mockByClientId, mockUpdate } from "../__mocks__/repository";
import { IDCREmailDelivery } from "../interfaces";
import DCREmailDeliveryServices from "../services";

const db = {
  dcrEmailDeliveries: {
    byClientId: mockByClientId,
    all: mockAll,
    add: mockAdd,
    update: mockUpdate
  }
};
describe('dcr_email_deliveries > service', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('report > client is empty', async () => {
    const dcrEmailDeliveryServices = new DCREmailDeliveryServices(db as unknown as IExtensions);
    try {
      await dcrEmailDeliveryServices.report(undefined);
    } catch (error) {
      expect(error).toHaveProperty('message', 'client id is empty');
      expect(mockUpdate).toHaveBeenCalledTimes(0);
    }
  });

  it('report > database throw error', async () => {
    const dcrEmailDeliveryServices = new DCREmailDeliveryServices(db as unknown as IExtensions);
    try {
      mockUpdate.mockRejectedValue(new Error('database error'))
      await dcrEmailDeliveryServices.report('client id');
    } catch (error) {
      expect(error).toHaveProperty('message', 'database error');
      expect(mockUpdate).toHaveBeenCalledTimes(1);
    }
  });

  it('detailByClientId > database return data', async () => {
    const dcrEmailDeliveryServices = new DCREmailDeliveryServices(db as unknown as IExtensions);
    mockUpdate.mockResolvedValue({} as IDCREmailDelivery)
    const data = await dcrEmailDeliveryServices.report('client id');
    expect(mockUpdate).toHaveBeenCalledTimes(1);
    expect(data).not.toBeNull();
  });

  it('addNew > database throw error', async () => {
    const dcrEmailDeliveryServices = new DCREmailDeliveryServices(db as unknown as IExtensions);
    try {
      mockAdd.mockRejectedValue(new Error('database error'))
      await dcrEmailDeliveryServices.addNew('client id');
    } catch (error) {
      expect(error).toHaveProperty('message', 'database error');
      expect(mockAdd).toHaveBeenCalledTimes(1);
    }
  });

  it('addNew > database return data', async () => {
    const dcrEmailDeliveryServices = new DCREmailDeliveryServices(db as unknown as IExtensions);
    mockAll.mockResolvedValue({} as IDCREmailDelivery)
    const data = await dcrEmailDeliveryServices.addNew('client id');
    expect(mockAdd).toHaveBeenCalledTimes(1);
    expect(data).not.toBeNull();
  });
});