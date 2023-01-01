import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { UsersService } from 'src/users/users.service';
import { EmailService } from './email.service';

@Module({
  providers: [EmailService, UsersService],
  exports: [EmailService],
  imports: [TypeOrmModule.forFeature([Users])],
})
export class EmailModule {}
