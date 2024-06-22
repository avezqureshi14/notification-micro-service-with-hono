import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { prettyJSON } from 'hono/pretty-json';
import { getPosts } from './model';
import { sendNotificationController } from './controllers/notification';

// Create a new instance of Hono
const app = new Hono();

// Middleware setup
app.use(prettyJSON()); // This middleware will pretty-format JSON responses
app.use(cors()); // Enable CORS for all routes, adjust origin settings as needed

// Routes setup
app.get('/', (c) => c.text('Pretty Blog API'));

// Route for fetching posts
app.get('/posts', (c) => {
    const { limit, offset } = c.req.query();
    const posts = getPosts({ limit, offset });
    return c.json({ posts });
});

// Custom route for sending notifications
app.post('/send-notification', sendNotificationController);

// 404 handler
app.notFound((c) => c.json({ message: 'Not Found', ok: false }, 404));

export default app;
