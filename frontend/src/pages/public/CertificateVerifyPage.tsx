import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Search, Award, CheckCircle, XCircle, Download, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CertificateBadge } from '@/components/shared/CertificateBadge'
import { PageHeader } from '@/components/layout/PageHeader'
import { mockCourses, mockUsers } from '@/mocks/mockData'

interface CertificateData {
  code: string
  studentName: string
  courseName: string
  issueDate: string
  isValid: boolean
}

export function CertificateVerifyPage() {
  const { code: urlCode } = useParams<{ code?: string }>()
  const navigate = useNavigate()
  const [searchCode, setSearchCode] = useState(urlCode || '')
  const [certificate, setCertificate] = useState<CertificateData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(!!urlCode)
  const [error, setError] = useState('')

  const verifyCertificate = async (code: string) => {
    setIsLoading(true)
    setError('')
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Mock verification logic
    if (code.length < 8) {
      setError('Invalid certificate code format')
      setCertificate(null)
    } else {
      // Generate mock certificate data
      const mockCert: CertificateData = {
        code: code.toUpperCase(),
        studentName: mockUsers[2]?.fullName || 'John Doe',
        courseName: mockCourses[0]?.title || 'Advanced Python Programming',
        issueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        isValid: true,
      }
      setCertificate(mockCert)
    }
    
    setIsLoading(false)
    setHasSearched(true)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchCode.trim()) {
      verifyCertificate(searchCode.trim())
      // Update URL without navigation
      navigate(`/certificates/${searchCode.trim()}`, { replace: true })
    }
  }

  const handleDownload = () => {
    // Mock download functionality
    alert('Certificate download started!')
  }

  const handleShare = () => {
    if (navigator.share && certificate) {
      navigator.share({
        title: `Certificate for ${certificate.courseName}`,
        text: `Verify certificate: ${certificate.code}`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      <PageHeader
        title="Verify Certificate"
        description="Verify the authenticity of an Open LMS certificate"
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Enter certificate code (e.g., CERT-ABC123)"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>
            <Button 
              type="submit" 
              size="lg"
              disabled={isLoading || !searchCode.trim()}
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </Button>
          </form>
          
          {error && (
            <div className="mt-4 p-4 rounded-lg bg-destructive/10 text-destructive flex items-center gap-2">
              <XCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}
        </div>
        
        {/* Results Section */}
        {hasSearched && !isLoading && (
          <div className="max-w-3xl mx-auto">
            {certificate?.isValid ? (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-green-700">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Certificate Verified</span>
                  </div>
                </div>
                
                <CertificateBadge
                  studentName={certificate.studentName}
                  courseName={certificate.courseName}
                  issueDate={certificate.issueDate}
                  verificationCode={certificate.code}
                />
                
                <div className="flex justify-center gap-4">
                  <Button onClick={handleDownload} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button onClick={handleShare} variant="outline">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
                
                <div className="rounded-xl border bg-muted/50 p-6">
                  <h3 className="font-semibold mb-4">Certificate Details</h3>
                  <dl className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm text-muted-foreground">Student</dt>
                      <dd className="font-medium">{certificate.studentName}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Course</dt>
                      <dd className="font-medium">{certificate.courseName}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Issue Date</dt>
                      <dd className="font-medium">
                        {new Date(certificate.issueDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Verification Code</dt>
                      <dd className="font-medium font-mono">{certificate.code}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                  <XCircle className="h-10 w-10 text-destructive" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Certificate Not Found</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  We couldn't find a certificate with the provided code. Please check the code and try again.
                </p>
              </div>
            )}
          </div>
        )}
        
        {/* Info Section */}
        {!hasSearched && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Award className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Verify Any Certificate</h3>
            <p className="text-muted-foreground">
              Enter the certificate verification code to confirm its authenticity. 
              All certificates issued by Open LMS can be verified here.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CertificateVerifyPage
