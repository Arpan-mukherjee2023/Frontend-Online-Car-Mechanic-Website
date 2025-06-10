    import React, { useState, useEffect } from 'react';
    import useWebSocket from '../Custom Hooks/useWebSocket';

    const GarageNotification = () => {
        const garage = JSON.parse(localStorage.getItem("garageData"));
        const garageId = garage.garageId;

        const { message, isConnected } = useWebSocket(garageId);

        return (
            <div>
                <h1>Garage Order Page</h1>
                {garageId ? (
                    <>
                        <p>WebSocket Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
                        {message && (
                            <div>
                                <p>New Order Notification:</p>
                                <p>User Name: {message.userName}</p>
                                <p>User Email: {message.userEmail}</p>
                                <p>Ordered Product: {message.orderedProduct}</p>
                                <p>Quantity: {message.quantity}</p>
                                <p>Total Amount: {message.totalAmount}</p>
                            </div>
                        )}
                    </>
                ) : (
                    <p>Loading garage information...</p>
                )}
            </div>
        );
    };

    export default GarageNotification;
    