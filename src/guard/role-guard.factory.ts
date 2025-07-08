import { RoleGuard } from './role.guard';

export function RoleGuardFactory(roles: string[]) {
  return new (class extends RoleGuard {
    constructor() {
      super(roles);
    }
  })();
}
