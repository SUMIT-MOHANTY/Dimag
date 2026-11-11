import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Eye, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PageHeader } from '@/components/layout/PageHeader'
import { FileUploader } from '@/components/shared/FileUploader'
import { useUIStore } from '@/store/uiStore'
import { ROUTES } from '@/lib/constants'
import type { CourseLevel } from '@/types/course'

interface CourseFormData {
  title: string
  shortDescription: string
  description: string
  level: CourseLevel
  language: string
  price: string
  isFree: boolean
  categories: string[]
  tags: string[]
}

export function CreateCoursePage() {
  const navigate = useNavigate()
  const { addToast } = useUIStore()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    shortDescription: '',
    description: '',
    level: 'beginner',
    language: 'English',
    price: '',
    isFree: false,
    categories: [],
    tags: [],
  })

  const steps = [
    { id: 1, title: 'Course Info', description: 'Basic details' },
    { id: 2, title: 'Curriculum', description: 'Content structure' },
    { id: 3, title: 'Settings', description: 'Pricing & options' },
    { id: 4, title: 'Review', description: 'Publish course' },
  ]

  const handleInputChange = (field: keyof CourseFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSaveDraft = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 800))
    setIsSaving(false)
    addToast({
      type: 'success',
      title: 'Draft Saved',
      message: 'Your course has been saved as a draft.',
    })
  }

  const handlePublish = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1200))
    setIsSaving(false)
    addToast({
      type: 'success',
      title: 'Course Published!',
      message: 'Your course is now live and available to students.',
    })
    navigate(ROUTES.INSTRUCTOR_COURSES)
  }

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    } else {
      navigate(ROUTES.INSTRUCTOR_COURSES)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Course Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Advanced Python Programming"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="shortDescription">Short Description *</Label>
              <Textarea
                id="shortDescription"
                placeholder="Brief description for course cards (max 150 characters)"
                maxLength={150}
                value={formData.shortDescription}
                onChange={(e) => handleInputChange('shortDescription', e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                {formData.shortDescription.length}/150 characters
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Full Description</Label>
              <Textarea
                id="description"
                placeholder="Detailed course description..."
                rows={6}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Level</Label>
                <Select
                  value={formData.level}
                  onValueChange={(value) => handleInputChange('level', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Language</Label>
                <Select
                  value={formData.language}
                  onValueChange={(value) => handleInputChange('language', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Spanish">Spanish</SelectItem>
                    <SelectItem value="French">French</SelectItem>
                    <SelectItem value="German">German</SelectItem>
                    <SelectItem value="Chinese">Chinese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Course Thumbnail</Label>
              <FileUploader
                accept="image/*"
                maxSize={5 * 1024 * 1024}
                onUpload={(file) => console.log('Upload:', file)}
              />
            </div>
          </div>
        )
      
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Curriculum Builder</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Add sections and lessons to structure your course content. 
                Drag and drop to reorder.
              </p>
              <Button>
                Add First Section
              </Button>
            </div>
            
            {/* Placeholder for curriculum sections */}
            <Card className="border-dashed">
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  No sections added yet. Start building your curriculum by adding sections and lessons.
                </p>
              </CardContent>
            </Card>
          </div>
        )
      
      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>Pricing</Label>
              <div className="flex items-center gap-4">
                <Button
                  variant={formData.isFree ? 'default' : 'outline'}
                  onClick={() => handleInputChange('isFree', true)}
                >
                  Free
                </Button>
                <Button
                  variant={!formData.isFree ? 'default' : 'outline'}
                  onClick={() => handleInputChange('isFree', false)}
                >
                  Paid
                </Button>
              </div>
              
              {!formData.isFree && (
                <div className="space-y-2">
                  <Label htmlFor="price">Price (USD)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="49.99"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                  />
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label>Categories</Label>
              <div className="flex flex-wrap gap-2">
                {['Development', 'Design', 'Business', 'Marketing', 'IT & Software'].map((cat) => (
                  <Badge
                    key={cat}
                    variant={formData.categories.includes(cat) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => {
                      const newCategories = formData.categories.includes(cat)
                        ? formData.categories.filter(c => c !== cat)
                        : [...formData.categories, cat]
                      handleInputChange('categories', newCategories)
                    }}
                  >
                    {cat}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                placeholder="Add tags separated by commas..."
                onChange={(e) => handleInputChange('tags', e.target.value.split(',').map(t => t.trim()))}
              />
            </div>
          </div>
        )
      
      case 4:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{formData.title || 'Untitled Course'}</h3>
                  <p className="text-muted-foreground">{formData.shortDescription || 'No description'}</p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{formData.level}</Badge>
                  <Badge variant="secondary">{formData.language}</Badge>
                  {formData.isFree ? (
                    <Badge className="bg-green-100 text-green-700">Free</Badge>
                  ) : (
                    <Badge variant="secondary">${formData.price || '0'}</Badge>
                  )}
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Ready to publish?</h4>
                  <p className="text-sm text-muted-foreground">
                    Review your course details above. Once published, your course will be visible to all students.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      <PageHeader
        title="Create New Course"
        description="Build your course step by step"
        breadcrumbs={[
          { label: 'My Courses', href: ROUTES.INSTRUCTOR_COURSES },
          { label: 'Create Course', href: '#' },
        ]}
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                      currentStep >= step.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {currentStep > step.id ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <p className={`text-sm font-medium ${currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 ${
                      currentStep > step.id ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Step Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].title}</CardTitle>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>
        
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {currentStep === 1 ? 'Cancel' : 'Back'}
          </Button>
          
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              disabled={isSaving}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            
            {currentStep < steps.length ? (
              <Button onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button onClick={handlePublish} disabled={isSaving}>
                <CheckCircle className="h-4 w-4 mr-2" />
                {isSaving ? 'Publishing...' : 'Publish Course'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateCoursePage
