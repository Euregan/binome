import { Box, Text } from "ink";
import { Markdown } from "./Markdown.js";
import { useWatcher } from "./useWatcher.js";

type BinomeProps = {
  toWatch: string;
  sessionPurpose: string;
};

export const Binome = ({ toWatch, sessionPurpose }: BinomeProps) => {
  const { messages } = useWatcher(toWatch, sessionPurpose);

  return (
    <Box flexDirection="column" gap={1} marginBottom={2}>
      <Text>Watching {toWatch}</Text>
      {messages.map((message, index) => (
        <Markdown key={index} dim={index < messages.length - 1}>
          {message}
        </Markdown>
      ))}
    </Box>
  );
};
