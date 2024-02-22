import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WithdrwalReasons } from 'src/entities/WithdrwalReasons';
import { Repository } from 'typeorm';

@Injectable()
export class WithdrawalReasonsService {
  constructor(
    @InjectRepository(WithdrwalReasons)
    private withdrawalReasonRepository: Repository<WithdrwalReasons>
  ) {}

  // async getWithdrawalReasons({ ty}) {
  //   return await this.withdrawalReasonRepository.find({
  //     where:
  //   });
  // }

  async postWithdrawalReason(withdrawalReason: Pick<WithdrwalReasons, 'reason' | 'type' | 'userId'>) {
    if (!withdrawalReason.userId) {
      throw new BadRequestException('사용자 정보가 없습니다. 재로그인 후 다시 시도해주세요.');
    }
    if (!withdrawalReason.type) {
      throw new BadRequestException('탈퇴 사유를 선택해주세요.');
    }

    if (withdrawalReason.type === 'etc' && !withdrawalReason.reason) {
      throw new BadRequestException('탈퇴 사유를 입력해주세요');
    }

    await this.withdrawalReasonRepository.save(withdrawalReason);
  }
}
