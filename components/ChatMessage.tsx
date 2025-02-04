import { Card, CardContent } from "@/components/ui/card"
import LinkPreview from "./LinkPreview"

export default function ChatMessage({ content }) {
  const urlRegex = /(https?:\/\/[^\s]+)/g
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

