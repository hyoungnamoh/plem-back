import { PickType } from '@nestjs/swagger';
import { Notices } from 'src/entities/Notices';

export class CreateNoticeDto extends PickType(Notices, ['title'] as const) {
  contents: Express.Multer.File[];
}
