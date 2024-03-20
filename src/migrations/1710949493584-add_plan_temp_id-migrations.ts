import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1710949493584 implements MigrationInterface {
  name = 'Migrations1710949493584';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`plans\` ADD \`temp_id\` varchar(100) NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`refresh_token\` \`refresh_token\` varchar(400) NULL`);
    await queryRunner.query(`ALTER TABLE \`inquiries\` CHANGE \`content\` \`content\` varchar(1000) NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`inquiries\` CHANGE \`content\` \`content\` varchar(1000) NULL`);
    await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`refresh_token\` \`refresh_token\` varchar(400) NULL`);
    await queryRunner.query(`ALTER TABLE \`plans\` DROP COLUMN \`temp_id\``);
  }
}
