import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1707319119721 implements MigrationInterface {
  name = 'Migrations1707319119721';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`inquiries\` ADD \`type\` varchar(100) NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`refresh_token\` \`refresh_token\` varchar(400) NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`refresh_token\` \`refresh_token\` varchar(400) NULL`);
    await queryRunner.query(`ALTER TABLE \`inquiries\` DROP COLUMN \`type\``);
  }
}
