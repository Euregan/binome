#!/usr/bin/env node

import { render } from "ink";
import { Binome } from "./Binome.js";

const [, , folder, ...purpose] = process.argv;

if (!folder) {
  throw "You need to specify a folder to watch";
}
if (purpose.length === 0) {
  throw "You need to specify the purpose of your session";
}

render(<Binome toWatch={folder} sessionPurpose={purpose.join(" ")} />);
