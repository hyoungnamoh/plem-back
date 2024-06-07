import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1717603265282 implements MigrationInterface {
  name = 'Migrations1717603265282';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`goals\` CHANGE \`goalCount\` \`goal_count\` int NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`goals\` CHANGE \`goal_count\` \`goalCount\` int NOT NULL`);
  }
}
