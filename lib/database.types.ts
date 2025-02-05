export interface User {
  id: string;
  created_at: string;
  email: string;
  username: string;
  avatar_url?: string;
}

export interface ChatMessage {
  id: string;
  created_at: string;
  user_id: string;
  content: string;
  room_id: string;
}

export interface JobPost {
  id: string;
  created_at: string;
  title: string;
  description: string;
  company: string;
  location?: string;
  salary_range?: string;
  posted_by?: string;
}

export interface LinkPreview {
  id: string;
  created_at: string;
  url: string;
  title?: string;
  description?: string;
  image_url?: string;
}
