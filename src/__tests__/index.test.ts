import { UnavailabilityError } from "expo-modules-core";

import ExpoPhoneNumberHintModule from "../ExpoPhoneNumberHintModule";
import {
  formatToE164,
  isAvailableAsync,
  showPhoneNumberHintAsync,
} from "../index";

jest.mock("expo-modules-core", () => ({
  UnavailabilityError: class UnavailabilityError extends Error {},
}));

jest.mock("../ExpoPhoneNumberHintModule", () => ({
  __esModule: true,
  default: {},
}));

const nativeModule = ExpoPhoneNumberHintModule as Record<string, unknown>;

beforeEach(() => {
  for (const key of Object.keys(nativeModule)) {
    delete nativeModule[key];
  }
});

describe("isAvailableAsync", () => {
  it("returns false when the native module is unavailable", async () => {
    await expect(isAvailableAsync()).resolves.toBe(false);
  });

  it("returns false when the native call throws", async () => {
    nativeModule.isAvailableAsync = jest
      .fn()
      .mockRejectedValue(new Error("boom"));
    await expect(isAvailableAsync()).resolves.toBe(false);
  });

  it("delegates to the native module", async () => {
    nativeModule.isAvailableAsync = jest.fn().mockResolvedValue(true);
    await expect(isAvailableAsync()).resolves.toBe(true);
  });
});

describe("showPhoneNumberHintAsync", () => {
  it("throws UnavailabilityError when unsupported", async () => {
    await expect(showPhoneNumberHintAsync()).rejects.toBeInstanceOf(
      UnavailabilityError,
    );
  });

  it("passes a selection result through unchanged", async () => {
    const result = {
      canceled: false,
      hint: {
        number: "+1 202 555 0173",
        e164: "+12025550173",
        regionCode: "US",
      },
    };
    nativeModule.showPhoneNumberHintAsync = jest.fn().mockResolvedValue(result);
    await expect(showPhoneNumberHintAsync()).resolves.toEqual(result);
  });

  it("passes a canceled result through unchanged", async () => {
    const result = { canceled: true, hint: null };
    nativeModule.showPhoneNumberHintAsync = jest.fn().mockResolvedValue(result);
    await expect(showPhoneNumberHintAsync()).resolves.toEqual(result);
  });

  it("passes through a hint with no derivable region or e164", async () => {
    const result = {
      canceled: false,
      hint: { number: "9705783855", e164: null, regionCode: null },
    };
    nativeModule.showPhoneNumberHintAsync = jest.fn().mockResolvedValue(result);
    await expect(showPhoneNumberHintAsync()).resolves.toEqual(result);
  });
});

describe("formatToE164", () => {
  it("returns null when the native module is unavailable", () => {
    expect(formatToE164("9705783855", "IN")).toBeNull();
  });

  it("delegates to the native module", () => {
    nativeModule.formatToE164 = jest.fn().mockReturnValue("+919705783855");
    expect(formatToE164("9705783855", "IN")).toBe("+919705783855");
    expect(nativeModule.formatToE164).toHaveBeenCalledWith("9705783855", "IN");
  });

  it("passes null when the region is omitted", () => {
    nativeModule.formatToE164 = jest.fn().mockReturnValue("+919705783855");
    expect(formatToE164("+919705783855")).toBe("+919705783855");
    expect(nativeModule.formatToE164).toHaveBeenCalledWith(
      "+919705783855",
      null,
    );
  });

  it.each([null, "", undefined])(
    "normalizes %p region to null for the native call",
    (region) => {
      nativeModule.formatToE164 = jest.fn().mockReturnValue(null);
      expect(formatToE164("+919705783855", region)).toBeNull();
      expect(nativeModule.formatToE164).toHaveBeenCalledWith(
        "+919705783855",
        null,
      );
    },
  );
});
