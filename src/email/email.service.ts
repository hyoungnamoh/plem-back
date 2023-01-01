import { HttpException, Injectable } from '@nestjs/common';
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

  async sendVerificationCode({ email }) {
    await this.usersService.checkDuplicateEmail({ email });
    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    if (!email) {
      throw new HttpException('이메일을 입력해주세요.', 400);
    }

    if (verificationCode < 10000 || verificationCode > 1000000) {
      throw new HttpException('이메일 전송에 실패했습니다. 다시 시도해주세요.', 500);
    }

    const result = await this.send({
      tos: [email],
      subject: '플렘 인증번호',
      templateName: 'signup.ejs',
      context: {
        verificationCode: verificationCode,
      },
    });

    if (!result) {
      throw new HttpException('이메일 전송에 실패했습니다. 다시 시도해주세요.', 500);
    }

    return { verificationCode };
  }
}
