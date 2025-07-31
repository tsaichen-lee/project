// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // 創建測試用戶
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      id: 'temp-user-id', // 固定 ID，方便測試
      email: 'admin@example.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'admin',
    },
  })

  // 創建一些測試數據字典
  const dictionary1 = await prisma.dataDictionary.create({
    data: {
      name: 'MO',
      abbreviation: 'MO',
      fullName: 'Manufacturing Order',
      dataType: 'VARCHAR(20)',
      description: '生產工單編號，用於追蹤生產過程',
      remarks: '與舊系統 WO 字段對應',
      createdBy: admin.id,
    },
  })

  const dictionary2 = await prisma.dataDictionary.create({
    data: {
      name: '客戶代碼',
      abbreviation: 'CUST_CODE',
      fullName: 'Customer Code',
      dataType: 'VARCHAR(10)',
      description: '客戶唯一標識碼',
      remarks: '系統內客戶的唯一識別',
      createdBy: admin.id,
    },
  })

  // 創建測試系統
  const erpSystem = await prisma.apiSystem.create({
    data: {
      systemCode: 'ERP',
      systemName: 'ERP系統',
      systemType: '企業資源規劃',
      description: '企業資源規劃系統，負責財務、人力資源、供應鏈管理',
      version: '2.1.0',
      status: '運行中',
      createdBy: admin.id,
    },
  })

  // 創建功能分類
  const userMgmtCategory = await prisma.functionCategory.create({
    data: {
      systemId: erpSystem.id,
      categoryCode: 'USER_MGMT',
      categoryName: '用戶管理',
      description: '用戶相關功能模組，包括登錄、權限等',
      createdBy: admin.id,
    },
  })

  // 創建測試知識庫
  const knowledge1 = await prisma.knowledgeBase.create({
    data: {
      category: '開發類',
      code: 'DEV001',
      title: 'React 組件開發最佳實踐',
      description: 'React 組件開發中的常見問題及解決方案',
      solution: '1. 使用函數組件和 Hooks\n2. 適當使用 useMemo 和 useCallback\n3. 組件拆分要合理',
      keywords: 'React, 組件, Hooks, 性能優化',
      priority: '高',
      status: '已發布',
      createdBy: admin.id,
    },
  })

  console.log('Seed data created successfully!')
  console.log({ admin, dictionary1, dictionary2, erpSystem, knowledge1 })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })