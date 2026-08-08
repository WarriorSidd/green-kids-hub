import { NextResponse } from 'next/server';
import { getNotificationsForUserAsync, markNotificationReadAsync } from '@/lib/server-store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'userId parameter required' }, { status: 400 });
  }

  const notifications = await getNotificationsForUserAsync(userId);
  return NextResponse.json(notifications);
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { notificationId } = body;

    if (!notificationId) {
      return NextResponse.json({ error: 'notificationId required' }, { status: 400 });
    }

    await markNotificationReadAsync(notificationId);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed to mark notification read' }, { status: 500 });
  }
}
