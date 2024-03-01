import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1709307997565 implements MigrationInterface {
  name = 'Migrations1709307997565';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`schedules\` ADD \`repeat_end_date\` varchar(100) NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`schedules\` DROP COLUMN \`repeat_end_date\``);
  }
}
