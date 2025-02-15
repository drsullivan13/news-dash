import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import ExportButton from "./ui/export-button";
import {
  X,
  Plus,
  Search,
  Newspaper,
  Calendar,
  ExternalLink,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Globe,
} from "lucide-react";
import api from "../lib/axios";

const NewsTrackerUI = () => {
  const [companies, setCompanies] = useState([]);
  const [newCompany, setNewCompany] = useState("");
  const [timeRange, setTimeRange] = useState("7");
  const [articles, setArticles] = useState([]);
  const [selectedSources, setSelectedSources] = useState([]);
  const [availableSources, setAvailableSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalArticles, setTotalArticles] = useState(0);

  const articlesPerPage = 20;
  const domains = [
    { label: "MarketWatch", value: "marketwatch.com" },
    { label: "Yahoo", value: "yahoo.com" },
  ];

  const fetchNews = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/api/news", {
        companies,
        timeRange: parseInt(timeRange),
        sources: selectedSources,
        domains: selectedDomains,
        page,
        pageSize: articlesPerPage,
      });

      const { data } = response.data;

      setArticles(data.articles);
      setAvailableSources(data.metadata.sources);
      setTotalPages(data.metadata.totalPages);
      setTotalArticles(data.metadata.totalResults);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching news:", error);
      setError(error.response?.data?.error || "Failed to fetch news articles");
    } finally {
      setLoading(false);
    }
  };

  // Format date to local string
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };

  // Add company to tracking list
  const addCompany = () => {
    if (newCompany && !companies.includes(newCompany)) {
      setCompanies([...companies, newCompany]);
      setNewCompany("");
    }
  };

  // Remove company from tracking list
  const removeCompany = (companyToRemove) => {
    setCompanies(companies.filter((company) => company !== companyToRemove));
  };

  // Toggle source selection
  const toggleSource = (source) => {
    setSelectedSources((prev) =>
      prev.includes(source)
        ? prev.filter((s) => s !== source)
        : [...prev, source]
    );
  };

  // Add pagination handler
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      fetchNews(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Generate visible page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    console.log("TOTAL PAGES", totalPages);

    // If we have 7 or fewer pages, show all of them
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push({
          value: i,
          label: i.toString(),
          type: "number",
        });
      }
      return pages;
    }

    // Always show first page
    pages.push({
      value: 1,
      label: "1",
      type: "number",
    });

    // Calculate the range of visible page numbers
    let startPage = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

    // Adjust the range if we're near the end
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(2, endPage - maxVisiblePages + 1);
    }

    // Add ellipsis if there's a gap after page 1
    if (startPage > 2) {
      pages.push({
        value: Math.floor((1 + startPage) / 2),
        label: "...",
        type: "ellipsis",
      });
    }

    // Add visible page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push({
        value: i,
        label: i.toString(),
        type: "number",
      });
    }

    // Add ellipsis if there's a gap before the last page
    if (endPage < totalPages - 1) {
      pages.push({
        value: Math.floor((endPage + totalPages) / 2),
        label: "...",
        type: "ellipsis",
      });
    }

    // Always show last page
    pages.push({
      value: totalPages,
      label: totalPages.toString(),
      type: "number",
    });

    return pages;
  };

  // Filter articles based on selected sources
  const filteredArticles = articles.filter(
    (article) =>
      selectedSources.length === 0 ||
      selectedSources.includes(article.source.name)
  );

  const toggleDomain = (domain) => {
    setSelectedDomains((prev) =>
      prev.includes(domain.value)
        ? prev.filter((d) => d !== domain.value)
        : [...prev, domain.value]
    );
  };

  const handleGoogleSearch = (article) => {
    const searchQuery = encodeURIComponent(
      `${article.title} ${article.source.name}`
    );
    const googleSearchUrl = `https://www.google.com/search?q=${searchQuery}`;
    window.open(googleSearchUrl, "_blank");
  };

  // Function to determine if we should show Google search button
  const shouldShowGoogleSearch = (article) => {
    console.log(`ARTICLE: ${article}`);
    return (
      article.url.includes("consent.yahoo.com") ||
      article.source.name.toLowerCase().includes("yahoo")
    );
  };

  // Error display component
  const ErrorDisplay = ({ message }) => (
    <Card className="bg-red-50 border-red-200">
      <CardContent className="p-4 flex items-center text-red-700">
        <AlertCircle className="h-5 w-5 mr-2" />
        {message}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
            News Tracker
          </h1>
          <p className="text-gray-600 mt-2">
            Track news for your favorite companies
          </p>
        </div>

        {/* Error Display */}
        {error && <ErrorDisplay message={error} />}

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Search Panel */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="backdrop-blur-xl bg-white/50 shadow-xl border-0">
              <CardContent className="p-6">
                {/* Company Input */}
                <div className="space-y-4">
                  <div className="relative">
                    <Input
                      value={newCompany}
                      onChange={(e) => setNewCompany(e.target.value)}
                      placeholder="Add company..."
                      className="pr-20 bg-white/70"
                      onKeyPress={(e) => e.key === "Enter" && addCompany()}
                    />
                    <Button
                      onClick={addCompany}
                      className="absolute right-1 top-1 h-8 w-16 bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Company Tags */}
                  <div className="flex flex-wrap gap-2">
                    {companies.map((company) => (
                      <Badge
                        key={company}
                        className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer group"
                      >
                        {company}
                        <X
                          className="h-4 w-4 ml-2 opacity-50 group-hover:opacity-100"
                          onClick={() => removeCompany(company)}
                        />
                      </Badge>
                    ))}
                  </div>

                  {/* Time Range */}
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-full bg-white/70">
                      <Clock className="h-4 w-4 mr-2 opacity-50" />
                      <SelectValue placeholder="Time range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">Last 7 days</SelectItem>
                      <SelectItem value="14">Last 2 weeks</SelectItem>
                      <SelectItem value="21">Last 3 weeks</SelectItem>
                      <SelectItem value="30">Last month</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Domain Filter */}
                  <div className="space-y-2 mt-4">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Globe className="h-4 w-4 opacity-50" />
                      Filter by Domains
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {domains.map((domain) => (
                        <Badge
                          key={domain.value}
                          variant={
                            selectedDomains.includes(domain.value)
                              ? "default"
                              : "outline"
                          }
                          className="cursor-pointer px-3 py-1.5 transition-all hover:bg-blue-50"
                          onClick={() => toggleDomain(domain)}
                        >
                          <Globe className="h-3 w-3 mr-1.5" />
                          {domain.label}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Selected Domains Summary */}
                  {selectedDomains.length > 0 && (
                    <div className="mt-4">
                      <div className="text-sm text-gray-500">
                        Selected Domains: {selectedDomains.length}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedDomains.map((domain) => {
                          const domainInfo = domains.find(
                            (d) => d.value === domain
                          );
                          return (
                            <Badge
                              key={domain}
                              className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer group"
                            >
                              {domainInfo?.label}
                              <X
                                className="h-4 w-4 ml-2 opacity-50 group-hover:opacity-100"
                                onClick={() => toggleDomain(domainInfo)}
                              />
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Search Button */}
                  <Button
                    onClick={() => fetchNews(1)}
                    disabled={loading || companies.length === 0}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Searching...
                      </div>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        Search News
                      </>
                    )}
                  </Button>
                  {articles.length > 0 && (
                    <ExportButton
                      articles={filteredArticles}
                      companies={companies}
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Sources Filter */}
            {availableSources.length > 0 && (
              <Card className="backdrop-blur-xl bg-white/50 shadow-xl border-0">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">News Sources</h3>
                  <div className="flex flex-wrap gap-2">
                    {availableSources.map((source) => (
                      <Badge
                        key={source}
                        variant={
                          selectedSources.includes(source)
                            ? "default"
                            : "outline"
                        }
                        className="cursor-pointer px-3 py-1.5 transition-all"
                        onClick={() => toggleSource(source)}
                      >
                        <Newspaper className="h-3 w-3 mr-1.5" />
                        {source}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-8">
            <div className="space-y-4">
              {loading && !articles.length ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">
                      Searching for articles...
                    </p>
                  </div>
                </div>
              ) : filteredArticles.length > 0 ? (
                <>
                  {filteredArticles.map((article) => (
                    <Card
                      key={article.id}
                      className="backdrop-blur-xl bg-white/50 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between gap-4">
                            <h3 className="text-xl font-semibold text-gray-900">
                              {article.title}
                            </h3>
                            <div className="flex gap-2 flex-shrink-0">
                              <TooltipProvider
                                delayDuration={150}
                                skipDelayDuration={0}
                              >
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="outline"
                                      onClick={() =>
                                        window.open(article.url, "_blank")
                                      }
                                      className="flex-shrink-0 hover:bg-blue-50"
                                    >
                                      <ExternalLink className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Open Article</p>
                                  </TooltipContent>
                                </Tooltip>
                                {shouldShowGoogleSearch(article) && (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="outline"
                                        onClick={() =>
                                          handleGoogleSearch(article)
                                        }
                                        className="flex-shrink-0 hover:bg-blue-50 group"
                                      >
                                        <svg
                                          viewBox="0 0 24 24"
                                          className="h-4 w-4 group-hover:text-blue-600"
                                          fill="currentColor"
                                        >
                                          <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                                        </svg>
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Search in Google</p>
                                    </TooltipContent>
                                  </Tooltip>
                                )}
                              </TooltipProvider>
                            </div>
                          </div>
                          <p className="text-gray-600">{article.description}</p>
                          <div className="flex items-center gap-3 flex-wrap">
                            <Badge className="bg-blue-50 text-blue-700">
                              <Newspaper className="h-3 w-3 mr-1.5" />
                              {article.source.name}
                            </Badge>
                            <Badge variant="outline">{article.company}</Badge>
                            <span className="text-sm text-gray-500 flex items-center">
                              <Calendar className="h-3 w-3 mr-1.5" />
                              {formatDate(article.publishedAt)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="mt-6 flex justify-center items-center space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1 || loading}
                        className="flex items-center gap-1"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>

                      <div className="flex items-center gap-1">
                        {getPageNumbers().map((page, index) => (
                          <Button
                            key={`${page.type}-${index}`}
                            variant={
                              currentPage === page.value ? "default" : "outline"
                            }
                            onClick={() => handlePageChange(page.value)}
                            disabled={loading || page.type === "ellipsis"}
                            className={`w-10 h-10 p-0 ${
                              currentPage === page.value
                                ? "bg-blue-600 text-white"
                                : page.type === "ellipsis"
                                ? "hover:bg-transparent cursor-default"
                                : "hover:bg-blue-50"
                            }`}
                          >
                            {page.label}
                          </Button>
                        ))}
                      </div>

                      <Button
                        variant="outline"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages || loading}
                        className="flex items-center gap-1"
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  {/* Results Summary */}
                  <div className="text-center text-sm text-gray-500 mt-4">
                    Showing {(currentPage - 1) * articlesPerPage + 1} to{" "}
                    {Math.min(currentPage * articlesPerPage, totalArticles)} of{" "}
                    {totalArticles} articles
                  </div>
                </>
              ) : (
                <Card className="backdrop-blur-xl bg-white/50 border-0 shadow-xl">
                  <CardContent className="p-12 text-center">
                    <Newspaper className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No articles found
                    </h3>
                    <p className="text-gray-600">
                      Try adjusting your search criteria or adding more
                      companies.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsTrackerUI;
