import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1717418139228 implements MigrationInterface {
  name = 'Migrations1717418139228';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`goals\` CHANGE \`count\` \`goalCount\` int NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`goals\` CHANGE \`goalCount\` \`count\` int NOT NULL`);
  }
}
