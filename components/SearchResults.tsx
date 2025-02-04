import JobPost from "./JobPost"
import ChatMessage from "./ChatMessage"

export default function SearchResults({ results }) {
  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-2">Search Results</h2>
      {results.map((result, index) => (
        <div key={index} className="mb-2">
          {result.type === "chat" ? <ChatMessage content={result.content} /> : <JobPost content={result.content} />}
        </div>
      ))}
    </div>
  )
}

