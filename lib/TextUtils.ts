export default class TextUtils {
  src2bytes(text: string): Buffer {
    const b64 = text.replace(/~/g, "=").replace(/-/g, "+").replace(/!/g, "/");

    return Buffer.from(b64, "base64");
  }

  bytes2src(bytes: Buffer): string {
    const b64 = bytes.toString("base64");
    const encoded = b64
      .replace(/=/g, "~")
      .replace(/\+/g, "-")
      .replace(/\//g, "!");

    return encoded;
  }
}
