import { ELocalKeys } from './local-key.enum';
import { LocalStorageUtilsService } from './local-storage-utils.service';

describe('LocalStorageUtilsService', () => {
  const testKey: ELocalKeys =ELocalKeys.TEST_KEY; // Replace with an actual key from your enum
  const testValue = { name: 'Test', age: 25 };
  const testStringValue = JSON.stringify(testValue);

  beforeEach(() => {
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      return key === `bank__${testKey}` ? testStringValue : null;
    });

    spyOn(localStorage, 'setItem').and.callFake(() => {});
    spyOn(localStorage, 'removeItem').and.callFake(() => {});
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should return the correct full local storage key', () => {
    const fullKey = (LocalStorageUtilsService as any).getFullLocalStorageKey(
      testKey
    );
    expect(fullKey).toBe(`bank__${testKey}`);
  });

  it('should retrieve an object from local storage', () => {
    const retrievedValue =
      LocalStorageUtilsService.getSessionValueAsObject<typeof testValue>(
        testKey
      );
    expect(retrievedValue).toEqual(testValue);
  });

  it('should return null if JSON parsing fails', () => {
    spyOn(localStorage, 'getItem').and.returnValue('{invalidJson}');
    const result = LocalStorageUtilsService.getSessionValueAsObject(testKey);
    expect(result).toBeNull();
  });

  it('should store an object in local storage', () => {
    LocalStorageUtilsService.setLocalStorageObjectAsValue(testKey, testValue);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      `bank__${testKey}`,
      testStringValue
    );
  });

  it('should remove a value from local storage', () => {
    LocalStorageUtilsService.removeLocalStorageValue(testKey);
    expect(localStorage.removeItem).toHaveBeenCalledWith(`bank__${testKey}`);
  });

  it('should remove all values related to the app from local storage', () => {
    spyOn(Object, 'keys').and.returnValue([testKey]); // Mock Object.keys(ELocalKeys)
    LocalStorageUtilsService.cleanLocalStorageValues();
    expect(localStorage.removeItem).toHaveBeenCalledWith(`bank__${testKey}`);
  });
});
