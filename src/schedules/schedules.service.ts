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

  async getSchedules({ userId, date }: { userId: number; date: string }) {
    const targetDate = dayjs(date);
    const schedules = await this.scheduleRepository
      .createQueryBuilder('schedule')
      .where(
        'schedule.UserId = :userId and schedule.removed_at is null and YEAR(start_date) = :year AND MONTH(start_date) = :month',
        { userId, year: targetDate.get('year'), month: targetDate.get('month') + 1 }
      )
      .getMany();
    const sheduleCalendar = {};
    Array.from({ length: dayjs(targetDate).daysInMonth() }, (_, index) => index + 1).map((date) => {
      sheduleCalendar[date] = schedules.filter((schedule) => {
        const startDate = dayjs(schedule.startDate);
        return startDate.get('date') === date;
      });
    });

    return sheduleCalendar;
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
}
