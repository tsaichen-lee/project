// src/app/page.tsx
'use client'

import { useState, useEffect } from 'react'

// 類型定義
interface Dictionary {
  id: string
  name: string
  abbreviation?: string
  fullName: string
  dataType?: string
  description?: string
  isActive: boolean
  version: string
  remarks?: string
  createdAt: string
  creator: {
    name: string | null
    email: string
  }
}

interface Knowledge {
  id: string
  code: string
  title: string
  category: string
  status: string
  priority: string
  createdAt: string
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('dictionary')
  const [dictionaries, setDictionaries] = useState<Dictionary[]>([])
  const [knowledgeList, setKnowledgeList] = useState<Knowledge[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 獲取數據字典
  const fetchDictionaries = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/dictionary')
      if (!response.ok) {
        throw new Error('Failed to fetch dictionaries')
      }
      const data = await response.json()
      setDictionaries(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  // 頁面載入時獲取數據
  useEffect(() => {
    if (activeTab === 'dictionary') {
      fetchDictionaries()
    }
  }, [activeTab])

  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 頂部導航 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">系統開發管理</h1>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              登入
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 標籤導航 */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('dictionary')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'dictionary'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              數據字典
            </button>
            <button
              onClick={() => setActiveTab('knowledge')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'knowledge'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              知識庫
            </button>
            <button
              onClick={() => setActiveTab('systems')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'systems'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              系統管理
            </button>
          </nav>
        </div>

        {/* 錯誤提示 */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            錯誤：{error}
          </div>
        )}

        {/* 內容區域 */}
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">
                {activeTab === 'dictionary' && '數據字典管理'}
                {activeTab === 'knowledge' && '知識庫管理'}
                {activeTab === 'systems' && '系統管理'}
              </h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors">
                + 新增
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* 載入狀態 */}
            {loading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-500">載入中...</p>
              </div>
            )}

            {/* 數據字典表格 */}
            {activeTab === 'dictionary' && !loading && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">名稱</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">簡稱</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">全稱</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">數據類型</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">狀態</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">創建者</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">創建時間</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dictionaries.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                          暫無數據
                        </td>
                      </tr>
                    ) : (
                      dictionaries.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            {item.description && (
                              <div className="text-sm text-gray-500">{item.description}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.abbreviation || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.fullName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.dataType || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              item.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {item.isActive ? '啟用' : '停用'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.creator.name || item.creator.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(item.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button className="text-blue-600 hover:text-blue-900 mr-4 transition-colors">
                              編輯
                            </button>
                            <button className="text-red-600 hover:text-red-900 transition-colors">
                              刪除
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* 知識庫表格 */}
            {activeTab === 'knowledge' && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-500">知識庫功能開發中...</p>
              </div>
            )}

            {/* 系統管理 */}
            {activeTab === 'systems' && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-500">系統管理功能開發中...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}