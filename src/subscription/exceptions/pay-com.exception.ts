export class PayComException extends Error {
  constructor(readonly error: any) {
    super(error.message);
  }
}
