"use client"

import { useEffect, useState } from "react"
import { getSupabaseClient } from "@/lib/supabase/supabase"
import TeamSectionHero from "@/components/homepage/TeamSection/hero"
import Header from "@/components/homepage/Header/header"
import Footer from "@/components/shared-component/footer/page"
import LeadershipSection from "@/components/homepage/TeamSection/leadership"
import JoinSection from "@/components/homepage/TeamSection/join"

type TeamMember = {
  id: string
  name: string
  role: string | null
  bio: string | null
  image_url: string | null
  email: string | null
  is_active: boolean
  display_order: number
}

export default function OurTeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const supabase = getSupabaseClient()
        const { data, error } = await supabase
          .from("team_members")
          .select("id, name, role, bio, image_url, email, is_active, display_order")
          .eq("is_active", true)
          .order("display_order", { ascending: true })
          .order("name", { ascending: true })

        if (error) {
          // If the DB hasn't been migrated yet, fall back to legacy columns and show all members.
          if (error.code === "42703") {
            const legacy = await supabase
              .from("team_members")
              .select("id, name, role, bio, image_url")
              .order("name", { ascending: true })
            if (legacy.error) throw legacy.error
            setMembers(
              (legacy.data ?? []).map((m: any) => ({
                ...m,
                is_active: true,
                display_order: 0,
              }))
            )
            return
          }
          throw error
        }

        setMembers(data ?? [])
      } catch (error) {
        console.error("Failed to fetch team members:", error)
        setMembers([])
      } finally {
        setLoading(false)
      }
    }

    fetchTeamMembers()
  }, [])

  return (
    <>
      <Header />
      <div className="animate-reveal-up">
        <TeamSectionHero />
        <LeadershipSection members={members} />
        <JoinSection />
      </div>
      <Footer />
    </>
  )
}
