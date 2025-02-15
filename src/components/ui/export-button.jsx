import React, { useState } from 'react'
import * as XLSX from 'xlsx'
import { Button } from './button'
import { Download } from 'lucide-react'
import { Card, CardContent } from './card'

const ExportButton = ({ articles, companies }) => {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    try {
      setIsExporting(true)

      // Format the articles for export
      const formattedData = articles.map(article => ({
        Title: article.title,
        Description: article.description,
        Company: article.company,
        Source: article.source?.name || 'N/A',
        PublishedDate: new Date(article.publishedAt).toLocaleString(),
        URL: article.url
      }))

      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new()
      const worksheet = XLSX.utils.json_to_sheet(formattedData)

      // Set column widths for better readability
      worksheet['!cols'] = [
        { wch: 40 }, // Title
        { wch: 60 }, // Description
        { wch: 20 }, // Company
        { wch: 20 }, // Source
        { wch: 20 }, // PublishedDate
        { wch: 50 }  // URL
      ]

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'News Results')

      // Generate and trigger download
      XLSX.writeFile(workbook, `news_results_${companies.join('_')}_${Date.now()}.xlsx`)
    } catch (error) {
      console.error('Export error:', error)
    } finally {
      setIsExporting(false)
    }
  }

  if (!articles.length) return null

  return (
        <Button
          onClick={handleExport}
          disabled={isExporting}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
        >
          {isExporting ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Exporting...
            </div>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Export Results ({articles.length} articles)
            </>
          )}
        </Button>
  )
}

export default ExportButton