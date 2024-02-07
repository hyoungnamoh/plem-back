import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PushNotifications } from 'src/entities/PushNotifications';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class PushNotificationsService {
  constructor(
    @InjectRepository(PushNotifications)
    private pushNotificationsRepository: Repository<PushNotifications>,
    private datasource: DataSource
  ) {}

  async postPushNotification({ phoneToken, userId }: { phoneToken: PushNotifications['phoneToken']; userId: number }) {
    const queryRunner = this.datasource.createQueryRunner();
    queryRunner.connect();
    try {
      const registeredPhoneToken = await queryRunner.manager.getRepository(PushNotifications).findOne({
        where: { phoneToken },
      });
      if (!registeredPhoneToken) {
        await queryRunner.manager.getRepository(PushNotifications).save({ phoneToken, UserId: userId });
      }
    } catch (error) {
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // async getPushNotifications() {
  //   const notices = await this.pushNotificationsRepository
  //     .createQueryBuilder('notices')
  //     .where('notices.removed_at is null')
  //     .getMany();

  //   const parsedPushNotifications = notices.map((notice) => {
  //     return { ...notice, contents: JSON.parse(notice.contents) };
  //   });

  //   return parsedPushNotifications;
  // }

  // async getPushNotification({ id }: { id: number }) {
  //   const notice = await this.pushNotificationsRepository
  //     .createQueryBuilder('notices')
  //     .where('notices.removed_at is null and notices.id = :id', { id })
  //     .getOne();

  //   if (!notice) {
  //     throw new NotFoundException('존재하지 않는 공지사항 입니다.');
  //   }
  //   notice.contents = JSON.parse(notice.contents);

  //   return notice;
  // }

  async deletePushNotification({ phoneToken, userId }: { phoneToken: string; userId: number }) {
    const pushNotification = await this.pushNotificationsRepository
      .createQueryBuilder('pushNotification')
      .where('pushNotification.phoneToken = :phoneToken and pushNotification.user_id = :userId', { phoneToken, userId })
      .getOne();
    if (!pushNotification) {
      throw new NotFoundException('존재하지 않는 토큰입니다.');
    }

    await this.pushNotificationsRepository.delete(pushNotification.id);
  }
}
