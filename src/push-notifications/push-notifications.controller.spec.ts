import { Test, TestingModule } from '@nestjs/testing';
import { PushNotificationsController } from './push-notifications.controller';

describe('PushNotificationsController', () => {
  let controller: PushNotificationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PushNotificationsController],
    }).compile();

    controller = module.get<PushNotificationsController>(PushNotificationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
