import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FcmService {
  async fcm(token: string, title: string, message: string, channel: string) {
    const result = await admin
      .messaging()
      .send({
        token: token,
        notification: {
          title: title,
          body: message,
        },
        android: {
          notification: {
            channelId: channel,
            priority: 'high',
            defaultVibrateTimings: true,
            defaultSound: true,
          },
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              category: channel,
              defaultSound: true,
            },
          },
        },
      })
      .then((response) => {
        // Response is a message ID string.
        // console.log('Successfully sent message:', response);
        // return true;
        return { sent_message: response };
      })
      .catch((error) => {
        // console.log('error');
        // console.log(error.code);
        // return false;
        return { error: error.code };
      });
    return result;
  }
}
