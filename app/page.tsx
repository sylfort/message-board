"use client"

import { useState, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import JobPost from "@/components/JobPost"
import ChatMessage from "@/components/ChatMessage"
import SearchResults from "@/components/SearchResults"

export default function MessageBoard() {
  const [activeTab, setActiveTab] = useState("chat")
  const [messages, setMessages] = useState([])
  const [jobPosts, setJobPosts] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])

  const handlePost = (e) => {
    e.preventDefault()
    const content = e.target.content.value
    if (activeTab === "chat") {
      setMessages([...messages, { type: "chat", content }])
    } else {
      // Check if the content is a URL
      const urlRegex = /https?:\/\/[^\s]+/
      if (urlRegex.test(content)) {
        setJobPosts([...jobPosts, { type: "job", content }])
      } else {
        alert("Please enter a valid job post URL")
        return
      }
    }
    e.target.reset()
  }

  const handleSearch = useCallback(
    async (e) => {
      e.preventDefault()
      const results = [
        ...messages.map((msg) => ({ ...msg, type: "chat" })),
        ...jobPosts.map((post) => ({ ...post, type: "job" })),
      ].filter((item) => item.content.toLowerCase().includes(searchQuery.toLowerCase()))
      setSearchResults(results)
    },
    [searchQuery, messages, jobPosts],
  )

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Code Bootcamp Message Board</h1>

      <form onSubmit={handleSearch} className="mb-4">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button type="submit">Search</Button>
        </div>
      </form>

      <Tabs defaultValue="chat" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="chat">Group Chat</TabsTrigger>
          <TabsTrigger value="jobs">Job Posts</TabsTrigger>
        </TabsList>
        <TabsContent value="chat">
          <div className="space-y-4 mb-4">
            {messages.map((msg, index) => (
              <ChatMessage key={index} content={msg.content} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="jobs">
          <div className="space-y-4 mb-4">
            {jobPosts.map((post, index) => (
              <JobPost key={index} content={post.content} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <form onSubmit={handlePost} className="mt-4">
        <div className="flex gap-2">
          <Input
            name="content"
            placeholder={activeTab === "chat" ? "Type your message..." : "Share a job post URL..."}
          />
          <Button type="submit">Post</Button>
        </div>
      </form>

      {searchResults.length > 0 && <SearchResults results={searchResults} />}
    </div>
  )
}

