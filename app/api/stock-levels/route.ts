import { NextResponse } from 'next/server'

const EXTERNAL_STOCK_URL = 'https://n8n-pgct.onrender.com/webhook/STOCKlevels'

export async function GET() {
  try {
    const res = await fetch(EXTERNAL_STOCK_URL, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      cache: 'no-store'
    })

    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json({ error: 'Failed to fetch stock data', status: res.status, body: text }, { status: 502 })
    }

    const data = await res.json()
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
      }
    })
  } catch (err) {
    return NextResponse.json({ error: 'Stock service unavailable' }, { status: 503 })
  }
}






