export default class PseudoBlock {
  private readonly observeBlock: Buffer;
  private readonly iv: Buffer;
  private intermediateBlock: Buffer;
  private resultBlock: Buffer;
  private pointer: number;

  constructor(observeBlock: Buffer, iv: Buffer) {
    const bSize = observeBlock.length;

    this.observeBlock = observeBlock;
    this.iv = iv;

    this.intermediateBlock = Buffer.allocUnsafe(bSize);
    this.intermediateBlock.fill(0);

    this.resultBlock = Buffer.allocUnsafe(bSize);
    this.resultBlock.fill(0);

    this.pointer = bSize - 1;
  }

  protected shufflePointer() {
    this.pointer--;

    if (this.pointer < 0) {
      throw new Error("Pointer cannot be lower than zero");
    }

    this.intermediateBlock[this.pointer] = 0;
    this.fillRightSide();
  }

  protected fillRightSide() {
    const maskBlock = this.getLeftBytes();

    if (maskBlock === null) {
      return;
    }

    const bsize = maskBlock.length;

    for (let i = this.pointer + 1; i < bsize; i++) {
      this.intermediateBlock[i] = maskBlock[i];
    }
  }

  protected getPaddingOffset() {
    return this.observeBlock.length - this.pointer;
  }

  protected getLeftBytes(): null | Buffer {
    if (this.getPaddingOffset() === 1) {
      return null;
    }

    const bzise = this.observeBlock.length;
    const result = Buffer.allocUnsafe(bzise);

    for (let i = this.pointer + 1; i < bzise; i++) {
      const byte = this.resultBlock[i] ^ this.getPaddingOffset();
      result[i] = byte;
    }

    return result;
  }

  public incrementByte() {
    let byte = this.intermediateBlock[this.pointer];
    byte++;

    if (byte > 255) {
      throw new Error("Byte cannot be higher than 255");
    }

    this.intermediateBlock[this.pointer] = byte;
  }

  protected getDecipherByte() {
    const imByte = this.intermediateBlock[this.pointer];
    const offset = this.getPaddingOffset();
    const dcByte = imByte ^ offset;

    return dcByte;
  }

  protected saveDecipherByte(byte: number) {
    this.resultBlock[this.pointer] = byte;
  }

  public xorIM(targetBlock?: Buffer): Buffer {
    if (typeof targetBlock === "undefined") {
      targetBlock = this.iv;
    }

    const bsize = this.observeBlock.length;
    const result = Buffer.allocUnsafe(bsize);

    for (let i = 0; i < bsize; i++) {
      result[i] = targetBlock[i] ^ this.resultBlock[i];
    }

    return result;
  }

  protected workFinished(): void {
    console.log("Works finished! Block:", this.resultBlock);
  }

  public bingo(): boolean {
    const dByte = this.getDecipherByte();
    this.saveDecipherByte(dByte);

    try {
      this.shufflePointer();
    } catch {
      this.workFinished();
      return true;
    }

    return false;
  }

  public getFake(): Buffer[] {
    return [this.intermediateBlock, this.observeBlock];
  }
}
