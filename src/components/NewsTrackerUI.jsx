import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { X, Plus, Search, Newspaper, Calendar, ExternalLink, Clock, AlertCircle } from 'lucide-react';
import api from '../lib/axios';

const NewsTrackerUI = () => {
  const [companies, setCompanies] = useState(['']);
  const [newCompany, setNewCompany] = useState('');
  const [timeRange, setTimeRange] = useState('30');
  const [articles, setArticles] = useState([]);
  const [selectedSources, setSelectedSources] = useState([]);
  const [availableSources, setAvailableSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/api/news', {
        companies,
        timeRange: parseInt(timeRange),
        sources: selectedSources
      });

      const { data } = response.data;
      
      setArticles(data.articles);
      setAvailableSources(data.metadata.sources);

    } catch (error) {
      console.error('Error fetching news:', error);
      setError(error.response?.data?.error || 'Failed to fetch news articles');
    } finally {
      setLoading(false);
    }
  };

  // Format date to local string
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };

  // Add company to tracking list
  const addCompany = () => {
    if (newCompany && !companies.includes(newCompany)) {
      setCompanies([...companies, newCompany]);
      setNewCompany('');
    }
  };

  // Remove company from tracking list
  const removeCompany = (companyToRemove) => {
    setCompanies(companies.filter(company => company !== companyToRemove));
  };

  // Toggle source selection
  const toggleSource = (source) => {
    setSelectedSources(prev => 
      prev.includes(source) 
        ? prev.filter(s => s !== source)
        : [...prev, source]
    );
  };

  // Filter articles based on selected sources
  const filteredArticles = articles.filter(article => 
    selectedSources.length === 0 || selectedSources.includes(article.source.name)
  );

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
          <p className="text-gray-600 mt-2">Track news for your favorite companies</p>
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
                      onKeyPress={(e) => e.key === 'Enter' && addCompany()}
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
                    {companies.map(company => (
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
                      <SelectItem value="30">Last 30 days</SelectItem>
                      <SelectItem value="90">Last 90 days</SelectItem>
                      <SelectItem value="180">Last 180 days</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Search Button */}
                  <Button 
                    onClick={fetchNews} 
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
                </div>
              </CardContent>
            </Card>

            {/* Sources Filter */}
            {availableSources.length > 0 && (
              <Card className="backdrop-blur-xl bg-white/50 shadow-xl border-0">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">News Sources</h3>
                  <div className="flex flex-wrap gap-2">
                    {availableSources.map(source => (
                      <Badge
                        key={source}
                        variant={selectedSources.includes(source) ? "default" : "outline"}
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
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Searching for articles...</p>
                  </div>
                </div>
              ) : filteredArticles.length > 0 ? (
                filteredArticles.map((article) => (
                  <Card 
                    key={article.id} 
                    className="backdrop-blur-xl bg-white/50 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="text-xl font-semibold text-gray-900">{article.title}</h3>
                          <Button 
                            variant="outline" 
                            onClick={() => window.open(article.url, '_blank')}
                            className="flex-shrink-0 hover:bg-blue-50"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-gray-600">{article.description}</p>
                        <div className="flex items-center gap-3 flex-wrap">
                          <Badge className="bg-blue-50 text-blue-700">
                            <Newspaper className="h-3 w-3 mr-1.5" />
                            {article.source.name}
                          </Badge>
                          <Badge variant="outline">
                            {article.company}
                          </Badge>
                          <span className="text-sm text-gray-500 flex items-center">
                            <Calendar className="h-3 w-3 mr-1.5" />
                            {formatDate(article.publishedAt)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="backdrop-blur-xl bg-white/50 border-0 shadow-xl">
                  <CardContent className="p-12 text-center">
                    <Newspaper className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
                    <p className="text-gray-600">Try adjusting your search criteria or adding more companies.</p>
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