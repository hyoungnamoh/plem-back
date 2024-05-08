import { Injectable } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { Inquiries } from 'src/entities/Inquiries';
import { DataSource } from 'typeorm';
import { CreateInquiryDto } from './dto/create-inquery.dto';

@Injectable()
export class InquiriesService {
  constructor(private datasource: DataSource, private emailService: EmailService) {}

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
      this.emailService.send({
        tos: ['plemdeveloper@gmail.com'],
        subject: '플렘 사용자 문의',
        templateName: 'registerInquiry.ejs',
        context: {
          type,
          email,
          title,
          content,
          userId,
        },
      });

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
