import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1717751075655 implements MigrationInterface {
  name = 'Migrations1717751075655';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`all_plans_achieved_histories\` CHANGE \`date\` \`date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`all_plans_achieved_histories\` CHANGE \`date\` \`date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`
    );
  }
}
