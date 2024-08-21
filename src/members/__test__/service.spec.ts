import { IExtensions } from "../../db";
import { mockAdd, mockFind } from "../__mocks__/repository";
import { MemberRole } from "../enums";
import { IMember } from "../interfaces";
import MemberServices from "../services";

const db = {
  members: {
    find: mockFind,
    add: mockAdd
  }
};
describe('members > service', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('addNew > client is empty', async () => {
    const memberServices = new MemberServices(db as unknown as IExtensions);
    try {
      await memberServices.addNew(undefined, 'first name', 'last_name', 'test@teest.com', MemberRole.MANAGER);
    } catch (error) {
      expect(error).toHaveProperty('message', 'client id is empty');
      expect(mockAdd).toHaveBeenCalledTimes(0);
    }
  });

  it('addNew > first_name is empty', async () => {
    const memberServices = new MemberServices(db as unknown as IExtensions);
    try {
      await memberServices.addNew(1, undefined, 'last_name', 'test@teest.com', MemberRole.MANAGER);
    } catch (error) {
      expect(error).toHaveProperty('message', 'firstName is empty');
      expect(mockAdd).toHaveBeenCalledTimes(0);
    }
  });

  it('addNew > last_name is empty', async () => {
    const memberServices = new MemberServices(db as unknown as IExtensions);
    try {
      await memberServices.addNew(1, 'first_name', undefined, 'test@teest.com', MemberRole.MANAGER);
    } catch (error) {
      expect(error).toHaveProperty('message', 'lastName is empty');
      expect(mockAdd).toHaveBeenCalledTimes(0);
    }
  });

  it('addNew > email is empty', async () => {
    const memberServices = new MemberServices(db as unknown as IExtensions);
    try {
      await memberServices.addNew(1, 'first_name', 'last name', undefined, MemberRole.MANAGER);
    } catch (error) {
      expect(error).toHaveProperty('message', 'email is empty');
      expect(mockAdd).toHaveBeenCalledTimes(0);
    }
  });

  it('addNew > role is empty', async () => {
    const memberServices = new MemberServices(db as unknown as IExtensions);
    try {
      await memberServices.addNew(1, 'first_name', 'last name', 'test@test.com', undefined);
    } catch (error) {
      expect(error).toHaveProperty('message', 'role is empty');
      expect(mockAdd).toHaveBeenCalledTimes(0);
    }
  });

  it('addNew > database throw error', async () => {
    const memberServices = new MemberServices(db as unknown as IExtensions);
    try {
      mockAdd.mockRejectedValue(new Error('database error'))
      await memberServices.addNew(1, 'first_name', 'last name', 'test@test.com', MemberRole.MANAGER);
    } catch (error) {
      expect(error).toHaveProperty('message', 'database error');
      expect(mockAdd).toHaveBeenCalledTimes(1);
    }
  });

  it('addNew > database return data', async () => {
    const memberServices = new MemberServices(db as unknown as IExtensions);
    mockAdd.mockResolvedValue({} as IMember)
    const data = await memberServices.addNew(1, 'first_name', 'last name', 'test@test.com', MemberRole.MANAGER);
    expect(mockAdd).toHaveBeenCalledTimes(1);
    expect(data).not.toBeNull();
  });

  it('members > client id is empty', async () => {
    const memberServices = new MemberServices(db as unknown as IExtensions);
    try {
      await memberServices.members(undefined, [MemberRole.MANAGER]);
    } catch (error) {
      expect(error).toHaveProperty('message', 'client id is empty');
      expect(mockFind).toHaveBeenCalledTimes(0);
    }
  });

  it('members > role is empty', async () => {
    const memberServices = new MemberServices(db as unknown as IExtensions);
    try {
      await memberServices.members(1, undefined);
    } catch (error) {
      expect(error).toHaveProperty('message', 'role is empty');
      expect(mockFind).toHaveBeenCalledTimes(0);
    }
  });

  it('members > database throw error', async () => {
    const memberServices = new MemberServices(db as unknown as IExtensions);
    try {
      mockFind.mockRejectedValue(new Error('database error'))
      await memberServices.members(1, [MemberRole.MANAGER]);
    } catch (error) {
      expect(error).toHaveProperty('message', 'database error');
      expect(mockFind).toHaveBeenCalledTimes(1);
    }
  });

  it('members > database return data', async () => {
    const memberServices = new MemberServices(db as unknown as IExtensions);
    mockFind.mockResolvedValue([] as IMember[])
    const data = await memberServices.members(1, [MemberRole.MANAGER]);
    expect(mockFind).toHaveBeenCalledTimes(1);
    expect(data).not.toBeNull();
  });
});