import { Context } from 'hono';
import { NotificationService } from '../services/service';

interface NotificationRequest {
    token: string;
    payload: any;
    platform: string;
}

export const sendNotificationController = async (c: Context) => {
    //@ts-expect-error
    const { token, payload, platform } = c.req.body as NotificationRequest;

    try {
        await NotificationService.sendNotification(platform, token, payload);
        return c.json({ message: 'Notification sent successfully' });
    } catch (error) {
        console.error('Error sending notification:', error);
        return c.json({ message: 'Error sending notification' }, 500);
    }
};
