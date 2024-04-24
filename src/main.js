import { throwIfMissing, sendPushNotification } from './utils.js';

export default async ({ req, res, log, error }) => {
  throwIfMissing(process.env, [
    'FCM_PROJECT_ID',
    'FCM_PRIVATE_KEY',
    'FCM_CLIENT_EMAIL',
    'FCM_DATABASE_URL',
  ]);

  try {
    throwIfMissing(req.body, ['deviceToken', 'message']);
    throwIfMissing(req.body.message, ['title', 'body']);
  } catch (err) {
    return res.json({ ok: false, error: err.message }, 400);
  }

  log(`Sending message to device: ${req.body.deviceToken}`);

  try {
    const response = await sendPushNotification({
      notification: {
        title: title,
        body: body
      },
      data: {
        desc: body,
        time: Date.now().toString(),
      },
      token: req.body.deviceToken,
    });

  log(req);
    log(`Successfully sent message: ${response}`);


    return res.json({ ok: true, messageId: response });
  } catch (e) {
    error(e);
    log("there was an error");
    log(e);
    return res.json({ ok: false, error: 'Failed to send the message' }, 500);
  }
};
