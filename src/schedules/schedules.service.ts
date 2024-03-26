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
    repeatEndDate,
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
      repeatEndDate,
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
    const noRepeatSchedules = this.getNoRepeatSchedules({ userId });
    const repeatSchedules = this.getRepeatSchedules({ userId });
    const scheduleResults = await Promise.all([noRepeatSchedules, repeatSchedules]);

    return {
      noRepeatSchedules: scheduleResults[0],
      repeatSchedules: scheduleResults[1],
    };
  }

  async getNoRepeatSchedules({ userId }: { userId: number }) {
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

    return schedules;
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
    repeatEndDate,
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
        .set({ name, repeats, startDate, endDate, category, notification, repeatEndDate })
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
    const targetDate = dayjs(date).startOf('minute');

    const noRepeatSchedules = await this.scheduleRepository
      .createQueryBuilder('schedule')
      .innerJoin('schedule.User', 'user')
      .innerJoin('user.PushNotifications', 'pushNotifications')
      .where('user.plan_notification = 1')
      .andWhere('schedule.notification is not null')
      .andWhere('schedule.repeats is null')
      .andWhere('DATE(:date) = DATE(DATE_SUB(schedule.start_date, INTERVAL schedule.notification MINUTE))', {
        date,
      })
      .andWhere('TIME(:date) = TIME(DATE_SUB(schedule.start_date, INTERVAL schedule.notification MINUTE))', {
        date,
      })
      .select(['schedule', 'user', 'pushNotifications'])
      .getMany();

    const everyRepeatSchedules = await this.scheduleRepository
      .createQueryBuilder('schedule')
      .innerJoin('schedule.User', 'user')
      .innerJoin('user.PushNotifications', 'pushNotifications')
      .where('user.plan_notification = 1')
      .andWhere('schedule.notification is not null')
      .andWhere('schedule.repeats = "every"')
      .andWhere('TIME(:date) = TIME(DATE_SUB(schedule.start_date, INTERVAL schedule.notification MINUTE))', {
        date,
      })
      .select(['schedule', 'user', 'pushNotifications'])
      .getMany();

    const weekRepeatSchedules = await this.scheduleRepository
      .createQueryBuilder('schedule')
      .innerJoin('schedule.User', 'user')
      .innerJoin('user.PushNotifications', 'pushNotifications')
      .where('user.plan_notification = 1')
      .andWhere('schedule.notification is not null')
      .andWhere('schedule.repeats = "week"')
      .andWhere('MOD(DATEDIFF(:date, DATE_SUB(schedule.start_date, INTERVAL schedule.notification MINUTE)), 7) = 0', {
        date,
      })
      .andWhere('TIME(:date) = TIME(DATE_SUB(schedule.start_date, INTERVAL schedule.notification MINUTE))', {
        date,
      })
      .select(['schedule', 'user', 'pushNotifications'])
      .getMany();

    const twoWeeksRepeatSchedules = await this.scheduleRepository
      .createQueryBuilder('schedule')
      .innerJoin('schedule.User', 'user')
      .innerJoin('user.PushNotifications', 'pushNotifications')
      .where('user.plan_notification = 1')
      .andWhere('schedule.notification is not null')
      .andWhere('schedule.repeats = "twoWeeks"')
      .andWhere('MOD(DATEDIFF(:date, DATE_SUB(schedule.start_date, INTERVAL schedule.notification MINUTE)), 14) = 0', {
        date,
      })
      .andWhere('TIME(:date) = TIME(DATE_SUB(schedule.start_date, INTERVAL schedule.notification MINUTE))', {
        date,
      })
      .select(['schedule', 'user', 'pushNotifications'])
      .getMany();

    const monthRepeatSchedules = await this.scheduleRepository
      .createQueryBuilder('schedule')
      .innerJoin('schedule.User', 'user')
      .innerJoin('user.PushNotifications', 'pushNotifications')
      .where('user.plan_notification = 1')
      .andWhere('schedule.notification is not null')
      .andWhere('schedule.repeats = "month"')
      .andWhere('DAY(:date) = DAY(DATE_SUB(schedule.start_date, INTERVAL schedule.notification MINUTE))', {
        date,
      })
      .andWhere('TIME(:date) = TIME(DATE_SUB(schedule.start_date, INTERVAL schedule.notification MINUTE))', {
        date,
      })
      .select(['schedule', 'user', 'pushNotifications'])
      .getMany();

    const yearRepeatSchedules = await this.scheduleRepository
      .createQueryBuilder('schedule')
      .innerJoin('schedule.User', 'user')
      .innerJoin('user.PushNotifications', 'pushNotifications')
      .where('user.plan_notification = 1')
      .andWhere('schedule.notification is not null')
      .andWhere('schedule.repeats = "year"')
      .andWhere('MONTH(:date) = MONTH(DATE_SUB(schedule.start_date, INTERVAL schedule.notification MINUTE))', {
        date,
      })
      .andWhere('DAY(:date) = DAY(DATE_SUB(schedule.start_date, INTERVAL schedule.notification MINUTE))', {
        date,
      })
      .andWhere('TIME(:date) = TIME(DATE_SUB(schedule.start_date, INTERVAL schedule.notification MINUTE))', {
        date,
      })
      .select(['schedule', 'user', 'pushNotifications'])
      .getMany();

    const repeatSchedules = everyRepeatSchedules.concat(
      weekRepeatSchedules,
      twoWeeksRepeatSchedules,
      monthRepeatSchedules,
      yearRepeatSchedules
    );

    const endTimeFilteredSchedules = noRepeatSchedules.concat(repeatSchedules).filter((schedule) => {
      if (schedule.repeatEndDate) {
        const repeatEndDate = dayjs(schedule.repeatEndDate).startOf('minute');
        const isBeforeOrSame = !targetDate.isAfter(repeatEndDate);
        return isBeforeOrSame;
      }

      return true;
    });

    const schedulesWithPhoneTokens = endTimeFilteredSchedules.map((schedule) => {
      return {
        scheduleName: schedule.name,
        phoneTokens: schedule.User.PushNotifications.map((pushNotification) => pushNotification.phoneToken),
        notification: schedule.notification,
      };
    });

    return schedulesWithPhoneTokens;
  }

  async getTodaySchedule({ userId, date }: { userId: number; date: string }) {
    const targetDate = dayjs(date).startOf('minute');
    const targetMonth = targetDate.get('month');
    const targetDay = targetDate.get('day');
    const targetDayOfMonth = targetDate.get('date');
    const noRepeatTodaySchedules = await this.scheduleRepository
      .createQueryBuilder('schedule')
      .where(
        'schedule.UserId = :userId and schedule.removed_at is null and DATE(start_date) = :date and schedule.repeats is null',
        {
          userId,
          date,
        }
      )
      .getMany();
    const repeatTodaySchedules = await this.scheduleRepository
      .createQueryBuilder('schedule')
      .where(
        'schedule.UserId = :userId and schedule.removed_at is null and DATE(start_date) = :date and schedule.repeats is not null',
        {
          userId,
          date,
        }
      )
      .getMany();

    const filteredRepeatTodaySchedules = repeatTodaySchedules.filter((schedule) => {
      const scheduleDate = dayjs(schedule.startDate).startOf('minute');
      const scheduleMonth = scheduleDate.get('month');
      const scheduleDay = scheduleDate.get('day');
      const scheduleDayOfMonth = scheduleDate.get('date');
      const dateDiff = targetDate.diff(scheduleDate) / 1000 / 24 / 60 / 60;
      const isSameDay = targetDay === scheduleDay;
      const isSameDayOfMonth = targetDayOfMonth === scheduleDayOfMonth;
      const isSameMonth = targetMonth === scheduleMonth;

      const everyCondition = schedule.repeats === 'every';
      const weekCondition = schedule.repeats === 'week' && isSameDay;
      const twoWeeksCondition = schedule.repeats === 'twoWeeks' && (dateDiff === 0 || dateDiff % 14 === 0);
      const monthCondition = schedule.repeats === 'month' && isSameDayOfMonth;
      const yearCondition = schedule.repeats === 'year' && isSameMonth && isSameDayOfMonth;

      return everyCondition || weekCondition || twoWeeksCondition || monthCondition || yearCondition;
    });

    return noRepeatTodaySchedules.concat(filteredRepeatTodaySchedules);
  }
}
