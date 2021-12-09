import { config } from "dotenv";
import Crypter from "./lib/Crypter";

config();

const crypter = new Crypter();

// const srcText =
//   "M3yFwEnfgxmdtbM52n8U2DDQJY3nsYDrVwMCLu5sTvfpPtAmR3b5C-U!Z7-R5WlhXbmZLUs1dyLJYQOfdJKi6WxBHtMe7UxVjkM9GtXSVAki7m78TSnAsM8otlau0KMWLu-STIlIEqQvsECWZJ7f6FMGnylFhhcsY2cCtePwxNyG2HJh8jHpoOJJKEzoyyHRktgFvO9Ze2sKA-9UOTHLMQ~~";

async function main() {
  // const decipherText = await crypter.decrypt(srcText);
  // console.log(decipherText);

  const result = await crypter.encrypt(
    '{"id":"1","key":"h2TZGJmZAtTfUdyjkdr7Yw~~"}'
  );
  console.log(result);
}

main();
