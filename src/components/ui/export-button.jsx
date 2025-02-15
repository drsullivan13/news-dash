import React, { useState } from 'react'
import * as XLSX from 'xlsx'
import { Button } from './button'
import { Download } from 'lucide-react'
import { Card, CardContent } from './card'
import api from '../../lib/axios'

const ExportButton = ({ companies, timeRange, selectedSources, selectedDomains, totalArticles }) => {
  const [isExporting, setIsExporting] = useState(false)

  const fetchAllArticles = async () => {
    try {
      const response = await api.post("/api/news", {
        companies,
        timeRange: parseInt(timeRange),
        sources: selectedSources,
        domains: selectedDomains,
        page: 1,
        pageSize: totalArticles // Request all articles in one go
      })

      return response.data.data.articles
    } catch (error) {
      console.error("Error fetching all articles:", error)
      throw new Error("Failed to fetch all articles for export")
    }
  }

  const handleExport = async () => {
    try {
      setIsExporting(true)

      // Fetch all articles first
      const allArticles = await fetchAllArticles()

      // Format the articles for export
      const formattedData = allArticles.map(article => ({
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
      // Here you could add a toast notification for the error
    } finally {
      setIsExporting(false)
    }
  }

  if (!totalArticles) return null

  return (
        <Button
          onClick={handleExport}
          disabled={isExporting}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
        >
          {isExporting ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Exporting {totalArticles} articles...
            </div>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Export All Results ({totalArticles} articles)
            </>
          )}
        </Button>
  )
}

export default ExportButton