import { ValidationArguments } from 'class-validator';

export const invalidErrorMessage = (validationArguments: ValidationArguments) => {
  return `${validationArguments.property} 잘못된 값이 포함되어 있습니다. ${validationArguments.value}`;
};
