import { PickType } from '@nestjs/swagger';
import { Inquiries } from 'src/entities/Inquiries';

export class CreateInquiryDto extends PickType(Inquiries, ['type', 'email', 'title', 'content'] as const) {}
