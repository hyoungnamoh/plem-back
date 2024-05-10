import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Holidays } from 'src/entities/Holidays';
import { DataSource } from 'typeorm';

type ApiHoliday = { dateKind: string; dateName: string; isHoliday: 'Y' | 'N'; locdate: number; seq: number };

@Injectable()
export class CalendarService {
  constructor(
    private readonly usersService: UsersService,
    private readonly httpService: HttpService,
    private datasource: DataSource
  ) {}
  private readonly logger = new Logger('CalendarService');

  async getHolidays() {
    const queryRunner = this.datasource.createQueryRunner();
    queryRunner.connect();
    queryRunner.startTransaction();

    try {
      const dd = await queryRunner.manager.getRepository(Holidays).find();
      return dd;
    } catch (error) {
      this.logger.log(`getHolidays ${error}`);
      throw new InternalServerErrorException('공휴일 정보를 가져오는데 실패했습니다.');
    }
  }

  async addHolidays({ userId, startYear, endYear }: { userId: number; startYear: number; endYear?: number }) {
    const queryRunner = this.datasource.createQueryRunner();
    queryRunner.connect();
    queryRunner.startTransaction();

    try {
      const user = await this.usersService.getUserById({ userId });
      if (!user) {
        throw new NotFoundException('유저 정보가 없습니다. 재로그인 후 다시 시도해주세요.');
      }

      for (let year = startYear; year <= (endYear || startYear); year++) {
        const data = await firstValueFrom(
          this.httpService.get<{
            response: {
              body: {
                items: {
                  item: ApiHoliday[];
                };
              };
            };
          }>(
            `http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo?serviceKey=${process.env.SERVICE_KEY}&pageNo=1&numOfRows=100&solYear=${year}`
          )
        );

        await Promise.all(
          data.data.response.body.items.item.map(async (item) => {
            const holiday = new Holidays();
            const dateString = String(item.locdate).slice(4);
            const copiedItem = { ...item };
            const holidayYear = Number(String(copiedItem.locdate).slice(0, 4));
            const holidayMonth = Number(String(copiedItem.locdate).slice(4, 6)) - 1;
            const holidayDate = Number(String(copiedItem.locdate).slice(6, 8));

            if (dateString === '1225') {
              copiedItem.dateName = '성탄절';
            }
            if (dateString === '0101') {
              copiedItem.dateName = '신정';
            }

            holiday.date = new Date(holidayYear, holidayMonth, holidayDate);
            holiday.dateKind = copiedItem.dateKind;
            holiday.name = copiedItem.dateName;

            return queryRunner.manager.getRepository(Holidays).save(holiday);
          })
        );
      }
      await queryRunner.commitTransaction();
      return;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
