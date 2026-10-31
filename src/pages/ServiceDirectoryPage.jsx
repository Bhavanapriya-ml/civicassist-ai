import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { DEMO_SERVICES, SERVICE_CATEGORIES } from '../data/demoData';
import ServiceCard from '../components/ServiceCard';
import { AlertBanner, EmptyState } from '../components/UI';

export default function ServiceDirectoryPage() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setQuery(q);
  }, [searchParams]);

  const filtered = useMemo(() => {
    let results = DEMO_SERVICES;
    if (selectedCategory !== 'All') {
      results = results.filter(s => s.category === selectedCategory);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      results = results.filter(
        s =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.department.toLowerCase().includes(q) ||
          s.tags.some(t => t.includes(q)) ||
          s.category.toLowerCase().includes(q)
      );
    }
    return results;
  }, [query, selectedCategory]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page Header */}
      <div className="bg-[#0a1628] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-2">Public Service Directory</h1>
          <p className="text-blue-300 text-sm">Browse and search {DEMO_SERVICES.length} government services across {SERVICE_CATEGORIES.length - 1} categories</p>

          {/* Search */}
          <div className="mt-6 max-w-2xl">
            <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-4 py-3">
              <Search size={16} className="text-blue-300 flex-shrink-0" />
              <input
                id="service-search-input"
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search services, departments, or keywords..."
                className="flex-1 bg-transparent text-white placeholder-blue-300 text-sm outline-none"
              />
              {query && (
                <button onClick={() => setQuery('')} className="text-blue-300 hover:text-white">
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-5">
          <AlertBanner type="demo">
            <strong>Demo Data:</strong> All services listed below are sample entries. This is a prototype application.
          </AlertBanner>
        </div>

        {/* Category Filters */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <SlidersHorizontal size={14} className="text-slate-500" />
            <span className="text-sm font-medium text-slate-600">Filter by Category</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {SERVICE_CATEGORIES.map(cat => (
              <button
                key={cat}
                id={`filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-slate-500">
            Showing <span className="font-semibold text-slate-700">{filtered.length}</span> services
            {query && ` for "${query}"`}
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          </p>
          {(query || selectedCategory !== 'All') && (
            <button
              onClick={() => { setQuery(''); setSelectedCategory('All'); }}
              className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <X size={12} /> Clear filters
            </button>
          )}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No services found"
            description={`No services match "${query}". Try a different keyword or clear the filters.`}
            action={
              <button
                onClick={() => { setQuery(''); setSelectedCategory('All'); }}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
              >
                Clear filters
              </button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
