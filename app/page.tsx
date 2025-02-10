"use client"

import { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import JobPost from "@/components/JobPost"
import ChatMessage from "@/components/ChatMessage"
import SearchResults from "@/components/SearchResults"
// import { supabase } from "@/lib/supabaseClient" // Correct import, use client
import { Database } from "@/lib/database.types"
import { createClient } from '@/lib/supabaseClient' // Import from supabaseClient, not supabaseServer

type Message = Database['public']['Tables']['chat_messages']['Row']
type JobPostType = Database['public']['Tables']['job_posts']['Row']

export default function MessageBoard() {
  const [activeTab, setActiveTab] = useState("chat")
  const [messages, setMessages] = useState<Message[]>([])
  const [jobPosts, setJobPosts] = useState<JobPostType[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(true);  // This was already correct
  const [error, setError] = useState<string | null>(null); // And this one
  const [supabase, setSupabase] = useState<ReturnType<typeof createClient> | null>(null);

  interface SearchResult {
    content: string;
    type: string;
    id: string; // Assuming id is a string. Change to number if it's a number.
  }

  useEffect(() => { //Initialize supabase
      setSupabase(createClient());
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if(!supabase) return; // Wait for supabase to be initialized

      setLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('room_id', 'general') // Assuming a 'general' room for now
          .order('created_at', { ascending: true });

        if (fetchError) {
          throw fetchError;
        }
        setMessages(data || []);
      } catch (error: any) {
        setError(error.message || 'Failed to fetch messages');
      } finally {
        setLoading(false);
      }
    };
      fetchMessages();
  }, [supabase]); // Depend on supabase

  const handlePost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const content = (e.target as HTMLFormElement).content.value;
    if(!supabase) return;

    if (activeTab === "chat") {
      try {
        const { error: insertError } = await supabase
          .from('chat_messages')
          .insert({ content, room_id: 'general' }); // Assuming 'general' room

        if (insertError) {
          throw insertError;
        }
        // Fetch messages again to update the list
        const { data, error: fetchError } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('room_id', 'general')
          .order('created_at', { ascending: true });

        if (fetchError) {
          throw fetchError;
        }
        setMessages(data || []);

      } catch (error: any) {
        setError(error.message || 'Failed to post message');
      }
    } else {
      // Check if the content is a URL
      const urlRegex = /https?:\/\/[^\s]+/
      if (urlRegex.test(content)) {
          // You were casting to 'any' here, which is not ideal.
          //  We'll create a minimal object that satisfies JobPostType.
          //  *Crucially*, it needs an `id`.  We can't know the ID before
          //  inserting into Supabase. This approach is flawed.
          //setJobPosts([...jobPosts, { content, id: "temp" } as JobPostType]); // Incorrect

        //Correct approach is add it to the job_posts table:
          try{
              const {error} = await supabase.from('job_posts').insert([{content}]);
              if(error) throw error;

              //Refetch job posts
              const {data, error: fetchError} = await supabase.from('job_posts').select('*');
              if(fetchError) throw fetchError;
              setJobPosts(data || []);


          } catch(error: any){
              setError(error.message || "Failed to post job");
          }

      } else {
        alert("Please enter a valid job post URL")
        return
      }
    }
    (e.target as HTMLFormElement).reset()
  }

    const fetchJobPosts = useCallback(async () => { //Fetch job posts
        if(!supabase) return;
        try {
            const { data, error } = await supabase.from('job_posts').select('*');
            if (error) throw error;
            setJobPosts(data || []);
        } catch(error: any) {
            setError(error.message || "Failed to fetch job posts");
        }
    }, [supabase]);


    useEffect(() => {
        if(activeTab === 'jobs') {
            fetchJobPosts();
        }
    }, [activeTab, fetchJobPosts]);


  const handleSearch = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
        if(!supabase) return;
      // We need to fetch *both* messages and job posts *before* searching.
      //  This is because we're doing the search *in the client*, not in Supabase.
      //  It's much more efficient to do the search *in Supabase*.  I'll show that
      //  in a separate, improved example below.

      const results: SearchResult[] = [
        ...messages.map((msg) => ({ content: msg.content, type: "chat", id: String(msg.id) })), //convert id to string
        ...jobPosts.map((post) => ({ content: post.description, type: "job", id: String(post.id) })),
      ].filter(item => item.content.toLowerCase().includes(searchQuery.toLowerCase()));
      setSearchResults(results);
    },
    [searchQuery, messages, jobPosts], // Correct dependencies
  );

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

      <Tabs defaultValue="chat" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="chat">Group Chat</TabsTrigger>
          <TabsTrigger value="jobs">Job Posts</TabsTrigger>
        </TabsList>
        <TabsContent value="chat">
          <div className="space-y-4 mb-4">
            {loading && <p>Loading messages...</p>}
            {error && <p>Error: {error}</p>}
            {!loading && !error && messages.map((msg) => (
  <ChatMessage key={msg.id} content={msg.content || ""}/>
))}
          </div>
           </TabsContent>
        <TabsContent value="jobs">
          <div className="space-y-4 mb-4">
            {/* Key needs to be unique and consistent. Using index is generally bad practice.*/}
            {/* Use post.id, since you now have it from Supabase. */}
            {jobPosts.map((post) => (
              <JobPost key={post.id} job={{title: "Job Post", company: "Placeholder", location: "Placeholder", description: post.description}} />
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