// ChatMessage.tsx
import { Card, CardContent } from "@/components/ui/card"
import LinkPreview from "./LinkPreview"

export default function ChatMessage({ content }: { content?: string | null }) { // Added type
  const urlRegex = /(https?:\/\/[^\s]+)/g

  // Handle undefined or null content
  if (!content) {
    return null; // Or return some placeholder, e.g., <p>Empty message</p>
    //return <Card><CardContent><p>Empty message</p></CardContent></Card>
  }

  const parts = content.split(urlRegex)

  return (
    <Card>
      <CardContent className="p-4">
        {parts.map((part, index) => {
          if (part.match(urlRegex)) {
            return <LinkPreview key={index} url={part} />
          }
          return <span key={index}>{part}</span>
        })}
      </CardContent>
    </Card>
  )
}