import { SetMetadata } from '@nestjs/common';
import { AUTH_TYPE } from 'src/auth/constants/auth.constants';
import { AuthTypes } from 'src/auth/enums/auth.types.enum';

/** This custom decorator will support these two arguments only
 * SetMetadata('authType',None)
 * SetMetadata('authType',Bearer)
*/
export const Auth = (...authTypes: AuthTypes[]) => SetMetadata(AUTH_TYPE, authTypes);
