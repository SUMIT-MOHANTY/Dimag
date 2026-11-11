import type { AuthUser } from '@/types/auth'
import type { Course, CourseListItem, Section, Lesson } from '@/types/course'
import type { Enrollment } from '@/types/enrollment'
import type { Notification } from '@/types/notification'
import type { Quiz, Question } from '@/types/assessment'

// Mock Users
export const mockUsers: AuthUser[] = [
  {
    id: 'u1',
    email: 'amara.osei@openlms.dev',
    fullName: 'Dr. Amara Osei',
    role: 'instructor',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=amara',
    isEmailVerified: true,
    createdAt: '2023-01-15T08:00:00Z',
  },
  {
    id: 'u2',
    email: 'james.chen@openlms.dev',
    fullName: 'Prof. James Chen',
    role: 'instructor',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james',
    isEmailVerified: true,
    createdAt: '2023-02-20T10:00:00Z',
  },
  {
    id: 'u3',
    email: 'sarah.student@example.com',
    fullName: 'Sarah Johnson',
    role: 'student',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    isEmailVerified: true,
    createdAt: '2023-03-10T14:30:00Z',
  },
  {
    id: 'u4',
    email: 'mike.brown@example.com',
    fullName: 'Michael Brown',
    role: 'student',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
    isEmailVerified: true,
    createdAt: '2023-04-05T09:15:00Z',
  },
  {
    id: 'u5',
    email: 'emma.davis@example.com',
    fullName: 'Emma Davis',
    role: 'student',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
    isEmailVerified: false,
    createdAt: '2023-05-12T11:45:00Z',
  },
]

// Mock Courses
export const mockCourses: Course[] = [
  {
    id: 'c1',
    slug: 'advanced-python-programming',
    title: 'Advanced Python Programming',
    shortDescription: 'Master advanced Python concepts including decorators, generators, async programming, and metaclasses.',
    description: 'Take your Python skills to the next level with this comprehensive course on advanced programming concepts.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&q=80',
    instructorId: 'u1',
    instructorName: 'Dr. Amara Osei',
    instructorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=amara',
    status: 'published',
    level: 'advanced',
    language: 'English',
    price: 49.99,
    isFree: false,
    avgRating: 4.8,
    ratingCount: 234,
    enrollmentCount: 1205,
    tags: ['python', 'programming', 'advanced'],
    categories: ['Programming', 'Software Development'],
    createdAt: '2023-06-01T10:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
    publishedAt: '2023-06-15T09:00:00Z',
  },
  {
    id: 'c2',
    slug: 'javascript-fundamentals',
    title: 'JavaScript Fundamentals',
    shortDescription: 'Learn the basics of JavaScript programming from scratch. Perfect for beginners.',
    description: 'A comprehensive introduction to JavaScript covering variables, functions, objects, and DOM manipulation.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&q=80',
    instructorId: 'u2',
    instructorName: 'Prof. James Chen',
    instructorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james',
    status: 'published',
    level: 'beginner',
    language: 'English',
    price: 29.99,
    isFree: false,
    avgRating: 4.6,
    ratingCount: 189,
    enrollmentCount: 856,
    tags: ['javascript', 'web', 'frontend'],
    categories: ['Web Development', 'Programming'],
    createdAt: '2023-07-10T08:00:00Z',
    updatedAt: '2024-02-01T11:00:00Z',
    publishedAt: '2023-07-20T10:00:00Z',
  },
  {
    id: 'c3',
    slug: 'react-modern-web-development',
    title: 'React: Modern Web Development',
    shortDescription: 'Build modern web applications with React, Hooks, and the latest ecosystem tools.',
    description: 'Master React from the ground up. Learn hooks, context, Redux, and build real-world applications.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
    instructorId: 'u2',
    instructorName: 'Prof. James Chen',
    instructorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james',
    status: 'published',
    level: 'intermediate',
    language: 'English',
    price: 59.99,
    isFree: false,
    avgRating: 4.9,
    ratingCount: 312,
    enrollmentCount: 2341,
    tags: ['react', 'javascript', 'frontend', 'web'],
    categories: ['Web Development', 'Frontend'],
    createdAt: '2023-08-05T12:00:00Z',
    updatedAt: '2024-01-20T15:00:00Z',
    publishedAt: '2023-08-15T09:00:00Z',
  },
  {
    id: 'c4',
    slug: 'data-science-with-python',
    title: 'Data Science with Python',
    shortDescription: 'Learn data analysis, visualization, and machine learning with Python.',
    description: 'Comprehensive data science course covering pandas, numpy, matplotlib, scikit-learn, and more.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    instructorId: 'u1',
    instructorName: 'Dr. Amara Osei',
    instructorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=amara',
    status: 'published',
    level: 'intermediate',
    language: 'English',
    price: 69.99,
    isFree: false,
    avgRating: 4.7,
    ratingCount: 278,
    enrollmentCount: 1567,
    tags: ['python', 'data-science', 'machine-learning', 'pandas'],
    categories: ['Data Science', 'Machine Learning'],
    createdAt: '2023-09-01T09:00:00Z',
    updatedAt: '2024-02-10T10:30:00Z',
    publishedAt: '2023-09-10T08:00:00Z',
  },
  {
    id: 'c5',
    slug: 'introduction-to-sql',
    title: 'Introduction to SQL',
    shortDescription: 'Master SQL and database fundamentals. From basics to advanced queries.',
    description: 'Learn to write SQL queries, design databases, and understand relational database concepts.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&q=80',
    instructorId: 'u1',
    instructorName: 'Dr. Amara Osei',
    instructorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=amara',
    status: 'published',
    level: 'beginner',
    language: 'English',
    price: 0,
    isFree: true,
    avgRating: 4.5,
    ratingCount: 145,
    enrollmentCount: 3421,
    tags: ['sql', 'database', 'data'],
    categories: ['Database', 'Data Science'],
    createdAt: '2023-10-01T10:00:00Z',
    updatedAt: '2024-01-05T09:00:00Z',
    publishedAt: '2023-10-10T08:00:00Z',
  },
  {
    id: 'c6',
    slug: 'cloud-computing-fundamentals',
    title: 'Cloud Computing Fundamentals',
    shortDescription: 'Understand cloud computing concepts, AWS basics, and cloud architecture.',
    description: 'Introduction to cloud computing with hands-on AWS experience and architecture best practices.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
    instructorId: 'u2',
    instructorName: 'Prof. James Chen',
    instructorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james',
    status: 'draft',
    level: 'beginner',
    language: 'English',
    price: 39.99,
    isFree: false,
    avgRating: 0,
    ratingCount: 0,
    enrollmentCount: 0,
    tags: ['cloud', 'aws', 'devops'],
    categories: ['Cloud Computing', 'DevOps'],
    createdAt: '2024-01-10T14:00:00Z',
    updatedAt: '2024-02-15T11:00:00Z',
  },
  {
    id: 'c7',
    slug: 'mobile-app-development-flutter',
    title: 'Mobile App Development with Flutter',
    shortDescription: 'Build cross-platform mobile apps for iOS and Android using Flutter and Dart.',
    description: 'Complete Flutter course covering Dart, widgets, state management, and app deployment.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80',
    instructorId: 'u1',
    instructorName: 'Dr. Amara Osei',
    instructorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=amara',
    status: 'published',
    level: 'intermediate',
    language: 'English',
    price: 54.99,
    isFree: false,
    avgRating: 4.8,
    ratingCount: 198,
    enrollmentCount: 987,
    tags: ['flutter', 'dart', 'mobile', 'android', 'ios'],
    categories: ['Mobile Development', 'Programming'],
    createdAt: '2023-11-01T09:00:00Z',
    updatedAt: '2024-01-25T14:00:00Z',
    publishedAt: '2023-11-15T10:00:00Z',
  },
  {
    id: 'c8',
    slug: 'cybersecurity-basics',
    title: 'Cybersecurity Basics',
    shortDescription: 'Learn the fundamentals of cybersecurity and protect systems from threats.',
    description: 'Introduction to cybersecurity covering network security, encryption, and threat detection.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
    instructorId: 'u2',
    instructorName: 'Prof. James Chen',
    instructorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james',
    status: 'archived',
    level: 'beginner',
    language: 'English',
    price: 44.99,
    isFree: false,
    avgRating: 4.4,
    ratingCount: 89,
    enrollmentCount: 456,
    tags: ['security', 'cybersecurity', 'networking'],
    categories: ['Security', 'IT'],
    createdAt: '2023-06-15T08:00:00Z',
    updatedAt: '2023-12-01T09:00:00Z',
    publishedAt: '2023-06-20T10:00:00Z',
  },
]

// Mock Enrollments
export const mockEnrollments: Enrollment[] = [
  {
    id: 'e1',
    studentId: 'u3',
    courseId: 'c1',
    status: 'active',
    completionPercentage: 45,
    enrolledAt: '2024-01-10T10:00:00Z',
    lastAccessedAt: '2024-02-20T15:30:00Z',
  },
  {
    id: 'e2',
    studentId: 'u3',
    courseId: 'c2',
    status: 'completed',
    completionPercentage: 100,
    enrolledAt: '2023-08-15T09:00:00Z',
    completedAt: '2023-10-20T14:00:00Z',
    lastAccessedAt: '2023-10-20T14:00:00Z',
  },
  {
    id: 'e3',
    studentId: 'u3',
    courseId: 'c5',
    status: 'active',
    completionPercentage: 20,
    enrolledAt: '2024-02-01T11:00:00Z',
    lastAccessedAt: '2024-02-15T10:00:00Z',
  },
  {
    id: 'e4',
    studentId: 'u4',
    courseId: 'c3',
    status: 'active',
    completionPercentage: 75,
    enrolledAt: '2024-01-05T14:00:00Z',
    lastAccessedAt: '2024-02-18T16:00:00Z',
  },
  {
    id: 'e5',
    studentId: 'u4',
    courseId: 'c4',
    status: 'dropped',
    completionPercentage: 30,
    enrolledAt: '2023-11-10T09:00:00Z',
    droppedAt: '2024-01-15T10:00:00Z',
    lastAccessedAt: '2024-01-10T11:00:00Z',
  },
  {
    id: 'e6',
    studentId: 'u5',
    courseId: 'c7',
    status: 'active',
    completionPercentage: 10,
    enrolledAt: '2024-02-10T08:00:00Z',
    lastAccessedAt: '2024-02-19T09:30:00Z',
  },
]

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    recipientId: 'u3',
    type: 'enrollment_confirmed',
    title: 'Enrollment Confirmed',
    body: 'You have been successfully enrolled in Advanced Python Programming.',
    isRead: false,
    data: { courseId: 'c1', courseTitle: 'Advanced Python Programming' },
    createdAt: '2024-01-10T10:00:00Z',
  },
  {
    id: 'n2',
    recipientId: 'u3',
    type: 'course_published',
    title: 'New Course Available',
    body: 'A new course "Introduction to SQL" is now available.',
    isRead: true,
    data: { courseId: 'c5', courseTitle: 'Introduction to SQL' },
    createdAt: '2024-01-05T09:00:00Z',
    readAt: '2024-01-05T10:00:00Z',
  },
  {
    id: 'n3',
    recipientId: 'u3',
    type: 'certificate_earned',
    title: 'Certificate Earned!',
    body: 'Congratulations! You have earned a certificate for JavaScript Fundamentals.',
    isRead: false,
    data: { courseId: 'c2', courseTitle: 'JavaScript Fundamentals', certificateCode: 'CERT-2023-001' },
    createdAt: '2023-10-20T14:00:00Z',
  },
  {
    id: 'n4',
    recipientId: 'u4',
    type: 'quiz_graded',
    title: 'Quiz Graded',
    body: 'Your quiz "React Hooks Assessment" has been graded.',
    isRead: false,
    data: { quizId: 'q1', quizTitle: 'React Hooks Assessment', score: 85 },
    createdAt: '2024-02-18T16:00:00Z',
  },
  {
    id: 'n5',
    recipientId: 'u5',
    type: 'discussion_reply',
    title: 'New Reply',
    body: 'Sarah Johnson replied to your comment in "Flutter State Management".',
    isRead: true,
    data: { threadId: 't1', threadTitle: 'Flutter State Management' },
    createdAt: '2024-02-15T11:00:00Z',
    readAt: '2024-02-15T12:00:00Z',
  },
]

// Mock Sections with Lessons
export const mockSections: Section[] = [
  {
    id: 's1',
    courseId: 'c1',
    title: 'Getting Started',
    position: 1,
    lessons: [
      { id: 'l1', sectionId: 's1', title: 'Course Introduction', type: 'video', duration: 300, position: 1, isPreview: true },
      { id: 'l2', sectionId: 's1', title: 'Setting Up Your Environment', type: 'video', duration: 600, position: 2, isPreview: true },
      { id: 'l3', sectionId: 's1', title: 'Python Review', type: 'text', duration: 0, position: 3 },
    ],
  },
  {
    id: 's2',
    courseId: 'c1',
    title: 'Advanced Functions',
    position: 2,
    lessons: [
      { id: 'l4', sectionId: 's2', title: 'Understanding Decorators', type: 'video', duration: 900, position: 1 },
      { id: 'l5', sectionId: 's2', title: 'Building Custom Decorators', type: 'video', duration: 1200, position: 2 },
      { id: 'l6', sectionId: 's2', title: 'Context Managers Deep Dive', type: 'video', duration: 800, position: 3 },
    ],
  },
  {
    id: 's3',
    courseId: 'c1',
    title: 'Generators and Iterators',
    position: 3,
    lessons: [
      { id: 'l7', sectionId: 's3', title: 'Generator Functions', type: 'video', duration: 1000, position: 1 },
      { id: 'l8', sectionId: 's3', title: 'Iterator Protocol', type: 'video', duration: 750, position: 2 },
      { id: 'l9', sectionId: 's3', title: 'Practical Applications', type: 'text', duration: 0, position: 3 },
    ],
  },
  {
    id: 's4',
    courseId: 'c1',
    title: 'Async Programming',
    position: 4,
    lessons: [
      { id: 'l10', sectionId: 's4', title: 'Introduction to Async/Await', type: 'video', duration: 1100, position: 1 },
      { id: 'l11', sectionId: 's4', title: 'Asyncio in Practice', type: 'video', duration: 1300, position: 2 },
      { id: 'l12', sectionId: 's4', title: 'Final Assessment', type: 'quiz', duration: 0, position: 3 },
    ],
  },
]

// Mock Quizzes
export const mockQuizzes: Quiz[] = [
  {
    id: 'q1',
    courseId: 'c1',
    title: 'Python Review Quiz',
    description: 'Test your basic Python knowledge before diving into advanced topics.',
    timeLimitSeconds: 1800,
    maxAttempts: 3,
    passingScore: 70,
    isPublished: true,
    questionCount: 10,
    totalPoints: 100,
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
  },
  {
    id: 'q2',
    courseId: 'c1',
    title: 'Final Assessment',
    description: 'Comprehensive assessment covering all advanced Python topics.',
    timeLimitSeconds: 3600,
    maxAttempts: 2,
    passingScore: 75,
    isPublished: true,
    questionCount: 25,
    totalPoints: 250,
    createdAt: '2024-01-25T14:00:00Z',
    updatedAt: '2024-01-25T14:00:00Z',
  },
  {
    id: 'q3',
    courseId: 'c2',
    title: 'JavaScript Fundamentals Quiz',
    description: 'Test your understanding of JavaScript basics.',
    timeLimitSeconds: 1200,
    maxAttempts: 5,
    passingScore: 60,
    isPublished: true,
    questionCount: 15,
    totalPoints: 150,
    createdAt: '2024-02-05T09:00:00Z',
    updatedAt: '2024-02-05T09:00:00Z',
  },
]

// Mock Questions
export const mockQuestions: Question[] = [
  {
    id: 'ques1',
    quizId: 'q1',
    type: 'multiple_choice',
    text: 'What is the output of print(type(lambda x: x))?',
    explanation: 'Lambda functions in Python are of type function.',
    points: 10,
    position: 1,
    options: [
      { id: 'opt1', text: "<class 'function'>", isCorrect: true },
      { id: 'opt2', text: "<class 'lambda'>", isCorrect: false },
      { id: 'opt3', text: "<class 'builtin_function_or_method'>", isCorrect: false },
      { id: 'opt4', text: "<class 'object'>", isCorrect: false },
    ],
  },
  {
    id: 'ques2',
    quizId: 'q1',
    type: 'multiple_choice',
    text: 'Which of the following is used to create a generator in Python?',
    explanation: 'The yield keyword is used to create generator functions.',
    points: 10,
    position: 2,
    options: [
      { id: 'opt5', text: 'return', isCorrect: false },
      { id: 'opt6', text: 'yield', isCorrect: true },
      { id: 'opt7', text: 'generate', isCorrect: false },
      { id: 'opt8', text: 'async', isCorrect: false },
    ],
  },
  {
    id: 'ques3',
    quizId: 'q1',
    type: 'true_false',
    text: 'Python decorators are functions that modify the behavior of other functions.',
    explanation: 'Decorators are a design pattern in Python that allows a user to add new functionality to an existing object without modifying its structure.',
    points: 10,
    position: 3,
    options: [
      { id: 'opt9', text: 'True', isCorrect: true },
      { id: 'opt10', text: 'False', isCorrect: false },
    ],
  },
]

// Helper functions
export const getCourseBySlug = (slug: string): Course | undefined => {
  return mockCourses.find(c => c.slug === slug)
}

export const getCourseById = (id: string): Course | undefined => {
  return mockCourses.find(c => c.id === id)
}

export const getUserById = (id: string): AuthUser | undefined => {
  return mockUsers.find(u => u.id === id)
}

export const getUserEnrollments = (userId: string): Enrollment[] => {
  return mockEnrollments.filter(e => e.studentId === userId)
}

export const getUserNotifications = (userId: string): Notification[] => {
  return mockNotifications.filter(n => n.recipientId === userId)
}

export const getCourseSections = (courseId: string): Section[] => {
  return mockSections.filter(s => s.courseId === courseId)
}

export const getQuizById = (id: string): Quiz | undefined => {
  return mockQuizzes.find(q => q.id === id)
}

export const getQuizQuestions = (quizId: string): Question[] => {
  return mockQuestions.filter(q => q.quizId === quizId)
}
