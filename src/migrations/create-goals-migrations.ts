import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1717310613463 implements MigrationInterface {
  name = 'Migrations1717310613463';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX \`IDX_d5b210a41580503d1429c2c29f\` ON \`sub_plan_histories\``);
    await queryRunner.query(
      `CREATE TABLE \`goals\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(200) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`removedAt\` datetime(6) NULL, INDEX \`id\` (\`id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX \`id\` ON \`goals\``);
    await queryRunner.query(`DROP TABLE \`goals\``);
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_d5b210a41580503d1429c2c29f\` ON \`sub_plan_histories\` (\`id\`)`
    );
  }
}
