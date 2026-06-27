import { render } from "ink";
import { Binome } from "./Binome.js";

if (!process.argv[2]) {
  throw "You need to specify a folder to watch";
}

render(<Binome toWatch={process.argv[2]} />);
