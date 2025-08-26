import { NextRequest, NextResponse } from 'next/server';

// This API route is disabled as we're using external n8n webhook for authentication
// The authentication is now handled by: https://n8n-pgct.onrender.com/webhook-test/login

export async function POST(req: NextRequest) {
  return NextResponse.json({ 
    message: 'This API endpoint is disabled. Authentication is handled by external n8n webhook.',
    redirect: 'Using n8n webhook: https://n8n-pgct.onrender.com/webhook-test/login'
  }, { status: 410 }); // 410 Gone - indicates this endpoint is no longer available
}
