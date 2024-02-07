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
        return { sent_message: response };
      })
      .catch((error) => {
        return { error: error.code };
      });
    return result;
  }

  async postFcmTopic({
    topic,
    title,
    message,
    channel,
    userId,
  }: {
    topic: string;
    title: string;
    message: string;
    channel: string;
    userId: number;
  }) {
    // userId 어드민 체크
    if (false) {
      return;
    }
    const result = await admin
      .messaging()
      .send({
        topic: topic,
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
        return { sent_message: response };
      })
      .catch((error) => {
        return { error: error.code };
      });
    return result;
  }
}
