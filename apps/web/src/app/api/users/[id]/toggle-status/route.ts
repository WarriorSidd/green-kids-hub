import { NextResponse } from 'next/server';
import { toggleServerUserActive, addServerAudit } from '@/lib/server-store';

export async function PATCH(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const userId = params.id;
  const updated = toggleServerUserActive(userId);
  if (!updated) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  addServerAudit(
    'server',
    'Super Admin',
    updated.isActive ? 'ACTIVATE_USER' : 'DEACTIVATE_USER',
    (updated.isActive ? 'Activated' : 'Deactivated') + ' user: ' + updated.displayName
  );

  return NextResponse.json(updated);
}
