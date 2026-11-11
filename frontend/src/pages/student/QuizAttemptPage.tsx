import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Clock, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight, 
  Flag,
  BookOpen,
  AlertTriangle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { QuizTimer } from '@/components/shared/QuizTimer'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { PageHeader } from '@/components/layout/PageHeader'
import { useUIStore } from '@/store/uiStore'
import { mockQuizzes, mockQuestions } from '@/mocks/mockData'
import type { Quiz, Question, AnswerOption } from '@/types/assessment'

export function QuizAttemptPage() {
  const { quizId } = useParams<{ quizId: string }>()
  const navigate = useNavigate()
  const { addToast } = useUIStore()
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const [quizStarted, setQuizStarted] = useState(false)

  useEffect(() => {
    const loadQuiz = async () => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 400))

      const foundQuiz = mockQuizzes.find(q => q.id === quizId)
      if (foundQuiz) {
        setQuiz(foundQuiz)
        // Get questions for this quiz
        const quizQuestions = mockQuestions.filter(q => q.quizId === quizId)
        setQuestions(quizQuestions)
      }
      setIsLoading(false)
    }

    loadQuiz()
  }, [quizId])

  const handleStartQuiz = () => {
    setQuizStarted(true)
  }

  const handleAnswer = (questionId: string, answer: string | string[]) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }))
  }

  const handleFlagQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex]
    if (!currentQuestion) return

    setFlaggedQuestions(prev => {
      const newSet = new Set(prev)
      if (newSet.has(currentQuestion.id)) {
        newSet.delete(currentQuestion.id)
      } else {
        newSet.add(currentQuestion.id)
      }
      return newSet
    })
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    setShowSubmitDialog(false)
    
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    addToast({
      type: 'success',
      title: 'Quiz Submitted',
      message: 'Your answers have been submitted successfully.',
    })

    navigate(`/student/quizzes/${quizId}/result`)
  }

  const handleTimeExpire = () => {
    addToast({
      type: 'warning',
      title: 'Time\'s Up!',
      message: 'Your quiz has been automatically submitted.',
    })
    handleSubmit()
  }

  const currentQuestion = questions[currentQuestionIndex]
  const answeredCount = Object.keys(answers).length
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Loading quiz...</p>
        </div>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Quiz Not Found</h1>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    )
  }

  // Start Screen
  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-background pb-12">
        <PageHeader
          title={quiz.title}
          description="Read the instructions carefully before starting"
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-xl font-semibold mb-6">Quiz Instructions</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Time Limit</p>
                    <p className="text-sm text-muted-foreground">
                      You have {Math.floor(quiz.timeLimitSeconds / 60)} minutes to complete this quiz.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Questions</p>
                    <p className="text-sm text-muted-foreground">
                      This quiz contains {questions.length} questions.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Flag className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Flag Questions</p>
                    <p className="text-sm text-muted-foreground">
                      You can flag questions to review them later.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Auto-Submit</p>
                    <p className="text-sm text-muted-foreground">
                      The quiz will be automatically submitted when time runs out.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 mb-8">
                <p className="text-sm text-muted-foreground">
                  <strong>Passing Score:</strong> {quiz.passingScore}%<br />
                  <strong>Maximum Attempts:</strong> {quiz.maxAttempts}
                </p>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                <Button onClick={handleStartQuiz} className="flex-1">
                  Start Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Quiz Header */}
      <div className="sticky top-0 z-40 bg-card border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-semibold">{quiz.title}</h1>
              <p className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
            </div>
            
            <QuizTimer 
              totalSeconds={quiz.timeLimitSeconds}
              onExpire={handleTimeExpire}
            />
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Content */}
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {currentQuestion && (
          <Card>
            <CardContent className="p-6">
              {/* Question Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <span className="text-sm text-muted-foreground block mb-2">
                    Question {currentQuestionIndex + 1}
                  </span>
                  <h2 className="text-lg font-medium">{currentQuestion.text}</h2>
                  {currentQuestion.description && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {currentQuestion.description}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleFlagQuestion}
                  className={flaggedQuestions.has(currentQuestion.id) ? 'text-yellow-500' : ''}
                >
                  <Flag className="h-4 w-4" />
                </Button>
              </div>

              {/* Answer Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                      answers[currentQuestion.id] === option.id
                        ? 'border-primary bg-primary/5'
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      value={option.id}
                      checked={answers[currentQuestion.id] === option.id}
                      onChange={() => handleAnswer(currentQuestion.id, option.id)}
                      className="h-4 w-4 text-primary"
                    />
                    <span className="flex-1">{option.text}</span>
                  </label>
                ))}
              </div>

              {/* Question Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={handlePrevQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>

                <div className="flex gap-2">
                  {Array.from({ length: questions.length }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentQuestionIndex(i)}
                      className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                        i === currentQuestionIndex
                          ? 'bg-primary text-primary-foreground'
                          : answers[questions[i]?.id]
                          ? 'bg-primary/20 text-primary'
                          : flaggedQuestions.has(questions[i]?.id)
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                {currentQuestionIndex < questions.length - 1 ? (
                  <Button onClick={handleNextQuestion}>
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={() => setShowSubmitDialog(true)}>
                    Submit Quiz
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quiz Summary */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-sm">
                  <span className="text-muted-foreground">Answered:</span>{' '}
                  <span className="font-medium">{answeredCount}/{questions.length}</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Flagged:</span>{' '}
                  <span className="font-medium">{flaggedQuestions.size}</span>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowSubmitDialog(true)}
              >
                Submit Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submit Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showSubmitDialog}
        onClose={() => setShowSubmitDialog(false)}
        onConfirm={handleSubmit}
        title="Submit Quiz?"
        description={`You have answered ${answeredCount} out of ${questions.length} questions. ${
          answeredCount < questions.length 
            ? `You still have ${questions.length - answeredCount} unanswered questions.` 
            : ''
        } Are you sure you want to submit?`}
        confirmText="Submit"
        cancelText="Continue"
        variant="default"
      />
    </div>
  )
}

export default QuizAttemptPage
