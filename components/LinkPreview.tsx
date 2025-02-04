"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LinkPreview({ url }) {
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    // Simulating a preview for the demo
    setPreview({
      title: "Link Title",
      description: "This is a preview of the linked content.",
      image: "https://via.placeholder.com/150",
    })
  }, [])

  if (!preview)
    return (
      <a href={url} target="_blank" rel="noopener noreferrer">
        {url}
      </a>
    )

  return (
    <Card className="mt-2">
      <CardHeader>
        <CardTitle>{preview.title}</CardTitle>
        <CardDescription>{url}</CardDescription>
      </CardHeader>
      <CardContent>
        <img src={preview.image || "/placeholder.svg"} alt="Link preview" className="mb-2 rounded" />
        <p>{preview.description}</p>
      </CardContent>
    </Card>
  )
}

