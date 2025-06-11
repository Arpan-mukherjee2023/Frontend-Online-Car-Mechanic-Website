import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const useWebSocket = (garageId, onMessageReceived) => {
  const client = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    console.log(garageId);
    client.current = new Client({
      brokerURL: "ws://localhost:8080/ws",
      reconnectDelay: 5000, // retry on disconnect
      debug: (str) => console.log("[STOMP]", str),

      heartbeatIncoming: 10000, // accept heartbeats every 10s
      heartbeatOutgoing: 10000,

      onConnect: () => {
        console.log("✅ Connected to WebSocket");
        setIsConnected(true);

        client.current.subscribe(`/garage/${garageId}`, (message) => {
          const order = JSON.parse(message.body);
          onMessageReceived(order);
        });
      },

      onDisconnect: () => {
        console.log("❌ Disconnected from WebSocket");
        setIsConnected(false);
      },

      onStompError: (frame) => {
        console.error("💥 STOMP error:", frame.headers["message"]);
        console.error("Details:", frame.body);
        setIsConnected(false);
      },

      onWebSocketError: (error) => {
        console.error("🌐 WebSocket error:", error);
        setIsConnected(false);
      },
    });

    client.current.activate();

    return () => {
      if (client.current) {
        client.current.deactivate();
        setIsConnected(false);
      }
    };
  }, [garageId]);

  return isConnected;
};

export default useWebSocket;
