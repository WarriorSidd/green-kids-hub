import { SetMetadata } from '@nestjs/common';
import { PermissionKey } from './permissions';

export const PERMISSIONS_KEY = 'permissions';
export const RequirePermissions = (...items: PermissionKey[]) => SetMetadata(PERMISSIONS_KEY, items);
