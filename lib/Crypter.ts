// import * as CliProgress from 'cli-progress';
import TextUtils from "./TextUtils";
import CryptUtil from "./CryptUtil";
import Requester from "./Requester";

export default class Crypter {
  private readonly cu: CryptUtil;
  private readonly tu: TextUtils;
  private readonly threads: number;

  constructor(threads = 10) {
    this.cu = new CryptUtil();
    this.tu = new TextUtils();
    this.threads = threads
  }

  async decrypt(src: string): Promise<string> {
    const bytes = this.tu.src2bytes(src);
    const blocks = this.cu.splitBlocks(bytes);

    const iv = blocks.splice(0, 1)[0];

    const workers = [];

    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      const iv_local = i === 0 ? iv : blocks[i - 1];

      const r = new Requester(block, iv_local);
      workers.push(r.calculateBlock());
    }

    const resultArr = await Promise.all(workers);
    const decipherText = this.cu.joinBlocks(resultArr).toString();

    return decipherText;
  }

  async encrypt(plain: string): Promise<string> {
    const plainBytes = Buffer.from(plain);
    const plainBlocks = this.cu.bytes2block(plainBytes);
    const reversedPlainBlocks = plainBlocks.reverse();

    const reversedResult: Buffer[] = [];

    const firstBlock = Buffer.allocUnsafe(16);
    firstBlock.fill(1);
    reversedResult.push(firstBlock);

    for (let i = 0; i < reversedPlainBlocks.length; i++) {
      const block = reversedResult[reversedResult.length - 1];

      const r = new Requester(block, reversedPlainBlocks[i], this.threads);
      const foundBlock = await r.calculateBlock();
      reversedResult.push(foundBlock);
    }

    console.log("All blocks found");
    const resultBlocks = reversedResult.reverse();
    const bytes = this.cu.joinBlocks(resultBlocks);

    return this.tu.bytes2src(bytes);
  }
}
