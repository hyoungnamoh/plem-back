import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserDeco } from 'src/common/decorators/user.decorator';
import { Users } from 'src/entities/Users';
import { CreateNoticeDto } from './create-notices.dto';
import { NoticeService } from './notices.service';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { SuccessResponseInterceptor } from 'src/common/interceptors/successResponse.interceptor';
import { UpdateNoticeDto } from './update-notices.dto';

try {
  fs.readdirSync('notice-images');
} catch (error) {
  console.info('notice-images 폴더가 없어 notice-images 폴더를 생성합니다.');
  fs.mkdirSync('notice-images');
}

@Controller('notices')
@UseInterceptors(SuccessResponseInterceptor)
export class NoticeController {
  constructor(private noticeService: NoticeService) {}

  @Post('')
  @UseInterceptors(
    FilesInterceptor('contents', 10, {
      storage: multer.diskStorage({
        destination(req, file, cb) {
          cb(null, 'notice-images/');
        },
        filename(req, file, cb) {
          const ext = path.extname(file.originalname);
          cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 },
    })
  )
  @UseGuards(JwtAuthGuard)
  // FIXME 관리자만 사용 가능하도록 수정
  async postNotice(
    @UploadedFiles() contents: Express.Multer.File[],
    @Body() body: CreateNoticeDto,
    @UserDeco() user: Users
  ) {
    return await this.noticeService.postNotice({ ...body, contents, userId: user.id });
  }

  @Get('')
  @UseGuards(JwtAuthGuard)
  getNotices() {
    return this.noticeService.getNotices();
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  getNotice(@Param() params: { id: number }) {
    return this.noticeService.getNotice({ id: params.id });
  }

  @Put('')
  @UseGuards(JwtAuthGuard)
  updateNotice(@Body() body: UpdateNoticeDto, @UserDeco() user: Users) {
    return this.noticeService.updateNotice({ ...body, userId: user.id });
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  deleteNotice(@Param() param: { id: number }, @UserDeco() user: Users) {
    return this.noticeService.deleteNotice({ ...param, userId: user.id });
  }
}
