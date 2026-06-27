// marked-terminal v7 ships no types, and @types/marked-terminal (max v6) wrongly types
// markedTerminal() as a TerminalRenderer — at runtime it returns a MarkedExtension for .use().
// Remove this file if @types ever ships a correct v7.
declare module "marked-terminal" {
  import type { MarkedExtension } from "marked";
  import type { ChalkInstance } from "chalk";

  type Styler = ChalkInstance | ((text: string) => string);

  export const markedTerminal: (
    options?: Partial<Record<string, Styler>>,
    highlightOptions?: object,
  ) => MarkedExtension;
}
