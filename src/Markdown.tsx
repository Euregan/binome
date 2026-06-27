import { Text } from "ink";
import { markedTerminal } from "marked-terminal";
import { Marked } from "marked";
import chalk from "chalk";

const vivid = new Marked().use(markedTerminal());
const dimmed = new Marked().use(
  markedTerminal({
    text: chalk.gray,
    em: chalk.gray,
    strong: chalk.gray,
    codespan: chalk.gray,
    code: chalk.gray,
  }),
);

type MarkdownProps = {
  children: string;
  dim: boolean;
};

export const Markdown = ({ children, dim }: MarkdownProps) => (
  <Text>{(dim ? dimmed : vivid).parse(children, { async: false }).trim()}</Text>
);
