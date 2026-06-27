import { CanUseTool, query } from "@anthropic-ai/claude-agent-sdk";
import { useCallback, useEffect, useRef, useState } from "react";

export const useSession = (workSubject: string) => {
  const [readFiles, setReadFiles] = useState(new Set<string>());

  const sessionId = useRef<null | string>(null);
  const ready = useRef(false);

  const [messages, setMessages] = useState<Array<string>>([]);

  const canUseTool = useCallback<CanUseTool>(
    async (toolName, input) => {
      switch (toolName) {
        case "Read":
          setReadFiles(readFiles.add(input["file_path"] as string));
          return { behavior: "allow", updatedInput: input };
        case "Bash":
        case "Grep":
          return { behavior: "allow", updatedInput: input };
        default:
          console.error("tool not supported", toolName, input);
          return { behavior: "deny", message: "This is not supported yet" };
      }
    },
    [setReadFiles],
  );

  useEffect(() => {
    void new Promise(async () => {
      for await (const message of query({
        prompt: [
          `I am going to work on: ${workSubject}`,
          "I will provide you with the changes as I make them",
          "Review what I write, and point out anything you think could be improved",
          "Try to infer my intent from the changes, and do not point out things I will most likely work on next",
          "Do not hesitate to visit other files to better grasp the context of my task",
          "You will keep your comments short, concise and to the point",
          "You will not use elaborate sentences to appear eloquent, you will not compliment me",
          'If you have nothing to comment, say "nothing to say"',
          'Only say "nothing to say" when you have no comment at all',
          'Do not say fillers like "Nothing else stands out"',
          "You will not comment on issues covered by a linter, a compiler or automated tests",
          'Do not announce what you will do, like "Let me check ..."',
        ].join(". "),
        options: {
          pathToClaudeCodeExecutable:
            process.env["CLAUDE_CODE_PATH"] ?? "claude",
          canUseTool,
        },
      })) {
        if (message.type === "result") {
          sessionId.current = message.session_id;
        }

        if (message.type === "assistant" && message.message?.content) {
          for (const block of message.message.content) {
            if ("text" in block) {
              setMessages((messages) => messages.concat(block.text));
              ready.current = true;
            } else if ("name" in block) {
              console.log(`Tool: ${block.name}`);
            }
          }
        } else if (message.type === "result") {
          console.log(`Done: ${message.subtype}`);
        }
      }
    });
  }, []);

  const onFileEvent = (event: string) => (filepath: string) => {
    const session = sessionId.current;

    if (ready.current && session)
      void new Promise(async () => {
        for await (const message of query({
          prompt: `This file just got ${event}: ${filepath}`,
          options: {
            pathToClaudeCodeExecutable:
              process.env["CLAUDE_CODE_PATH"] ?? "claude",
            resume: session,
            canUseTool,
          },
        })) {
          if (message.type === "assistant" && message.message?.content) {
            for (const block of message.message.content) {
              if ("text" in block) {
                setMessages((messages) => messages.concat(block.text));
              }
            }
          } else if (message.type === "result") {
            console.log(`Done: ${message.subtype}`);
          }
        }
      });
  };

  return {
    messages,
    onFileUpdated: onFileEvent("updated"),
    onFileCreated: onFileEvent("created"),
  };
};
