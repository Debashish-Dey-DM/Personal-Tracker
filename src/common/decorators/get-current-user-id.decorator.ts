import { getUserIDByToken } from '@common/helpers/getUserIDByToken';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUserID = createParamDecorator(
  (_, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    return getUserIDByToken(req);
  },
);
