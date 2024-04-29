import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1714401842458 implements MigrationInterface {
  name = 'Migrations1714401842458';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`users\` ADD \`notice_notification\` tinyint(1) NOT NULL DEFAULT '0'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`notice_notification\``);
  }
}
