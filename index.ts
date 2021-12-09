import { config } from "dotenv";
import Crypter from "./lib/Crypter";

config();

const crypter = new Crypter();

const srcText =
  "dy4xU6NqCCoWuiYlbfJ3vRDrisVJWyBfV3mm1ZFPoO2X2xAo8LR!tBJBkH0vfVGre7AYfddxHSgIeYuDRwv-THhL1N8OJ1gLBhS2-H0ngTq5jk-Taz9oMaZ9LHhsQDHaVibCLJtRuAVqi9rCtXwGPLVYTyfrLdo1ZZ0qf!PjOO6VjJZmwPelcJlfcCFc44jkAEM3NrtOJNi3wO5hQVXmZw~~";


async function main() {
  const decipherText = await crypter.decrypt(srcText);
  console.log(decipherText);
}

main();
