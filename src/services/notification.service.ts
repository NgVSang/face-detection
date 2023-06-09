import  {ExpoPushMessage, ExpoPushTicket , Expo} from "expo-server-sdk";
import {notification} from "../types/notification";

export const sendNotification = (data: notification) => {
    const expo = new Expo();
    let messages: ExpoPushMessage[] = [];
    if (Expo.isExpoPushToken(data.token)) {
        messages.push({
            to: data.token || '',
            sound: "default",
            title: data.title,
            body: data.body,
            data: {
                status: 1,
                message: "Success",
            },
        });
    }
    let chunks = expo.chunkPushNotifications(messages);
    let tickets: ExpoPushTicket[] = [];
    (async () => {
        for (let chunk of chunks) {
            try {
                let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                tickets.push(...ticketChunk);
                console.log(ticketChunk);
            } catch (error) {
                console.log(error);
            }
        }
    })();
};