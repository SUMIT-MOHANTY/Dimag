import { Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { RootLayout } from '@/components/layout/RootLayout'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { StudentLayout } from '@/components/layout/StudentLayout'
import { InstructorLayout } from '@/components/layout/InstructorLayout'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { ProtectedRoute } from '@/components/shared/ProtectedRoute'
import { RoleGuard } from '@/components/shared/RoleGuard'
import { LoadingScreen } from '@/components/layout/LoadingScreen'
import { ROUTES, ROLES } from '@/lib/constants'

// Lazy load pages for code splitting
const LandingPage = lazy(() => import('@/pages/public/LandingPage').then(m => ({ default: m.LandingPage })))
const CourseCatalogPage = lazy(() => import('@/pages/public/CourseCatalogPage').then(m => ({ default: m.CourseCatalogPage })))
const CourseDetailPage = lazy(() => import('@/pages/public/CourseDetailPage').then(m => ({ default: m.CourseDetailPage })))
const CertificateVerifyPage = lazy(() => import('@/pages/public/CertificateVerifyPage').then(m => ({ default: m.CertificateVerifyPage })))
const NotFoundPage = lazy(() => import('@/pages/public/NotFoundPage').then(m => ({ default: m.NotFoundPage })))

const LoginPage = lazy(() => import('@/pages/auth/LoginPage').then(m => ({ default: m.LoginPage })))
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage').then(m => ({ default: m.RegisterPage })))
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })))
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage').then(m => ({ default: m.ResetPasswordPage })))
const VerifyEmailPage = lazy(() => import('@/pages/auth/VerifyEmailPage').then(m => ({ default: m.VerifyEmailPage })))

const StudentDashboardPage = lazy(() => import('@/pages/student/StudentDashboardPage').then(m => ({ default: m.StudentDashboardPage })))
const MyCoursesPage = lazy(() => import('@/pages/student/MyCoursesPage').then(m => ({ default: m.MyCoursesPage })))
const CoursePlayerPage = lazy(() => import('@/pages/student/CoursePlayerPage').then(m => ({ default: m.CoursePlayerPage })))
const LessonViewPage = lazy(() => import('@/pages/student/LessonViewPage').then(m => ({ default: m.LessonViewPage })))
const QuizAttemptPage = lazy(() => import('@/pages/student/QuizAttemptPage').then(m => ({ default: m.QuizAttemptPage })))
const QuizResultPage = lazy(() => import('@/pages/student/QuizResultPage').then(m => ({ default: m.QuizResultPage })))
const StudentNotificationsPage = lazy(() => import('@/pages/student/StudentNotificationsPage').then(m => ({ default: m.StudentNotificationsPage })))
const StudentProfilePage = lazy(() => import('@/pages/student/StudentProfilePage').then(m => ({ default: m.StudentProfilePage })))

const InstructorDashboardPage = lazy(() => import('@/pages/instructor/InstructorDashboardPage').then(m => ({ default: m.InstructorDashboardPage })))
const InstructorCoursesPage = lazy(() => import('@/pages/instructor/InstructorCoursesPage').then(m => ({ default: m.InstructorCoursesPage })))
const CreateCoursePage = lazy(() => import('@/pages/instructor/CreateCoursePage').then(m => ({ default: m.CreateCoursePage })))
const GradebookPage = lazy(() => import('@/pages/instructor/GradebookPage').then(m => ({ default: m.GradebookPage })))

const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })))
const AdminUsersPage = lazy(() => import('@/pages/admin/AdminUsersPage').then(m => ({ default: m.AdminUsersPage })))
const AdminCoursesPage = lazy(() => import('@/pages/admin/AdminCoursesPage').then(m => ({ default: m.AdminCoursesPage })))
const AdminSettingsPage = lazy(() => import('@/pages/admin/AdminSettingsPage').then(m => ({ default: m.AdminSettingsPage })))

function App() {
  return (
    <RootLayout>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path={ROUTES.HOME} element={<LandingPage />} />
            <Route path={ROUTES.COURSES} element={<CourseCatalogPage />} />
            <Route path={ROUTES.COURSE_DETAIL} element={<CourseDetailPage />} />
            <Route path={ROUTES.CERTIFICATE_VERIFY} element={<CertificateVerifyPage />} />
          </Route>

          {/* Auth Routes */}
          <Route element={<PublicLayout />}>
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
            <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
            <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
            <Route path={ROUTES.VERIFY_EMAIL} element={<VerifyEmailPage />} />
          </Route>

          {/* Student Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<RoleGuard allowedRoles={[ROLES.STUDENT]} />}>
              <Route element={<StudentLayout />}>
                <Route path={ROUTES.STUDENT.DASHBOARD} element={<StudentDashboardPage />} />
                <Route path={ROUTES.STUDENT.MY_COURSES} element={<MyCoursesPage />} />
                <Route path={ROUTES.STUDENT.COURSE_PLAYER} element={<CoursePlayerPage />}>
                  <Route path={ROUTES.STUDENT.LESSON} element={<LessonViewPage />} />
                </Route>
                <Route path={ROUTES.STUDENT.QUIZ_ATTEMPT} element={<QuizAttemptPage />} />
                <Route path={ROUTES.STUDENT.QUIZ_RESULT} element={<QuizResultPage />} />
                <Route path={ROUTES.STUDENT.NOTIFICATIONS} element={<StudentNotificationsPage />} />
                <Route path={ROUTES.STUDENT.PROFILE} element={<StudentProfilePage />} />
              </Route>
            </Route>
          </Route>

          {/* Instructor Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<RoleGuard allowedRoles={[ROLES.INSTRUCTOR]} />}>
              <Route element={<InstructorLayout />}>
                <Route path={ROUTES.INSTRUCTOR.DASHBOARD} element={<InstructorDashboardPage />} />
                <Route path={ROUTES.INSTRUCTOR.MY_COURSES} element={<InstructorCoursesPage />} />
                <Route path={ROUTES.INSTRUCTOR.CREATE_COURSE} element={<CreateCoursePage />} />
                <Route path={ROUTES.INSTRUCTOR.GRADEBOOK} element={<GradebookPage />} />
              </Route>
            </Route>
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<RoleGuard allowedRoles={[ROLES.ADMIN]} />}>
              <Route element={<AdminLayout />}>
                <Route path={ROUTES.ADMIN.DASHBOARD} element={<AdminDashboardPage />} />
                <Route path={ROUTES.ADMIN.USERS} element={<AdminUsersPage />} />
                <Route path={ROUTES.ADMIN.COURSES} element={<AdminCoursesPage />} />
                <Route path={ROUTES.ADMIN.SETTINGS} element={<AdminSettingsPage />} />
              </Route>
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </RootLayout>
  )
}

export default App
