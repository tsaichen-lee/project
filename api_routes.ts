// src/app/api/dictionary/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 獲取所有數據字典
export async function GET() {
  try {
    const dictionaries = await prisma.dataDictionary.findMany({
      include: {
        creator: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json(dictionaries)
  } catch (error) {
    console.error('Error fetching dictionaries:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dictionaries' },
      { status: 500 }
    )
  }
}

// 創建新的數據字典項
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, abbreviation, fullName, dataType, description, remarks } = body
    
    // 暫時使用固定的用戶 ID，後面會改為從 session 獲取
    const userId = 'temp-user-id'
    
    const dictionary = await prisma.dataDictionary.create({
      data: {
        name,
        abbreviation,
        fullName,
        dataType,
        description,
        remarks,
        createdBy: userId,
      },
      include: {
        creator: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })
    
    return NextResponse.json(dictionary)
  } catch (error) {
    console.error('Error creating dictionary:', error)
    return NextResponse.json(
      { error: 'Failed to create dictionary' },
      { status: 500 }
    )
  }
}