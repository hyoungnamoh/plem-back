import { PickType } from '@nestjs/swagger';
import { WithdrwalReasons } from 'src/entities/WithdrwalReasons';

export class DeleteUserDto extends PickType(WithdrwalReasons, ['type', 'reason'] as const) {}
