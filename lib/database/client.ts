import { getSupabaseClient } from '../supabase/supabase'
import type {
  Post,
  Gallery,
  Event,
  TeamMember,
  Page,
  Donation,
  Contact,
  Project
} from './types'
import { DATABASE_TABLES } from './types'

const supabase = getSupabaseClient()

export class DatabaseClient {
  // Event operations
  static async getEvents(): Promise<Event[]> {
    const { data, error } = await supabase
      .from(DATABASE_TABLES.Events)
      .select('*')
      .order('event_date', { ascending: true })

    if (error) throw error
    return data || []
  }

  static async createEvent(event: Omit<Event, 'id' | 'created_at'>): Promise<Event> {
    const { data, error } = await supabase
      .from(DATABASE_TABLES.Events)
      .insert(event)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async updateEvent(id: string, event: Partial<Event>): Promise<Event> {
    const { data, error } = await supabase
      .from(DATABASE_TABLES.Events)
      .update(event)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async deleteEvent(id: string): Promise<void> {
    const { error } = await supabase
      .from(DATABASE_TABLES.Events)
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  //Project
  static async getCoverImage(projectId: string): Promise<string | null> {
    const { data, error } = await supabase
      .from('project_gallery')
      .select('image_url')
      .eq('project_id', projectId)
      .eq('is_cover', true)
      .single()

    if (error && error.code !== 'PGRST116') throw error // PGRST116 = not found
    return data?.image_url || null
  }

  static async getAllProjectImages(projectId: string) {
    const { data, error } = await supabase
      .from('project_gallery')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true })

    if (error) throw error
    return data || []
  }

  static async getProjects(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('project')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  //Post/Blog
  static async getPosts(type?: 'blog'): Promise<Post[]> {
    let query = supabase
      .from(DATABASE_TABLES.Posts)
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })

    if (type) {
      query = query.eq('type', type)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  }

  static async createPost(post: Omit<Post, 'id' | 'created_at'>): Promise<Post> {
    const { data, error } = await supabase
      .from(DATABASE_TABLES.Posts)
      .insert(post)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async updatePost(id: string, post: Partial<Post>): Promise<Post> {
    const { data, error } = await supabase
      .from(DATABASE_TABLES.Posts)
      .update(post)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async deletePost(id: string): Promise<void> {
    const { error } = await supabase
      .from(DATABASE_TABLES.Posts)
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  // Gallery operations
  static async getGallery(): Promise<Gallery[]> {
    const { data, error } = await supabase
      .from(DATABASE_TABLES.Gallery)
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  static async createGalleryItem(item: Omit<Gallery, 'id' | 'created_at'>): Promise<Gallery> {
    const { data, error } = await supabase
      .from(DATABASE_TABLES.Gallery)
      .insert(item)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async deleteGalleryItem(id: string): Promise<void> {
    const { error } = await supabase
      .from(DATABASE_TABLES.Gallery)
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  // Team members operations
  static async getTeamMembers(): Promise<TeamMember[]> {
    const { data, error } = await supabase
      .from(DATABASE_TABLES.TeamMembers)
      .select('*')

    if (error) throw error
    return data || []
  }

  static async createTeamMember(member: Omit<TeamMember, 'id'>): Promise<TeamMember> {
    const { data, error } = await supabase
      .from(DATABASE_TABLES.TeamMembers)
      .insert(member)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async updateTeamMember(id: string, member: Partial<TeamMember>): Promise<TeamMember> {
    const { data, error } = await supabase
      .from(DATABASE_TABLES.TeamMembers)
      .update(member)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async deleteTeamMember(id: string): Promise<void> {
    const { error } = await supabase
      .from(DATABASE_TABLES.TeamMembers)
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  // Pages operations
  static async getPage(slug: string): Promise<Page | null> {
    const { data, error } = await supabase
      .from(DATABASE_TABLES.Pages)
      .select('*')
      .eq('slug', slug)
      .single()

    if (error && error.code !== 'PGRST116') throw error // PGRST116 = not found
    return data
  }

  static async createPage(page: Omit<Page, 'id'>): Promise<Page> {
    const { data, error } = await supabase
      .from(DATABASE_TABLES.Pages)
      .insert(page)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async updatePage(slug: string, page: Partial<Page>): Promise<Page> {
    const { data, error } = await supabase
      .from(DATABASE_TABLES.Pages)
      .update(page)
      .eq('slug', slug)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Donations operations (public insert only)
  static async createDonation(donation: Omit<Donation, 'id' | 'created_at'>): Promise<Donation> {
    const { data, error } = await supabase
      .from(DATABASE_TABLES.Donations)
      .insert(donation)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async getDonations(): Promise<Donation[]> {
    const { data, error } = await supabase
      .from(DATABASE_TABLES.Donations)
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  // Contacts operations (public insert only)
  static async createContact(contact: Omit<Contact, 'id' | 'created_at'>): Promise<Contact> {
    const { data, error } = await supabase
      .from(DATABASE_TABLES.Contacts)
      .insert(contact)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async getContacts(): Promise<Contact[]> {
    const { data, error } = await supabase
      .from(DATABASE_TABLES.Contacts)
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }
}

export const {
  getPosts, createPost, updatePost, deletePost,
  getGallery, createGalleryItem, deleteGalleryItem,
  getEvents, createEvent, updateEvent, deleteEvent,
  getTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember,
  getPage, createPage, updatePage,
  createDonation, getDonations, createContact, getContacts,
  getProjects, getCoverImage, getAllProjectImages
} = DatabaseClient
