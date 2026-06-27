import watcher, { AsyncSubscription } from "@parcel/watcher";
import { useEffect } from "react";
import { useSession } from "./useSession.js";

export const useWatcher = (folderToWatch: string, sessionPurpose: string) => {
  const { messages, onFileUpdated, onFileCreated } = useSession(sessionPurpose);

  useEffect(() => {
    let subscription: AsyncSubscription | null = null;
    let done = false;

    watcher
      .subscribe(folderToWatch, (_error, events) => {
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

  return { messages };
};
