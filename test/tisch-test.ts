import {readFileSync} from "fs";
import {inspect} from  "util";


import {parse} from "../tisch-parser";

const testData = readFileSync("./test/tisch-test.txt", "utf8");
const result = parse(testData);
console.log(inspect(result, false, null));
