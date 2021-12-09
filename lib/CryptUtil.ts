export default class CryptUtil {
  splitBlocks(src: Buffer, bsize = 16): Buffer[] {
    if (src.length % bsize !== 0) {
      throw new Error(
        `Cannot split block that size ${src.length} per ${bsize} bytes!`
      );
    }

    const blocks = [];

    for (let i = 0, l = src.length / bsize; i < l; i++) {
      const buf = Buffer.allocUnsafe(bsize);
      buf.fill(0);

      src.copy(buf, 0, i * bsize, (i + 1) * bsize);
      blocks.push(buf);
    }

    return blocks;
  }

  joinBlocks(blocks: Buffer[]): Buffer {
    const bsize = blocks[0].length;
    const result = Buffer.allocUnsafe(blocks.length * bsize);

    for (let i = 0, l = blocks.length; i < l; i++) {
      const block = blocks[i];
      block.copy(result, i * bsize, 0, bsize);
    }

    return result;
  }

  bytes2block(bytes: Buffer, bsize = 16): Buffer[] {
    const blocksAmount = Math.ceil(bytes.length / bsize);
    const paddingBytes = blocksAmount * bsize - bytes.length;

    let oddBuffer: Buffer;

    if (paddingBytes !== 0) {
      oddBuffer = Buffer.allocUnsafe(blocksAmount * bsize);
      oddBuffer.fill(paddingBytes);
    } else {
      oddBuffer = Buffer.allocUnsafe((blocksAmount + 1) * bsize);
      oddBuffer.fill(0x0f);
    }

    bytes.copy(oddBuffer, 0, 0, bytes.length);

    const result: Buffer[] = [];

    for (let i = 0; i < oddBuffer.length / bsize; i++) {
      const block = Buffer.allocUnsafe(bsize);
      oddBuffer.copy(block, 0, i * bsize, (i + 1) * bsize);

      result.push(block);
    }

    return result;
  }
}
