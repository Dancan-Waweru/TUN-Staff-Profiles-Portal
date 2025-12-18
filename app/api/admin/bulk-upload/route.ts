import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const csvText = await file.text()
    const lines = csvText.split('\n').filter(line => line.trim())
    
    if (lines.length < 2) {
      return NextResponse.json({ error: 'CSV file must contain headers and at least one data row' }, { status: 400 })
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
    const dataLines = lines.slice(1)

    let successCount = 0
    const errors: string[] = []

    for (let i = 0; i < dataLines.length; i++) {
      try {
        const values = dataLines[i].split(',').map(v => v.trim().replace(/"/g, ''))
        const rowData: any = {}
        
        headers.forEach((header, index) => {
          rowData[header] = values[index] || null
        })

        // Validate required fields
        const requiredFields = ['firstName', 'lastName', 'title', 'position', 'department', 'faculty', 'email']
        const missingFields = requiredFields.filter(field => !rowData[field])
        
        if (missingFields.length > 0) {
          errors.push(`Row ${i + 2}: Missing required fields: ${missingFields.join(', ')}`)
          continue
        }

        // Generate slug
        const slug = `${rowData.firstName}-${rowData.lastName}`.toLowerCase().replace(/\s+/g, '-')

        // Check if user exists, create if not
        let user = await prisma.user.findUnique({
          where: { email: rowData.email }
        })

        if (!user) {
          user = await prisma.user.create({
            data: {
              email: rowData.email,
              name: `${rowData.firstName} ${rowData.lastName}`,
              role: 'STAFF'
            }
          })
        }

        // Create or update profile
        await prisma.profile.upsert({
          where: { userId: user.id },
          update: {
            firstName: rowData.firstName,
            lastName: rowData.lastName,
            middleName: rowData.middleName || null,
            title: rowData.title,
            position: rowData.position,
            department: rowData.department,
            faculty: rowData.faculty,
            email: rowData.email,
            phone: rowData.phone || null,
            officeLocation: rowData.officeLocation || null,
            biography: rowData.biography || null,
            qualifications: rowData.qualifications || null,
            researchInterests: rowData.researchInterests || null,
            slug: slug,
          },
          create: {
            userId: user.id,
            firstName: rowData.firstName,
            lastName: rowData.lastName,
            middleName: rowData.middleName || null,
            title: rowData.title,
            position: rowData.position,
            department: rowData.department,
            faculty: rowData.faculty,
            email: rowData.email,
            phone: rowData.phone || null,
            officeLocation: rowData.officeLocation || null,
            biography: rowData.biography || null,
            qualifications: rowData.qualifications || null,
            researchInterests: rowData.researchInterests || null,
            slug: slug,
          }
        })

        successCount++
      } catch (error) {
        errors.push(`Row ${i + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    return NextResponse.json({
      count: successCount,
      errors: errors.length > 0 ? errors : undefined
    })

  } catch (error) {
    console.error('Bulk upload error:', error)
    return NextResponse.json(
      { error: 'Failed to process bulk upload' },
      { status: 500 }
    )
  }
}