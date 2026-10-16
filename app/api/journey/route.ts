import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { WORLDS, LEVELS } from '@/data/journey_seed';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/journey — Returns worlds, levels, and user progress
 */
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      // Return static data without user progress (for demo/bypass mode)
      return NextResponse.json({
        worlds: WORLDS,
        levels: LEVELS,
        progress: null,
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({
        worlds: WORLDS,
        levels: LEVELS,
        progress: null,
      });
    }

    // Fetch user progress
    const { data: progress } = await supabaseAdmin
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    return NextResponse.json({
      worlds: WORLDS,
      levels: LEVELS,
      progress: progress || null,
    });
  } catch (error) {
    console.error('Journey API error:', error);
    return NextResponse.json({
      worlds: WORLDS,
      levels: LEVELS,
      progress: null,
    });
  }
}

/**
 * POST /api/journey — Save user progress
 */
export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { total_xp, unlocked_level_ids, completed_level_ids, current_level_id } = body;

    // Upsert progress
    const payload = {
      user_id: user.id,
      total_xp,
      unlocked_level_ids,
      completed_level_ids,
      current_level_id,
      updated_at: new Date().toISOString(),
    };

    const { error: upsertErr } = await supabaseAdmin
      .from('user_progress')
      .upsert(payload, { onConflict: 'user_id' });

    if (upsertErr && upsertErr.code === '23503') {
      await supabaseAdmin
        .from('user_progress')
        .upsert(
          { ...payload, current_level_id: null },
          { onConflict: 'user_id' }
        );
    }

    // Log XP event if XP was gained
    if (body.xp_gained && body.xp_gained > 0) {
      await supabaseAdmin
        .from('xp_events')
        .insert({
          user_id: user.id,
          level_id: body.level_id || null,
          source: body.source || 'level_unlock',
          xp: body.xp_gained,
          metadata: body.metadata || {},
        });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Journey save error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
