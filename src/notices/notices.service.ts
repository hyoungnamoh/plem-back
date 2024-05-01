import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notices } from 'src/entities/Notices';
import { Users } from 'src/entities/Users';
import { FcmService } from 'src/fcm/fcm.service';
import { DataSource, Repository } from 'typeorm';
import { CreateNoticeDto } from './create-notices.dto';
import { UpdateNoticeDto } from './update-notices.dto';

@Injectable()
export class NoticeService {
  private readonly logger = new Logger('NoticeService');
  constructor(
    @InjectRepository(Notices)
    private noticeRepository: Repository<Notices>,
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    private fcmService: FcmService,
    private datasource: DataSource
  ) {}

  async postNotice({ contents, title, userId }: CreateNoticeDto & { userId: number }) {
    const queryRunner = this.datasource.createQueryRunner();
    queryRunner.connect();
    queryRunner.startTransaction();

    try {
      const contentPaths = contents.map((content) => content.path);
      await queryRunner.manager.getRepository(Notices).save({ title, contents: JSON.stringify(contentPaths) });
      const targetUsers = await this.userRepository
        .createQueryBuilder('user')
        .innerJoin('user.PushNotifications', 'pushNotifications')
        .where('user.notice_notification = 1')
        .select(['user', 'pushNotifications'])
        .getMany();
      targetUsers.map((targetUser) => {
        targetUser.PushNotifications.map((pushNotification) => {
          this.fcmService.fcm(pushNotification.phoneToken, '플렘', title, 'notice', 'noticeListPage');
        });
      });

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getNotices() {
    const notices = await this.noticeRepository
      .createQueryBuilder('notices')
      .where('notices.removed_at is null')
      .orderBy('notices.createdAt', 'DESC')
      .getMany();

    const parsedNotices = notices.map((notice) => {
      return { ...notice, contents: JSON.parse(notice.contents) };
    });

    return parsedNotices;
  }

  async getNotice({ id }: { id: number }) {
    await this.increaseViewCount({ id });
    const notice = await this.noticeRepository
      .createQueryBuilder('notices')
      .where('notices.removed_at is null and notices.id = :id', { id })
      .getOne();

    if (!notice) {
      throw new NotFoundException('존재하지 않는 공지사항 입니다.');
    }
    notice.contents = JSON.parse(notice.contents);

    return notice;
  }

  async increaseViewCount({ id }: { id: number }) {
    const queryRunner = this.datasource.createQueryRunner();
    queryRunner.connect();
    queryRunner.startTransaction();

    const notice = await queryRunner.manager.getRepository(Notices).findOne({
      where: { id },
    });

    if (!notice) {
      throw new NotFoundException('존재하지 않는 공지사항입니다.');
    }

    const result = await queryRunner.manager
      .getRepository(Notices)
      .createQueryBuilder()
      .update(Notices)
      .set({ viewCount: notice.viewCount + 1 })
      .where('id = :id and removed_at is null', { id })
      .execute();

    if (result.affected === 0) {
      this.logger.error(`NoticeService increaseViewCount 공지사항 조회수 증가 실패`);
    }

    await queryRunner.commitTransaction();
  }

  async updateNotice({ contents, title, id }: UpdateNoticeDto & { userId: number }) {
    const queryRunner = this.datasource.createQueryRunner();
    queryRunner.connect();
    queryRunner.startTransaction();

    try {
      const notice = await queryRunner.manager.getRepository(Notices).findOne({
        where: { id },
      });
      if (!notice) {
        throw new NotFoundException('존재하지 않는 계획표입니다.');
      }

      const result = await queryRunner.manager
        .getRepository(Notices)
        .createQueryBuilder()
        .update(Notices)
        .set({ contents: JSON.stringify(contents), title })
        .where('id = :id and removed_at is null', { id })
        .execute();

      if (result.affected === 0) {
        throw new NotFoundException('공지사항 수정에 실패했습니다.');
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteNotice({ id, userId }: { id: number; userId: number }) {
    const notice = await this.noticeRepository
      .createQueryBuilder('notice')
      .where('notice.id = :id and removed_at is null', { id })
      .getOne();
    if (!notice) {
      throw new NotFoundException('존재하지 않는 계획표입니다.');
    }
    await this.noticeRepository.softDelete(id);
  }
}
