import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { extractJobInfo } from "@/lib/jobUtils"

export default function JobPost({ content }) {
  const [jobInfo, setJobInfo] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchJobInfo = async () => {
      try {
        const info = await extractJobInfo(content)
        setJobInfo(info)
      } catch (err) {
        setError("Failed to load job information")
      } finally {
        setIsLoading(false)
      }
    }
    fetchJobInfo()
  }, [content])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-4">
            <Skeleton className="h-16 w-16 rounded" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !jobInfo) {
    return (
      <Card>
        <CardContent>
          <p>{error || "Unable to load job information"}</p>
          <p className="text-sm text-muted-foreground mt-2">{content}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{jobInfo.title}</CardTitle>
        <CardDescription>{jobInfo.company}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-start space-x-4">
          <img src={jobInfo.image || "/placeholder.svg"} alt="Company logo" className="w-16 h-16 object-contain" />
          <div>
            <p className="font-semibold">{jobInfo.location}</p>
            <p className="text-sm text-muted-foreground">{jobInfo.description}</p>
            <a
              href={jobInfo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 hover:underline mt-2 inline-block"
            >
              View full job post
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

