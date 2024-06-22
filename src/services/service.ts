import { Hono } from 'hono'
import * as admin from 'firebase-admin'
import * as apn from '@parse/node-apn'
import { cors } from 'hono/cors'
import path from 'node:path'
import serviceAccount from './api-project-893757878307-firebase-adminsdk-yl6ee-bf8fda3836.json'

const p8FilePath = path.join(__dirname, 'AuthKey_7NYZ45GBNB.p8')

export interface INotificationService {
    sendNotification(token: string, payload: any): Promise<void>
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

class FirebaseNotificationService implements INotificationService {
    async sendNotification(token: string, payload: any): Promise<void> {
        const message = {
            data: payload,
            token: token,
        }
        await admin.messaging().send(message)
    }
}

class APNNotificationService implements INotificationService {
    private apnProvider: apn.Provider

    constructor() {
        this.apnProvider = new apn.Provider({
            token: {
                key: p8FilePath,
                keyId: '7NYZ45GBNB',
                teamId: 'Q283KSLU7N',
            },
            production: false,
        })
    }

    async sendNotification(token: string, payload: any): Promise<void> {
        const note = new apn.Notification({
            expiry: Math.floor(Date.now() / 1000) + 3600,
            badge: 3,
            sound: 'ping.aiff',
            alert: '\uD83D\uDCE7 \u2709 You have a new message',
            payload: payload,
            topic: process.env.APN_BUNDLE_ID || '<your-app-bundle-id>',
        })

        await this.apnProvider.send(note, token)
    }
}

export class NotificationServiceFactory {
    static getNotificationService(platform: string): INotificationService {
        if (platform === 'android') {
            return new FirebaseNotificationService()
        } else if (platform === 'ios') {
            return new APNNotificationService()
        } else {
            throw new Error('Invalid platform specified')
        }
    }
}

export class NotificationService {
    static async sendNotification(platform: string, token: string, payload: any): Promise<void> {
        const service = NotificationServiceFactory.getNotificationService(platform)
        await service.sendNotification(token, payload)
    }
}

const app = new Hono()
app.use('/api/*', cors())

app.post('/api/notifications', async (c) => {
    const { platform, token, payload } = await c.req.json()
    try {
        await NotificationService.sendNotification(platform, token, payload)
        return c.json({ message: 'Notification sent successfully', ok: true })
    } catch (error: any) {
        return c.json({ message: error.message, ok: false }, 500)
    }
})

app.get('/', (c) => c.text('Notification Service API'))

export default app
