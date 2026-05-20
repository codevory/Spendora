import {
  afterEach,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from "@jest/globals";
import { handleGoogleSignin } from "./authService";

describe("handleGoogleSignin", () => {
  beforeEach(() => {
    jest.spyOn(console, "log").mockImplementation(() => undefined);
    jest.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("signs in successfully and clears the loading state", async () => {
    const setIsLoading = jest.fn();
    const getFirebaseServices: any = jest.fn(async () => ({
      auth: { currentUser: null },
      provider: { providerId: "google.com" },
    }));
    const signInWithPopup: any = jest.fn(async () => ({
      user: { uid: "user-1" },
    }));
    const credentialFromResult: any = jest
      .fn()
      .mockReturnValue({ accessToken: "token-123" });
    const credentialFromError: any = jest.fn();
    const success: any = jest.fn();
    const fail: any = jest.fn();

    const result = await handleGoogleSignin({
      setIsLoading,
      deps: {
        getFirebaseServices,
        signInWithPopup,
        credentialFromResult,
        credentialFromError,
        success,
        fail,
      },
    });

    expect(setIsLoading).toHaveBeenNthCalledWith(1, true);
    expect(getFirebaseServices).toHaveBeenCalledTimes(1);
    expect(signInWithPopup).toHaveBeenCalledWith(
      { currentUser: null },
      { providerId: "google.com" },
    );
    expect(credentialFromResult).toHaveBeenCalledWith({
      user: { uid: "user-1" },
    });
    expect(success).toHaveBeenCalledWith("🎉 signin successfull");
    expect(fail).not.toHaveBeenCalled();
    expect(setIsLoading).toHaveBeenLastCalledWith(false);
    expect(result).toEqual({ user: { uid: "user-1" } });
  });

  test("rethrows errors from firebase sign-in", async () => {
    const setIsLoading = jest.fn();
    const error = Object.assign(new Error("popup blocked"), {
      customData: { email: "user@example.com" },
    });
    const getFirebaseServices: any = jest.fn(async () => ({
      auth: { currentUser: null },
      provider: { providerId: "google.com" },
    }));
    const signInWithPopup: any = jest.fn(async () => {
      throw error;
    });
    const credentialFromResult: any = jest.fn();
    const credentialFromError: any = jest.fn().mockReturnValue({});
    const success: any = jest.fn();
    const fail: any = jest.fn();

    await expect(
      handleGoogleSignin({
        setIsLoading,
        deps: {
          getFirebaseServices,
          signInWithPopup,
          credentialFromResult,
          credentialFromError,
          success,
          fail,
        },
      }),
    ).rejects.toThrow("popup blocked");

    expect(setIsLoading).toHaveBeenNthCalledWith(1, true);
    expect(setIsLoading).toHaveBeenLastCalledWith(false);
    expect(fail).toHaveBeenCalledWith("popup blocked");
    expect(success).not.toHaveBeenCalled();
    expect(credentialFromError).toHaveBeenCalledWith(error);
  });
});
