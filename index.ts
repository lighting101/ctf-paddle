import { config } from "dotenv";
import TextUtils from "./lib/TextUtils";
import CryptUtil from "./lib/CryptUtil";
import Requester from "./lib/Requester";

config();

const tu = new TextUtils();
const cu = new CryptUtil();

const srcText =
  "bmAn3g7V!pfMYMkte0Y9kZEHZr!kL0lnPDzylll!p4oEBYbMaa6abOmqpb8wgh3Xx7-Nlm3HceJ22BjWanUGWBSCGaMI-uUxbrUeSczF5KYS47XsnJ3LwsCwkeFucb4nZYm6vcRu9XmI9DypGJ4j!eddYJjFCeJ1R0BTBURrdrlyYjZBVaRBMPq39lgtLKFFvKr-AiEqQ-4-4nyuN80Bpw~~";
const src = tu.src2bytes(srcText);

async function main() {
  const blocks = cu.splitBlocks(src);
  // const iv = blocks.splice(0, 1)[0];

  const block = blocks[1];
  const iv = blocks[0];

  const r = new Requester(block, iv);

  const decrypted = await r.decipherBlock();
  console.log(decrypted.toString());
}

main();
