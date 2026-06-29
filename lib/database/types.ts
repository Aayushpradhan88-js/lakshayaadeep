//Event
export interface Event {
  id: string
  title: string
  description?: string
  type: 'physical' | 'virtual'
  location?: string
  event_date?: string
  image_url?: string
  created_at: string
}

//Project
export interface Project {
  id: string
  title: string
  description?: string
  type: 'project'
  image_url?: string
  created_at: string
}

//Post - blog
export interface Post {
  id: string
  title: string
  content?: string
  excerpt?: string
  author: string
  category?: string
  tags?: string[]
  status: 'draft' | 'published' | 'archived'
  blog_image_url?: string
  published_at?: string
  read_time?: number // in minutes
  created_at: string
  updated_at: string
}

export type Blog = Post

//Article
export interface Article {
  id: string
  title: string
  content?: string
  excerpt?: string
  author: string
  article_no: number
  category?: string
  tags?: string[]
  status: 'draft' | 'published' | 'archived'
  article_image_url?: string
  published_at?: string
  read_time?: number // in minutes
  created_at: string
  updated_at: string
}

export interface Gallery {
  id: string
  image_url: string
  caption?: string
  created_at: string
}

export interface TeamMember {
  id: string
  name: string
  role?: string
  image_url?: string
  bio?: string
  is_active: boolean
  display_order: number
  updated_at?: string
}

export interface Page {
  id: string
  slug: string
  title?: string
  content?: string
}

export interface Donation {
  id: string
  name?: string
  email?: string
  amount: number
  message?: string
  created_at: string
}

export interface Contact {
  id: string
  name?: string
  email?: string
  message?: string
  created_at: string
}

export interface Feedback {
  id: string
  name?: string
  email?: string
  phone?: string | null
  subject?: string | null
  message: string | null
  status?: string | null
  source?: string | null
  created_at: string
  updated_at?: string | null
}

// Database table names
export const DATABASE_TABLES = {
  Events: 'Events',
  Projects: 'Projects',
  Articles: 'Articles',
  Posts: 'Posts',

  Gallery: 'Gallery',
  TeamMembers: 'TeamMembers',
  Pages: 'Pages',
  Donations: 'Donations',
  Contacts: 'Contacts',
  Feedback: 'Feedback'
} as const

export type DatabaseTable = typeof DATABASE_TABLES[keyof typeof DATABASE_TABLES]