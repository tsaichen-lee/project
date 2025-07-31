// src/app/api/dictionary/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 獲取單個數據字典項
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const dictionary = await prisma.dataDictionary.findUnique({
      where: {
        id: params.id
      },
      include: {
        creator: {
          select: {
            name: true,
            email: true
          }
        },
        updater: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })
    
    if (!dictionary) {
      return NextResponse.json(
        { error: 'Dictionary not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(dictionary)
  } catch (error) {
    console.error('Error fetching dictionary:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dictionary' },
      { status: 500 }
    )
  }
}

// 更新數據字典項
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, abbreviation, fullName, dataType, description, remarks, isActive } = body
    
    // 暫時使用固定的用戶 ID
    const userId = 'temp-user-id'
    
    const dictionary = await prisma.dataDictionary.update({
      where: {
        id: params.id
      },
      data: {
        name,
        abbreviation,
        fullName,
        dataType,
        description,
        remarks,
        isActive,
        updatedBy: userId,
      },
      include: {
        creator: {
          select: {
            name: true,
            email: true
          }
        },
        updater: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })
    
    return NextResponse.json(dictionary)
  } catch (error) {
    console.error('Error updating dictionary:', error)
    return NextResponse.json(
      { error: 'Failed to update dictionary' },
      { status: 500 }
    )
  }
}

// 刪除數據字典項
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.dataDictionary.delete({
      where: {
        id: params.id
      }
    })
    
    return NextResponse.json({ message: 'Dictionary deleted successfully' })
  } catch (error) {
    console.error('Error deleting dictionary:', error)
    return NextResponse.json(
      { error: 'Failed to delete dictionary' },
      { status: 500 }
    )
  }
}