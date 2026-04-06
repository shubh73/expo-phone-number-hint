export default {} as {
  isAvailable?(): Promise<boolean>;
  requestPhoneNumber?(): Promise<string | null>;
};
