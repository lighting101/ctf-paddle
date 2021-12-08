import { config } from "dotenv";
import TextUtils from "./lib/TextUtils";
import CryptUtil from "./lib/CryptUtil";
import Requester from "./lib/Requester";

config();

const tu = new TextUtils();
const cu = new CryptUtil();
const r = new Requester();

const srcText =
  "zXYTwrrQ4wgb8PcLqwrTocasU2irmiDhnSLrCl8O643IABoe8cgb-QW-sXrZeOofvz!gSUQtnroGStbsMECwBd0ePGUoFtmGBvuurBfbhQIIKuFARo01Q!pkEeRioXVLQ5xeTPKWORw3f0QbbETDw3zhbcv4AA9dpKcOE4vdauTguyeIyXXqGZ1p0HZ6eJPDw9bQpqGViGv!zoq49l9jsQ~~";
const src = tu.src2bytes(srcText);

async function main() {
  const blocks = cu.splitBlocks(src);
  const iv = blocks.splice(0, 1)[0];

  r.findIntermediateFingerprint(blocks[0]);  
}

main();
