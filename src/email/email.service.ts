import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService, private readonly usersService: UsersService) {}

  async send({
    tos,
    subject,
    templateName,
    context,
  }: {
    tos: string[];
    subject: string;
    templateName: string;
    context: any;
  }): Promise<boolean> {
    await this.mailerService.sendMail({
      to: tos.join(', '),
      subject,
      template: `${templateName}`,
      context,
    });

    return true;
  }

  async sendVerificationCode({ email, isReset }: { email: string; isReset?: boolean }) {
    try {
      if (!email) {
        throw new BadRequestException('이메일을 입력해주세요.');
      }

      if (!isReset) {
        await this.usersService.checkDuplicateEmail({ email });
      } else {
        const user = await this.usersService.getUserFromEmail({ email });
        if (!user || user.removedAt) throw new NotFoundException('가입되지 않은 계정입니다.');
      }

      const verificationCode = Math.floor(100000 + Math.random() * 900000);
      if (verificationCode < 10000 || verificationCode > 1000000) {
        throw new InternalServerErrorException('이메일 전송에 실패했습니다. 다시 시도해주세요.');
      }

      const result = await this.send({
        tos: [email],
        subject: 'PLEM 계정 인증',
        templateName: 'signup.ejs',
        context: {
          verificationCode: verificationCode,
          year: new Date().getFullYear(),
        },
      });

      if (!result) {
        throw new InternalServerErrorException('이메일 전송에 실패했습니다. 다시 시도해주세요.');
      }

      return { verificationCode };
    } catch (error) {
      throw error;
    }
  }
}
