import TextUtils from "./TextUtils";
import CryptUtil from "./CryptUtil";
import Requester from "./Requester";

export default class Crypter
{
  private readonly cu: CryptUtil;
  private readonly tu: TextUtils;
  
  constructor() {
    this.cu = new CryptUtil();
    this.tu = new TextUtils();
  }

  async decrypt(src: string): Promise<string> {
    const bytes = this.tu.src2bytes(src);
    const blocks = this.cu.splitBlocks(bytes);

    const iv = blocks.splice(0, 1)[0];

    const workers = [];

    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      const iv_local = i === 0 ? iv : blocks[i-1];

      const r = new Requester(block, iv_local);
      workers.push(r.decipherBlock());
    }

    const resultArr = await Promise.all(workers);
    const decipherText = this.cu.joinBlocks(resultArr).toString();

    return decipherText;
  }
}
