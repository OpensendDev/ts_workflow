import { IExtensions } from "../../db";
import { mockAdd, mockAll, mockByClientId } from "../__mocks__/repository";
import { IClient, IClientAdd } from "../interfaces";
import ClientService from "../services";

const db = {
  clients: {
    byClientId: mockByClientId,
    all: mockAll,
    add: mockAdd
  }
};
describe('clients > service', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('detailByClientId > client is empty', async () => {
    const clientService = new ClientService(db as unknown as IExtensions);
    try {
      await clientService.detailByClientId(undefined);
    } catch (error) {
      expect(error).toHaveProperty('message', 'client id is empty');
      expect(mockByClientId).toHaveBeenCalledTimes(0);
    }
  });

  it('detailByClientId > database throw error', async () => {
    const clientService = new ClientService(db as unknown as IExtensions);
    try {
      mockByClientId.mockRejectedValue(new Error('database error'))
      await clientService.detailByClientId('client id');
    } catch (error) {
      expect(error).toHaveProperty('message', 'database error');
      expect(mockByClientId).toHaveBeenCalledTimes(1);
    }
  });

  it('detailByClientId > database return client', async () => {
    const clientService = new ClientService(db as unknown as IExtensions);
    mockByClientId.mockResolvedValue({} as IClient)
    const data = await clientService.detailByClientId('client id');
    expect(mockByClientId).toHaveBeenCalledTimes(1);
    expect(data).not.toBeNull();
  });

  it('all > database throw error', async () => {
    const clientService = new ClientService(db as unknown as IExtensions);
    try {
      mockAll.mockRejectedValue(new Error('database error'))
      await clientService.all();
    } catch (error) {
      expect(error).toHaveProperty('message', 'database error');
      expect(mockAll).toHaveBeenCalledTimes(1);
    }
  });

  it('all > database return clients', async () => {
    const clientService = new ClientService(db as unknown as IExtensions);
    mockAll.mockResolvedValue([] as IClient[])
    const data = await clientService.all();
    expect(mockAll).toHaveBeenCalledTimes(1);
    expect(data).not.toBeNull();
  });

  it('add > name is empty', async () => {
    try {
      const clientService = new ClientService(db as unknown as IExtensions);
      await clientService.addNew(undefined, 'client2.com', 'client2');
    } catch (error) {
      expect(mockAdd).toHaveBeenCalledTimes(0);
      expect(error).toHaveProperty('message', 'name is empty');
    }
  });

  it('add > domain is empty', async () => {
    try {
      const clientService = new ClientService(db as unknown as IExtensions);
      await clientService.addNew('client2.com', undefined, 'client2');
    } catch (error) {
      expect(mockAdd).toHaveBeenCalledTimes(0);
      expect(error).toHaveProperty('message', 'domain is empty');
    }
  });

  it('add > client id is empty', async () => {
    try {
      const clientService = new ClientService(db as unknown as IExtensions);
      await clientService.addNew('client2.com', 'client2.com', undefined);
    } catch (error) {
      expect(mockAdd).toHaveBeenCalledTimes(0);
      expect(error).toHaveProperty('message', 'client id is empty');
    }
  });

  it('add > database return client', async () => {
    const clientService = new ClientService(db as unknown as IExtensions);
    mockAdd.mockResolvedValue({} as IClient);
    const data = await clientService.addNew('client2', 'client2.com', 'client2');
    expect(mockAdd).toHaveBeenCalledTimes(1);
    expect(data).not.toBeNull();
  });

  it('add > database return error', async () => {
    try {
      const clientService = new ClientService(db as unknown as IExtensions);
      mockAdd.mockRejectedValue(new Error('database error'));
      await clientService.addNew('client2', 'client2.com', 'client2');
    } catch (error) {
      expect(mockAdd).toHaveBeenCalledTimes(1);
      expect(error).toHaveProperty('message', 'database error');
    }
  });
});