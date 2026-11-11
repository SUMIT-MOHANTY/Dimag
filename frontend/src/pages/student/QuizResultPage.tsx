import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  CheckCircle, XCircle, Award, ArrowLeft, RotateCcw,
  ChevronRight, Clock, Target, BarChart3
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProgressBar } from '@/components/shared/ProgressBar'
import { PageHeader } from '@/components/layout/PageHeader'
import { useUIStore } from '@/store/uiStore'
import { ROUTES } from '@/lib/constants'
import { mockQuizzes, mockQuestions, mockCourses } from '@/mocks/mockData'
import type { QuizResult, QuestionResult } from '@/types/assessment'

interface QuestionReview {
  questionId: string
  questionText: string
  userAnswer: string
  correctAnswer: string
  isCorrect: boolean
  explanation?: string
}

export function QuizResultPage() {
  const { quizId } = useParams<{ quizId: string }>()
  const navigate = useNavigate()
  const { addToast } = useUIStore()
  const [result, setResult] = useState<QuizResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [expandedQuestions, setExpandedQuestions] = useState<string[]>([])

  useEffect(() => {
    const loadResult = async () => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 600))
      
      // Mock result data
      const mockResult: QuizResult = {
        submissionId: 'sub-001',
        quizId: quizId || 'q1',
        quizTitle: mockQuizzes.find(q => q.id === quizId)?.title || 'Quiz',
        score: 85,
        totalPoints: 100,
        percentage: 85,
        passed: true,
        passingScore: 70,
        timeSpent: 1200, // 20 minutes
        submittedAt: new Date().toISOString(),
        questionResults: mockQuestions.slice(0, 5).map((q, i) => ({
          questionId: q.id,
          questionText: q.text,
          userAnswer: i === 2 ? 'wrong-answer' : q.correctOptionId,
          correctAnswer: q.correctOptionId,
          isCorrect: i !== 2,
          pointsEarned: i === 2 ? 0 : q.points,
          pointsPossible: q.points,
          explanation: q.explanation,
        })),
      }
      
      setResult(mockResult)
      setIsLoading(false)
      
      if (mockResult.passed) {
        addToast({
          type: 'success',
          title: 'Congratulations!',
          message: `You passed with ${mockResult.percentage}%`,
        })
      }
    }
    
    loadResult()
  }, [quizId, addToast])

  const toggleQuestion = (questionId: string) => {
    setExpandedQuestions(prev => 
      prev.includes(questionId) 
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    )
  }

  const handleBackToCourse = () => {
    navigate(ROUTES.STUDENT_COURSES)
  }

  const handleRetakeQuiz = () => {
    navigate(ROUTES.STUDENT_QUIZ_ATTEMPT.replace(':quizId', quizId || ''))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-1/3 bg-muted rounded" />
            <div className="h-64 bg-muted rounded-xl" />
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-muted rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Result Not Found</h1>
          <Button onClick={handleBackToCourse}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>
        </div>
      </div>
    )
  }

  const correctCount = result.questionResults.filter(q => q.isCorrect).length
  const incorrectCount = result.questionResults.length - correctCount

  return (
    <div className="min-h-screen bg-background pb-12">
      <PageHeader
        title="Quiz Results"
        description={result.quizTitle}
        breadcrumbs={[
          { label: 'My Courses', href: ROUTES.STUDENT_COURSES },
          { label: 'Quiz Results', href: '#' },
        ]}
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Score Card */}
        <Card className={`mb-8 ${result.passed ? 'border-green-200 bg-green-50/50' : 'border-red-200 bg-red-50/50'}`}>
          <CardContent className="p-8">
            <div className="grid gap-8 md:grid-cols-2 items-center">
              <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-2 mb-4">
                  {result.passed ? (
                    <>
                      <CheckCircle className="h-6 w-6 text-green-600" />
                      <span className="text-lg font-semibold text-green-600">Passed</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-6 w-6 text-red-600" />
                      <span className="text-lg font-semibold text-red-600">Failed</span>
                    </>
                  )}
                </div>
                
                <h2 className="text-5xl font-bold mb-2">
                  {result.percentage}%
                </h2>
                <p className="text-muted-foreground">
                  {result.score} out of {result.totalPoints} points
                </p>
                
                <div className="mt-4 flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{formatTime(result.timeSpent)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span>Passing: {result.passingScore}%</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Score</span>
                    <span className="font-medium">{result.percentage}%</span>
                  </div>
                  <ProgressBar 
                    progress={result.percentage} 
                    size="lg"
                    className={result.passed ? 'text-green-600' : 'text-red-600'}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-100 rounded-lg">
                    <p className="text-2xl font-bold text-green-700">{correctCount}</p>
                    <p className="text-sm text-green-600">Correct</p>
                  </div>
                  <div className="text-center p-4 bg-red-100 rounded-lg">
                    <p className="text-2xl font-bold text-red-700">{incorrectCount}</p>
                    <p className="text-sm text-red-600">Incorrect</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Certificate Card (if passed) */}
        {result.passed && (
          <Card className="mb-8 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Award className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">Certificate Earned!</h3>
                  <p className="text-muted-foreground">
                    You've earned a certificate for completing this quiz.
                  </p>
                </div>
                <Button variant="outline">
                  <Award className="h-4 w-4 mr-2" />
                  View Certificate
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Question Review */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Question Review
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {result.questionResults.map((question, index) => (
              <div
                key={question.questionId}
                className={`border rounded-lg overflow-hidden ${
                  question.isCorrect ? 'border-green-200' : 'border-red-200'
                }`}
              >
                <button
                  onClick={() => toggleQuestion(question.questionId)}
                  className="w-full p-4 flex items-start gap-4 text-left hover:bg-muted/50 transition-colors"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    question.isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {question.isCorrect ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <XCircle className="h-5 w-5" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <p className="font-medium">
                      Question {index + 1}: {question.questionText}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {question.pointsEarned} / {question.pointsPossible} points
                    </p>
                  </div>
                  
                  <ChevronRight className={`h-5 w-5 text-muted-foreground transition-transform ${
                    expandedQuestions.includes(question.questionId) ? 'rotate-90' : ''
                  }`} />
                </button>
                
                {expandedQuestions.includes(question.questionId) && (
                  <div className="px-4 pb-4 pl-16">
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Your answer:</span>
                        <span className={`ml-2 font-medium ${
                          question.isCorrect ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {question.userAnswer === question.correctAnswer ? 'Correct' : 'Incorrect'}
                        </span>
                      </div>
                      {!question.isCorrect && (
                        <div>
                          <span className="text-muted-foreground">Correct answer:</span>
                          <span className="ml-2 font-medium text-green-600">
                            {question.correctAnswer}
                          </span>
                        </div>
                      )}
                      {question.explanation && (
                        <div className="mt-3 p-3 bg-muted rounded-lg">
                          <span className="text-muted-foreground">Explanation:</span>
                          <p className="mt-1">{question.explanation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <Button variant="outline" onClick={handleBackToCourse}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Course
          </Button>
          
          {!result.passed && (
            <Button onClick={handleRetakeQuiz}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Retake Quiz
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default QuizResultPage
