import { Box, Text } from "ink";
import { useEffect } from "react";
import watcher, { AsyncSubscription } from "@parcel/watcher";
import { useSession } from "./useSession.js";
import { Markdown } from "./Markdown.js";

type BinomeProps = {
  toWatch: string;
};

export const Binome = ({ toWatch }: BinomeProps) => {
  const { messages, onFileUpdated, onFileCreated } =
    useSession("improving you");

  useEffect(() => {
    let subscription: AsyncSubscription | null = null;
    let done = false;

    watcher
      .subscribe(toWatch, (_error, events) => {
        for (const event of events) {
          switch (event.type) {
            case "update":
              onFileUpdated(event.path);
              break;
            case "create":
              onFileCreated(event.path);
              break;
          }
        }
      })
      .then((sub) => {
        if (done) {
          sub.unsubscribe();
        } else {
          subscription = sub;
        }
      });

    return () => {
      done = true;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  return (
    <Box flexDirection="column" gap={1} marginBottom={2}>
      <Text>Watching {toWatch}</Text>
      {messages.map((message, index) => (
        <Box key={index} flexDirection="column" gap={0}>
          <Markdown dim={index < messages.length - 1}>{message}</Markdown>
        </Box>
      ))}
    </Box>
  );
};
