import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { X, Plus, Search, Newspaper, Calendar, ExternalLink } from 'lucide-react';

const NewsTrackerUI = () => {
  // State management
  const [companies, setCompanies] = useState(['Expedia']);
  const [newCompany, setNewCompany] = useState('');
  const [timeRange, setTimeRange] = useState('30');
  const [articles, setArticles] = useState([]);
  const [selectedSources, setSelectedSources] = useState([]);
  const [availableSources, setAvailableSources] = useState([]);
  const [loading, setLoading] = useState(false);

  // Handle API key - in production, use environment variables
  const API_KEY = 'your-api-key';

  const fetchNews = async () => {
    setLoading(true);
    try {
      // Replace with actual NewsAPI call
      setLoading(false);
    } catch (error) {
      console.error('Error fetching news:', error);
      setLoading(false);
    }
  };

  const addCompany = () => {
    if (newCompany && !companies.includes(newCompany)) {
      setCompanies([...companies, newCompany]);
      setNewCompany('');
    }
  };

  const removeCompany = (companyToRemove) => {
    setCompanies(companies.filter(company => company !== companyToRemove));
  };

  const toggleSource = (source) => {
    if (selectedSources.includes(source)) {
      setSelectedSources(selectedSources.filter(s => s !== source));
    } else {
      setSelectedSources([...selectedSources, source]);
    }
  };

  const filteredArticles = articles.filter(article => 
    selectedSources.length === 0 || selectedSources.includes(article.source)
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-white shadow-lg">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="text-2xl font-bold text-gray-900">News Tracker</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6 pt-6">
            {/* Company Input Section */}
            <div className="space-y-4">
              <div className="flex gap-3">
                <Input
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  placeholder="Enter company name"
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && addCompany()}
                />
                <Button 
                  onClick={addCompany}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Company
                </Button>
              </div>
              
              {/* Company Tags */}
              <div className="flex flex-wrap gap-2">
                {companies.map(company => (
                  <Badge 
                    key={company} 
                    variant="secondary"
                    className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200"
                  >
                    {company}
                    <X 
                      className="h-4 w-4 ml-2 cursor-pointer hover:text-red-500" 
                      onClick={() => removeCompany(company)}
                    />
                  </Badge>
                ))}
              </div>

              {/* Search Controls */}
              <div className="flex gap-4 items-center">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-48">
                    <Calendar className="h-4 w-4 mr-2 opacity-50" />
                    <SelectValue placeholder="Select time range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Last 7 days</SelectItem>
                    <SelectItem value="30">Last 30 days</SelectItem>
                    <SelectItem value="90">Last 90 days</SelectItem>
                    <SelectItem value="180">Last 180 days</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button 
                  onClick={fetchNews} 
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Search className="h-4 w-4 mr-2" />
                  {loading ? 'Searching...' : 'Search News'}
                </Button>
              </div>
            </div>

            {/* Source Filters */}
            {availableSources.length > 0 && (
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">News Sources</h3>
                <div className="flex flex-wrap gap-2">
                  {availableSources.map(source => (
                    <Badge
                      key={source}
                      variant={selectedSources.includes(source) ? "default" : "outline"}
                      className="cursor-pointer px-3 py-1"
                      onClick={() => toggleSource(source)}
                    >
                      <Newspaper className="h-3 w-3 mr-1" />
                      {source}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Results Section */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Fetching news...</p>
                </div>
              ) : filteredArticles.length > 0 ? (
                filteredArticles.map((article, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2">{article.title}</h3>
                          <p className="text-sm text-gray-600 mb-3">{article.description}</p>
                          <div className="flex items-center gap-3">
                            <Badge variant="secondary" className="bg-gray-100">
                              <Newspaper className="h-3 w-3 mr-1" />
                              {article.source}
                            </Badge>
                            <span className="text-sm text-gray-500">{article.date}</span>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          onClick={() => window.open(article.url, '_blank')}
                          className="flex-shrink-0"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Read More
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No articles found. Try adjusting your search criteria.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewsTrackerUI;