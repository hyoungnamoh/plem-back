import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { Schedules } from 'src/entities/Schedules';
import { DataSource, Repository } from 'typeorm';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedules)
    private scheduleRepository: Repository<Schedules>,
    private datasource: DataSource
  ) {}

  async postSchedule({
    name,
    userId,
    repeats,
    startDate,
    endDate,
    category,
    notification,
  }: CreateScheduleDto & { userId: number }) {
    const queryRunner = this.datasource.createQueryRunner();
    queryRunner.connect();
    queryRunner.startTransaction();

    const schedule = this.scheduleRepository.create({
      UserId: userId,
      name,
      repeats,
      startDate,
      endDate,
      category,
      notification,
    });

    try {
      await queryRunner.manager.getRepository(Schedules).save(schedule);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getAllSchedules({ userId }: { userId: number }) {
    const noRepeatSchedules = this.getSchedules({ userId });
    const repeatSchedules = this.getRepeatSchedules({ userId });
    const scheduleResults = await Promise.all([noRepeatSchedules, repeatSchedules]);

    return {
      noRepeatSchedules: scheduleResults[0],
      repeatSchedules: scheduleResults[1],
    };
  }

  async getSchedules({ userId }: { userId: number }) {
    const schedules = await this.scheduleRepository
      .createQueryBuilder('schedule')
      .where('schedule.UserId = :userId and schedule.removed_at is null and schedule.repeats is null', {
        userId,
      })
      .orderBy('start_date', 'ASC')
      .getMany();

    if (schedules.length === 0) {
      return [];
    }

    const noRepeatSchedules = schedules.filter((schedule) => schedule.repeats === null);
    const firstScheduleDate = dayjs(schedules[0].startDate);
    const lastScheduleDate = dayjs(schedules[schedules.length - 1].endDate);
    const noRepeatScheduleMap = {};

    for (let year = firstScheduleDate.get('year'); year <= lastScheduleDate.get('year'); year++) {
      noRepeatScheduleMap[year] = {};
      for (let month = 0; month <= 11; month++) {
        const yearMonth = dayjs().set('year', year).set('month', month);
        noRepeatScheduleMap[year][month] = {};
        for (let date = 1; date <= yearMonth.daysInMonth(); date++) {
          noRepeatScheduleMap[year][month][date] = [];
        }
      }
    }

    noRepeatSchedules.map((schedule) => {
      const startDate = dayjs(schedule.startDate);
      const endDate = dayjs(schedule.endDate);
      const sameDate = startDate.isSame(endDate, 'day');
      if (sameDate) {
        noRepeatScheduleMap[startDate.get('year')][startDate.get('month')][startDate.get('date')].push(schedule);
        return;
      } else {
        for (let date = startDate; date.isBefore(endDate); date = date.add(1, 'day')) {
          noRepeatScheduleMap[date.get('year')][date.get('month')][date.get('date')].push(schedule);
        }
      }
    });

    return noRepeatScheduleMap;
  }

  async getRepeatSchedules({ userId }: { userId: number }) {
    const schedules = await this.scheduleRepository
      .createQueryBuilder('schedule')
      .where('schedule.UserId = :userId and schedule.removed_at is null and schedule.repeats is not null', {
        userId,
      })
      .orderBy('start_date', 'ASC')
      .getMany();

    if (schedules.length === 0) {
      return {
        yearlyRepeatSchedules: [],
        monthlyRepeatSchedules: [],
        twoWeeklyRepeatSchedules: [],
        weeklyRepeatSchedules: [],
        dailyRepeatSchedules: [],
      };
    }

    const yearlyRepeatSchedules = schedules.filter((schedule) => schedule.repeats === 'year');
    const monthlyRepeatSchedules = schedules.filter((schedule) => schedule.repeats === 'month');
    const twoWeeklyRepeatSchedules = schedules.filter((schedule) => schedule.repeats === 'twoWeeks');
    const weeklyRepeatSchedules = schedules.filter((schedule) => schedule.repeats === 'week');
    const dailyRepeatSchedules = schedules.filter((schedule) => schedule.repeats === 'every');

    return {
      yearlyRepeatSchedules,
      monthlyRepeatSchedules,
      twoWeeklyRepeatSchedules,
      weeklyRepeatSchedules,
      dailyRepeatSchedules,
    };
  }

  async updateSchedule({
    name,
    repeats,
    startDate,
    endDate,
    category,
    notification,
    id,
    userId,
  }: UpdateScheduleDto & { userId: number }) {
    const queryRunner = this.datasource.createQueryRunner();
    queryRunner.connect();
    queryRunner.startTransaction();

    try {
      const schedule = await queryRunner.manager.getRepository(Schedules).findOne({
        where: { id },
      });
      if (!schedule) {
        throw new NotFoundException('존재하지 않는 일정표입니다.');
      }

      const result = await queryRunner.manager
        .getRepository(Schedules)
        .createQueryBuilder()
        .update(Schedules)
        .set({ name, repeats, startDate, endDate, category, notification })
        .where('id = :id and removed_at is null and UserId = :userId', { id, userId })
        .execute();

      if (result.affected === 0) {
        throw new NotFoundException('순서 변경에 실패했습니다. 다시 시도해주세요.');
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteSchedule({ id, userId }: { id: number; userId: number }) {
    const schedule = await this.scheduleRepository
      .createQueryBuilder('schedule')
      .where('schedule.id = :id and removed_at is null and schedule.UserId = :userId', { id, userId })
      .getOne();

    if (!schedule) {
      throw new NotFoundException('존재하지 않는 일정표입니다.');
    }

    await this.scheduleRepository.delete(id);
  }

  async getPhoneTokensBySchedule({ date }: { date: string }) {
    const schedulesWithUser = await this.scheduleRepository
      .createQueryBuilder('schedule')
      .innerJoin('schedule.User', 'user')
      .innerJoin('user.PushNotifications', 'pushNotifications')
      .where('user.plan_notification = 1')
      .andWhere('schedule.start_date = DATE_ADD(:date, INTERVAL schedule.notification MINUTE)', { date })
      .select(['schedule', 'user', 'pushNotifications'])
      .getMany();

    const schedulesWithPhoneTokens = schedulesWithUser.map((schedule) => {
      return {
        scheduleName: schedule.name,
        phoneTokens: schedule.User.PushNotifications.map((pushNotification) => pushNotification.phoneToken),
        notification: schedule.notification,
      };
    });
    return schedulesWithPhoneTokens;
  }
}
