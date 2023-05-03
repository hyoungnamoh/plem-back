import { IsArray, IsNumber } from 'class-validator';
import { invalidErrorMessage } from 'src/common/helper/invalidErrorMessage';

export class UpdatePlanChartOrdersDto {
  @IsNumber({}, { message: (validationArguments) => invalidErrorMessage(validationArguments) })
  userId: number;

  @IsArray({ message: (validationArguments) => invalidErrorMessage(validationArguments) })
  chartOrders: { id: number; order: number }[];
}
