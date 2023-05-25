import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubPlans } from 'src/entities/SubPlans';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class SubPlansService {
  constructor(
    @InjectRepository(SubPlans)
    private subPlanRepository: Repository<SubPlans>,
    private datasource: DataSource
  ) {}

  async deleteSubPlans(ids: { id: number }[]) {
    const queryRunner = this.datasource.createQueryRunner();
    try {
      queryRunner.connect();
      queryRunner.startTransaction();
      ids.map(async (id) => {
        const deletedResult = await queryRunner.manager
          .getRepository(SubPlans)
          .createQueryBuilder()
          .delete()
          .from(SubPlans)
          .where('id = :id', { id })
          .execute();
        if (deletedResult.affected && deletedResult.affected < 1) {
          throw new NotFoundException('삭제할 일정이 존재하지 않습니다.');
        }
      });

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
