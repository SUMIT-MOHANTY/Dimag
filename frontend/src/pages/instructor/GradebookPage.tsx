import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Search, Filter, Download, Eye, CheckCircle, XCircle,
  ChevronDown, ChevronUp, MoreHorizontal
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { PageHeader } from '@/components/layout/PageHeader'
import { SearchInput } from '@/components/shared/SearchInput'
import { ProgressBar } from '@/components/shared/ProgressBar'
import { useAuthStore } from '@/store/authStore'
import { useUIStore } from '@/store/uiStore'
import { ROUTES } from '@/lib/constants'
import { mockCourses, mockUsers, mockEnrollments } from '@/mocks/mockData'

interface GradebookEntry {
  id: string
  studentId: string
  studentName: string
  studentEmail: string
  courseId: string
  courseTitle: string
  enrollmentDate: string
  progress: number
  quizScores: { quizId: string; score: number; maxScore: number }[]
  overallGrade: number
  status: 'active' | 'completed' | 'dropped'
  lastActivity: string
}

export function GradebookPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { addToast } = useUIStore()
  const [entries, setEntries] = useState<GradebookEntry[]>([])
  const [filteredEntries, setFilteredEntries] = useState<GradebookEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [courseFilter, setCourseFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    const loadGradebook = async () => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 600))
      
      // Mock gradebook entries
      const instructorCourses = mockCourses.filter(
        c => c.instructorName === user?.fullName
      )
      
      const mockEntries: GradebookEntry[] = mockEnrollments
        .filter(e => instructorCourses.some(c => c.id === e.courseId))
        .map((enrollment, index) => {
          const student = mockUsers.find(u => u.id === enrollment.studentId)
          const course = mockCourses.find(c => c.id === enrollment.courseId)
          return {
            id: `grade-${index}`,
            studentId: enrollment.studentId,
            studentName: student?.fullName || 'Unknown Student',
            studentEmail: student?.email || '',
            courseId: enrollment.courseId,
            courseTitle: course?.title || 'Unknown Course',
            enrollmentDate: enrollment.enrolledAt,
            progress: enrollment.completionPercentage,
            quizScores: [
              { quizId: 'q1', score: 85, maxScore: 100 },
              { quizId: 'q2', score: 92, maxScore: 100 },
            ],
            overallGrade: Math.floor(Math.random() * 30) + 70, // 70-100
            status: enrollment.status,
            lastActivity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          }
        })
      
      setEntries(mockEntries)
      setFilteredEntries(mockEntries)
      setIsLoading(false)
    }
    
    loadGradebook()
  }, [user])

  useEffect(() => {
    let filtered = entries
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(e => 
        e.studentName.toLowerCase().includes(query) ||
        e.studentEmail.toLowerCase().includes(query) ||
        e.courseTitle.toLowerCase().includes(query)
      )
    }
    
    if (courseFilter !== 'all') {
      filtered = filtered.filter(e => e.courseId === courseFilter)
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(e => e.status === statusFilter)
    }
    
    setFilteredEntries(filtered)
  }, [searchQuery, courseFilter, statusFilter, entries])

  const handleExport = () => {
    addToast({
      type: 'success',
      title: 'Export Started',
      message: 'Your gradebook export is being prepared.',
    })
  }

  const handleViewStudent = (studentId: string) => {
    navigate(`/instructor/students/${studentId}`)
  }

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-green-600'
    if (grade >= 80) return 'text-blue-600'
    if (grade >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getGradeLetter = (grade: number) => {
    if (grade >= 90) return 'A'
    if (grade >= 80) return 'B'
    if (grade >= 70) return 'C'
    if (grade >= 60) return 'D'
    return 'F'
  }

  const instructorCourses = mockCourses.filter(c => c.instructorName === user?.fullName)

  return (
    <div className="min-h-screen bg-background pb-12">
      <PageHeader
        title="Gradebook"
        description="View and manage student grades and progress"
        action={
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        }
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[280px]">
                <SearchInput
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search students..."
                />
              </div>
              
              <Select value={courseFilter} onValueChange={setCourseFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  {instructorCourses.map(course => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="dropped">Dropped</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        {/* Results Count */}
        <div className="mb-4">
          <p className="text-muted-foreground">
            Showing <span className="font-medium text-foreground">{filteredEntries.length}</span> students
          </p>
        </div>
        
        {/* Gradebook Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-muted rounded animate-pulse" />
                ))}
              </div>
            ) : filteredEntries.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Student</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Course</th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">Progress</th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">Grade</th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">Status</th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEntries.map((entry) => (
                      <tr key={entry.id} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="font-medium text-primary">
                                {entry.studentName.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{entry.studentName}</p>
                              <p className="text-sm text-muted-foreground">{entry.studentEmail}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-medium">{entry.courseTitle}</p>
                          <p className="text-sm text-muted-foreground">
                            Enrolled {new Date(entry.enrollmentDate).toLocaleDateString()}
                          </p>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <ProgressBar progress={entry.progress} size="sm" className="w-20" />
                            <span className="text-sm">{entry.progress}%</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className={`text-2xl font-bold ${getGradeColor(entry.overallGrade)}`}>
                            {getGradeLetter(entry.overallGrade)}
                          </div>
                          <p className="text-sm text-muted-foreground">{entry.overallGrade}%</p>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <Badge
                            variant={entry.status === 'active' ? 'default' : entry.status === 'completed' ? 'secondary' : 'destructive'}
                          >
                            {entry.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewStudent(entry.studentId)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Override Grade
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No students found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filters.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default GradebookPage
