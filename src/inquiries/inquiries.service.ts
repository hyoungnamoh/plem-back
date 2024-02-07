import { Injectable } from '@nestjs/common';
import { Inquiries } from 'src/entities/Inquiries';
import { DataSource } from 'typeorm';
import { CreateInquiryDto } from './dto/create-inquery.dto';

@Injectable()
export class InquiriesService {
  constructor(private datasource: DataSource) {}

  async postInquiry({
    type,
    email,
    title,
    content,
    userId,
  }: CreateInquiryDto & {
    userId: number;
  }) {
    const queryRunner = this.datasource.createQueryRunner();
    queryRunner.connect();
    queryRunner.startTransaction();

    try {
      const result = await queryRunner.manager
        .getRepository(Inquiries)
        .save({ type, email, title, content, UserId: userId });
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
