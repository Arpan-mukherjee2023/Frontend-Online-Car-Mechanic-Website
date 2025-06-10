    // useWebSocket.js
    import { useState, useEffect, useRef } from 'react';


    const useWebSocket = (garageId) => {
        const [message, setMessage] = useState(null);
        const [isConnected, setIsConnected] = useState(false);
        const ws = useRef(null);
        const url = new URL("ws://localhost:8080/ws");
        console.log(url, garageId);
        
        useEffect(() => {
            ws.current = new WebSocket(url.toString());
            console.log(url)
            ws.current.onopen = () => {
                console.log("WebSocket connected");
                setIsConnected(true);
            };
            ws.current.onmessage = (event) => {
                console.log("Received message:", event.data);
                try {
                    const parsedMessage = JSON.parse(event.data); // Parse JSON string
                    setMessage(parsedMessage);
                } catch (error) {
                    console.error("Error parsing JSON:", error);
                    setMessage(null); // Or handle the error appropriately
                }
            };
            ws.current.onclose = () => {
                console.log("WebSocket disconnected");
                setIsConnected(false);
            };
            ws.current.onerror = (error) => {
                console.error("WebSocket error:", error);
                setIsConnected(false);
            };
            return () => {
                if (ws.current) {
                    ws.current.close();
                }
            };
        }, [url, garageId]);

        const sendMessage = (message) => {
            if (isConnected && ws.current) {
                ws.current.send(message);
            } else {
                console.log("WebSocket not connected, message not sent");
            }
        };
        return { message, isConnected, sendMessage };
    };

    export default useWebSocket;
    