import { Controller, Post, UseGuards, Body, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserDeco } from 'src/common/decorators/user.decorator';
import { SuccessResponseInterceptor } from 'src/common/interceptors/successResponse.interceptor';
import { Users } from 'src/entities/Users';
import { CreateInquiryDto } from './dto/create-inquery.dto';
import { InquiriesService } from './inquiries.service';

@Controller('inquiries')
@UseInterceptors(SuccessResponseInterceptor)
export class InquiriesController {
  constructor(private inquiryService: InquiriesService) {}

  @Post('')
  @UseGuards(JwtAuthGuard)
  async postInquiry(
    @Body()
    body: CreateInquiryDto,
    @UserDeco() user: Users
  ) {
    return await this.inquiryService.postInquiry({ ...body, userId: user.id });
  }
}
