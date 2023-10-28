import { PickType } from '@nestjs/swagger';
import { Notices } from 'src/entities/Notices';

export class UpdateNoticeDto extends PickType(Notices, ['title', 'id'] as const) {
  contents: Express.Multer.File[];
}
