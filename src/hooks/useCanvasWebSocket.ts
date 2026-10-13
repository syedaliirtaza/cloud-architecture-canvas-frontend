import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export function useWorkspaceSocket(
  workspaceId: number,
  onElementEvent: (event: any) => void,
  onCursorEvent: (event: any) => void
) {
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () =>
        new SockJS(`${import.meta.env.VITE_WS_BASE_URL || "http://localhost:8080"}/ws`),
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      client.subscribe(`/topic/workspace/${workspaceId}/elements`, (msg) =>
        onElementEvent(JSON.parse(msg.body))
      );
      client.subscribe(`/topic/workspace/${workspaceId}/cursors`, (msg) =>
        onCursorEvent(JSON.parse(msg.body))
      );
    };

    client.activate();
    clientRef.current = client;

    return () => {
      clientRef.current?.deactivate();
    };
  }, [workspaceId, onElementEvent, onCursorEvent]);

  const sendElementEvent = (event: any) => {
    console.log(event);
    clientRef.current?.publish({
      destination: `/app/workspace/${workspaceId}/element`,
      body: JSON.stringify(event),
    });
  };

  const sendCursorEvent = (event: any) => {
    clientRef.current?.publish({
      destination: `/app/workspace/${workspaceId}/cursor`,
      body: JSON.stringify(event),
    });
  };

  return { sendElementEvent, sendCursorEvent };
}
