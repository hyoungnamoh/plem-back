import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1717425299389 implements MigrationInterface {
  name = 'Migrations1717425299389';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`schedules\` ADD \`memo\` varchar(400) NOT NULL DEFAULT ''`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`schedules\` DROP COLUMN \`memo\``);
  }
}
