import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const WS_URL = "http://localhost:8080/ws";
const WORKSPACE_ID = 1;
const ELEMENT_ID = "d42788c5-c5da-4763-aace-d94d0b288896";

function createClient(userId, widthValue) {
  const client = new Client({
    webSocketFactory: () => new SockJS(WS_URL),
    reconnectDelay: 0,
  });

  client.onConnect = () => {
    console.log(`✅ Client ${userId} connected`);

    client.subscribe(`/topic/workspace/${WORKSPACE_ID}/elements`, (msg) => {
      console.log(`[${userId}] received: ${msg.body}`);
    });

    const updatePayload = {
      action: "update",
      workspaceId: WORKSPACE_ID,
      userId,
      element: {
        id: ELEMENT_ID,
        type: "rectangle",
        data: {
          x: 307,
          y: 333,
          fill: "rgba(59, 130, 246, 0.1)",
          text: "",
          width: widthValue,
          height: 168,
          stroke: "#3b82f6",
          strokeWidth: 2,
        },
      },
    };

    client.publish({
      destination: `/app/workspace/${WORKSPACE_ID}/element`,
      body: JSON.stringify(updatePayload),
    });
    console.log(`📤 [${userId}] sent update`, updatePayload);
  };

  client.activate();
}

createClient(1, 100);
createClient(2, 300);
