import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') return NextResponse.json([], { status: 401 })

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(users)
}
