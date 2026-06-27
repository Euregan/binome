import { render } from "ink";
import { Binome } from "./Binome.js";

if (!process.argv[2]) {
  throw "You need to specify a folder to watch";
}
if (!process.argv[3]) {
  throw "You need to specify the purpose of your session";
}

render(<Binome toWatch={process.argv[2]} sessionPurpose={process.argv[3]} />);
