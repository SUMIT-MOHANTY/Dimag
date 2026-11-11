import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Filter, Grid3X3, List, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CourseCard } from '@/components/shared/CourseCard'
import { PageHeader } from '@/components/layout/PageHeader'
import { SearchInput } from '@/components/shared/SearchInput'
import { useDebounce } from '@/hooks/useDebounce'
import { mockCourses } from '@/mocks/mockData'
import type { CourseListItem, CourseLevel } from '@/types/course'

type SortOption = 'newest' | 'popular' | 'rating' | 'price-low' | 'price-high'

export function CourseCatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [courses, setCourses] = useState<CourseListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedLevel, setSelectedLevel] = useState<CourseLevel | 'all'>('all')
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all')
  
  const debouncedSearch = useDebounce(searchQuery, 300)

  // Extract unique categories from mock data
  const categories = useMemo(() => {
    const cats = new Set<string>()
    mockCourses.forEach(c => c.categories.forEach(cat => cats.add(cat)))
    return Array.from(cats)
  }, [])

  useEffect(() => {
    // Initialize from URL params
    const urlSearch = searchParams.get('search')
    const urlCategory = searchParams.get('category')
    const urlLevel = searchParams.get('level')
    const urlSort = searchParams.get('sort') as SortOption
    
    if (urlSearch) setSearchQuery(urlSearch)
    if (urlCategory) setSelectedCategory(urlCategory)
    if (urlLevel) setSelectedLevel(urlLevel as CourseLevel)
    if (urlSort) setSortBy(urlSort)
  }, [searchParams])

  useEffect(() => {
    const loadCourses = async () => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 400))
      
      let filtered = mockCourses.filter(c => c.status === 'published')
      
      // Apply search filter
      if (debouncedSearch) {
        const query = debouncedSearch.toLowerCase()
        filtered = filtered.filter(c => 
          c.title.toLowerCase().includes(query) ||
          c.shortDescription.toLowerCase().includes(query) ||
          c.instructorName.toLowerCase().includes(query) ||
          c.tags.some(tag => tag.toLowerCase().includes(query))
        )
      }
      
      // Apply category filter
      if (selectedCategory !== 'all') {
        filtered = filtered.filter(c => c.categories.includes(selectedCategory))
      }
      
      // Apply level filter
      if (selectedLevel !== 'all') {
        filtered = filtered.filter(c => c.level === selectedLevel)
      }
      
      // Apply price filter
      if (priceFilter === 'free') {
        filtered = filtered.filter(c => c.isFree)
      } else if (priceFilter === 'paid') {
        filtered = filtered.filter(c => !c.isFree)
      }
      
      // Apply sorting
      switch (sortBy) {
        case 'newest':
          filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          break
        case 'popular':
          filtered.sort((a, b) => b.enrollmentCount - a.enrollmentCount)
          break
        case 'rating':
          filtered.sort((a, b) => b.avgRating - a.avgRating)
          break
        case 'price-low':
          filtered.sort((a, b) => (a.isFree ? 0 : a.price) - (b.isFree ? 0 : b.price))
          break
        case 'price-high':
          filtered.sort((a, b) => (b.isFree ? 0 : b.price) - (a.isFree ? 0 : a.price))
          break
      }
      
      const mappedCourses: CourseListItem[] = filtered.map(c => ({
        id: c.id,
        slug: c.slug,
        title: c.title,
        shortDescription: c.shortDescription,
        thumbnailUrl: c.thumbnailUrl,
        instructorName: c.instructorName,
        status: c.status,
        avgRating: c.avgRating,
        ratingCount: c.ratingCount,
        enrollmentCount: c.enrollmentCount,
        price: c.price,
        isFree: c.isFree,
        level: c.level,
        categories: c.categories,
        tags: c.tags,
      }))
      
      setCourses(mappedCourses)
      setIsLoading(false)
    }
    
    loadCourses()
  }, [debouncedSearch, selectedCategory, selectedLevel, sortBy, priceFilter])

  const updateSearchParams = (updates: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams)
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === 'all') {
        newParams.delete(key)
      } else {
        newParams.set(key, value)
      }
    })
    setSearchParams(newParams)
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    updateSearchParams({ search: value || null })
  }

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
    updateSearchParams({ category: value })
  }

  const handleLevelChange = (value: string) => {
    setSelectedLevel(value as CourseLevel | 'all')
    updateSearchParams({ level: value })
  }

  const handleSortChange = (value: SortOption) => {
    setSortBy(value)
    updateSearchParams({ sort: value })
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('all')
    setSelectedLevel('all')
    setPriceFilter('all')
    setSortBy('newest')
    setSearchParams(new URLSearchParams())
  }

  const hasActiveFilters = searchQuery || selectedCategory !== 'all' || selectedLevel !== 'all' || priceFilter !== 'all'

  return (
    <div className="min-h-screen bg-background pb-12">
      <PageHeader
        title="Course Catalog"
        description="Discover courses to advance your skills and career"
        breadcrumbs={[{ label: 'Courses', href: '/courses' }]}
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filters Bar */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[280px]">
              <SearchInput
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search courses, instructors, or topics..."
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-[160px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedLevel} onValueChange={handleLevelChange}>
                <SelectTrigger className="w-[140px]">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex items-center border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {searchQuery && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm">
                  Search: {searchQuery}
                </span>
              )}
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm">
                  Category: {selectedCategory}
                </span>
              )}
              {selectedLevel !== 'all' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm capitalize">
                  Level: {selectedLevel}
                </span>
              )}
              {priceFilter !== 'all' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm capitalize">
                  Price: {priceFilter}
                </span>
              )}
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear all
              </Button>
            </div>
          )}
        </div>
        
        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-muted-foreground">
            Showing <span className="font-medium text-foreground">{courses.length}</span> courses
          </p>
        </div>
        
        {/* Course Grid */}
        {isLoading ? (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-lg border bg-card p-4 animate-pulse">
                <div className="aspect-video rounded bg-muted" />
                <div className="mt-4 h-4 w-3/4 rounded bg-muted" />
                <div className="mt-2 h-3 w-1/2 rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : courses.length > 0 ? (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} viewMode={viewMode} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Filter className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No courses found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <Button onClick={clearFilters}>Clear Filters</Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CourseCatalogPage
