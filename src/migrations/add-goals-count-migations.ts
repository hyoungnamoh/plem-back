import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1717417877419 implements MigrationInterface {
  name = 'Migrations1717417877419';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`goals\` ADD \`count\` int NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`goals\` DROP COLUMN \`count\``);
  }
}
