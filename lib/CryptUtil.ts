export default class CryptUtil
{
  splitBlocks(src: Buffer, bsize = 16): Buffer[] {
    if (src.length % bsize !== 0) {
      throw new Error(`Cannot split block that size ${src.length} per ${bsize} bytes!`);
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

  initialFPBlock(bsize = 16): Buffer {
    const fpBlock = Buffer.allocUnsafe(bsize);
    fpBlock.fill(0);
    fpBlock[fpBlock.length - 1] = 1;

    return fpBlock;
  }

  increasePadding(block: Buffer): Buffer {
    const bsize = block.length;
    const padding = block[bsize - 1];
    const newPadding = padding + 1;

    for (let i = bsize - newPadding, l = bsize; i < l; i++) {
      block[i] = newPadding;
    }

    return block;
  }
}