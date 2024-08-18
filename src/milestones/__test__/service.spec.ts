import { IExtensions } from "../../db";
import { mockAdd, mockByClientIdAndValue } from "../__mocks__/repository";
import { IMilestone } from "../interfaces";
import MilestoneServices from "../services";

const db = {
  milestones: {
    byClientIdAndValue: mockByClientIdAndValue,
    add: mockAdd
  }
};
describe('milestones > service', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('addNew > client is empty', async () => {
    const milestoneServices = new MilestoneServices(db as unknown as IExtensions);
    try {
      await milestoneServices.addNew(undefined, 10, true);
    } catch (error) {
      expect(error).toHaveProperty('message', 'client id is empty');
      expect(mockAdd).toHaveBeenCalledTimes(0);
    }
  });

  it('addNew > value is empty', async () => {
    const milestoneServices = new MilestoneServices(db as unknown as IExtensions);
    try {
      await milestoneServices.addNew(1, undefined, true);
    } catch (error) {
      expect(error).toHaveProperty('message', 'value is empty');
      expect(mockAdd).toHaveBeenCalledTimes(0);
    }
  });

  it('addNew > emailSent is empty', async () => {
    const milestoneServices = new MilestoneServices(db as unknown as IExtensions);
    try {
      await milestoneServices.addNew(1, 10, undefined);
    } catch (error) {
      expect(error).toHaveProperty('message', 'emailSent is empty');
      expect(mockAdd).toHaveBeenCalledTimes(0);
    }
  });

  it('addNew > database throw error', async () => {
    const milestoneServices = new MilestoneServices(db as unknown as IExtensions);
    try {
      mockAdd.mockRejectedValue(new Error('database error'))
      await milestoneServices.addNew(1, 10, true);
    } catch (error) {
      expect(error).toHaveProperty('message', 'database error');
      expect(mockAdd).toHaveBeenCalledTimes(1);
    }
  });

  it('addNew > database return data', async () => {
    const milestoneServices = new MilestoneServices(db as unknown as IExtensions);
    mockAdd.mockResolvedValue({} as IMilestone)
    const data = await milestoneServices.addNew(1, 10, true);
    expect(mockAdd).toHaveBeenCalledTimes(1);
    expect(data).not.toBeNull();
  });

  it('detail > client is empty', async () => {
    const milestoneServices = new MilestoneServices(db as unknown as IExtensions);
    try {
      await milestoneServices.detail(undefined, 10);
    } catch (error) {
      expect(error).toHaveProperty('message', 'client id is empty');
      expect(mockByClientIdAndValue).toHaveBeenCalledTimes(0);
    }
  });

  it('detail > value is empty', async () => {
    const milestoneServices = new MilestoneServices(db as unknown as IExtensions);
    try {
      await milestoneServices.detail(1, undefined);
    } catch (error) {
      expect(error).toHaveProperty('message', 'value is empty');
      expect(mockByClientIdAndValue).toHaveBeenCalledTimes(0);
    }
  });

  it('detail > database throw error', async () => {
    const milestoneServices = new MilestoneServices(db as unknown as IExtensions);
    try {
      mockByClientIdAndValue.mockRejectedValue(new Error('database error'))
      await milestoneServices.detail(1, 10);
    } catch (error) {
      expect(error).toHaveProperty('message', 'database error');
      expect(mockByClientIdAndValue).toHaveBeenCalledTimes(1);
    }
  });

  it('detail > database return data', async () => {
    const milestoneServices = new MilestoneServices(db as unknown as IExtensions);
    mockByClientIdAndValue.mockResolvedValue({} as IMilestone)
    const data = await milestoneServices.detail(1, 10);
    expect(mockByClientIdAndValue).toHaveBeenCalledTimes(1);
    expect(data).not.toBeNull();
  });
});