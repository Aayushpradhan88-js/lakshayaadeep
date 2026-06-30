"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  FaTachometerAlt,
  FaUsers,
  FaImages,
  FaBlog,
  FaCalendarAlt,
  FaQuestionCircle,
  FaSignOutAlt,
  FaEnvelope,
  FaHandHoldingUsd,
  FaFileAlt,
  FaUserFriends,
  FaChartBar,
  FaCog,
  FaChevronDown,
  FaChevronUp,
  FaCheckCircle,
  FaFileImage,
  FaFileVideo,
  FaFolder,
  FaPhotoVideo,
  FaNewspaper,
  FaCalendarDay,
  FaInfoCircle,
  FaBars,
  FaTimes,
  FaExternalLinkAlt,
  FaHome,
  FaPlay
} from "react-icons/fa";
import Link from "next/link";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/supabase";
import { isAdminEmail } from "@/features/auth/lib/seed-admin";
import type { User } from "@supabase/supabase-js";
import { FaBook, FaRegNewspaper, FaSliders } from "react-icons/fa6";
import { AdminFeedbackProvider } from "@/components/shared-component/admin-feedback";

interface SidebarItem {
  id: string;
  label: string;
  expandable?: boolean;
  children?: { id: string; label: string; icon: React.ReactNode }[];
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    id: "dashboard",
    label: "Overview",
    expandable: false
  },
  {
    id: "gallery",
    label: "Media Library",
    expandable: true,
    children: [
      { id: "gallery", label: "Gallery", icon: <FaImages size={14} /> },
      { id: "notice", label: "Notice/Pop-up Message", icon: <FaEnvelope size={14} /> },
      { id: "carousel", label: "Carousel Slides", icon: <FaSliders size={14} /> },
      { id: "video", label: "Hero Video", icon: <FaPlay size={14} /> }
    ]
  },
  {
    id: "content",
    label: "Content",
    expandable: true,
    children: [
      { id: "blog", label: "Blog", icon: <FaBook size={14} /> },
      { id: "article", label: "Article", icon: <FaRegNewspaper size={14} /> }
      // { id: "news", label: "News", icon: <FaBlog size={14} /> },
    ]
  },
  {
    id: "project",
    label: "Project and event",
    expandable: true,
    children: [
      { id: "project", label: "Project", icon: <FaNewspaper size={14} /> },
      { id: "event", label: "event", icon: <FaCalendarAlt size={14} /> }
    ]
  },
  {
    id: "team",
    label: "Team Members",
    expandable: false
  },
  // { 
  //   id: "about", 
  //   label: "About Us", 
  //   expandable: false
  // },
  {
    id: "donation",
    label: "Donation",
    expandable: false
  },
  // { 
  //   id: "contact", 
  //   label: "Messages",
  //   expandable: false
  // },
  // { 
  //   id: "feedback", 
  //   label: "Feedback", 
  //   expandable: false
  // },
  {
    id: "faqs",
    label: "FAQs",
    expandable: false
  }
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Derive active item from the current URL path
  const pathSegments = pathname.split('/');
  const activeItemId = pathSegments[pathSegments.length - 1] || "dashboard";

  useEffect(() => {
    const mediaRoutes = ["gallery", "notice", "carousel", "video"];
    if (mediaRoutes.includes(activeItemId)) {
      setExpandedItems((prev) => (prev.includes("gallery") ? prev : [...prev, "gallery"]));
    }
  }, [activeItemId]);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (!isSupabaseConfigured()) {
          router.push("/login");
          return;
        }

        const supabase = getSupabaseClient();
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
          router.push("/login");
          return;
        }

        if (!isAdminEmail(user.email || "")) {
          router.push("/login");
          return;
        }

        setCurrentUser(user);
        setIsLoading(false);

        // Active item is now derived from usePathname — no manual state needed
      } catch (error) {
        console.error("Auth initialization error:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [router]);

  const handleSignOut = async () => {
    try {
      const supabase = getSupabaseClient();
      await supabase.auth.signOut();
      router.replace("/login");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-2 text-black">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-dvh overflow-hidden bg-slate-100">
      <div className="flex h-full">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:w-64 lg:shrink-0 lg:flex-col lg:h-full lg:border-r lg:border-slate-200 bg-white">
          <div className="flex flex-col h-full overflow-hidden">
            {/* Logo Section */}
            <div className="shrink-0 flex items-center gap-3 px-6 py-5 border-b border-slate-200">
              <img
                src="/logo.png"
                alt="Lakshyadeep Logo"
                className="h-8 w-auto"
              />
              <div>
                <p className="text-xl font-semibold tracking-tight text-emerald-800">Lakshyadeep</p>
                <p className="text-xs text-slate-500">Operations</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
              {SIDEBAR_ITEMS.map((item) => {
                const isExpanded = expandedItems.includes(item.id);
                const isActive = item.children?.some(child => child.id === activeItemId) || item.id === activeItemId;

                const toggleExpand = () => {
                  setExpandedItems(prev =>
                    isExpanded
                      ? prev.filter(id => id !== item.id)
                      : [...prev, item.id]
                  );
                };

                const handleChildClick = (childId: string) => {
                  router.push(`/dashboard/${childId}`);
                };

                return (
                  <div key={item.id} className="w-full">
                    {/* Main Item */}
                    <button
                      type="button"
                      onClick={() => {
                        if (item.expandable) {
                          toggleExpand();
                        } else {
                          if (item.id === "dashboard") {
                            router.push(`/dashboard`);
                          } else {
                            router.push(`/dashboard/${item.id}`);
                          }
                        }
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition ${isActive
                        ? "bg-emerald-50 text-emerald-900 border-emerald-200"
                        : "text-black hover:bg-slate-50 hover:text-slate-900"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        {item.children ? (
                          <div className="bg-slate-100 p-2 rounded">
                            {item.id === "gallery" ? (
                              <FaPhotoVideo className="h-4 w-4 text-black" />
                            ) : item.id === "event" ? (
                              <FaFolder className="h-4 w-4 text-black" />
                            ) : (
                              <FaFolder className="h-4 w-4 text-black" />
                            )}
                          </div>
                        ) : (
                          item.id === "dashboard" && <FaTachometerAlt size={16} /> ||
                          item.id === "posts" && <FaBlog size={16} /> ||
                          item.id === "gallery" && <FaImages size={16} /> ||
                          item.id === "event" && <FaCalendarAlt size={16} /> ||
                          item.id === "team" && <FaUserFriends size={16} /> ||
                          item.id === "about" && <FaInfoCircle size={16} /> ||
                          item.id === "pages" && <FaFileAlt size={16} /> ||
                          item.id === "donation" && <FaHandHoldingUsd size={16} /> ||
                          item.id === "contact" && <FaEnvelope size={16} /> ||
                          item.id === "feedback" && <FaEnvelope size={16} /> ||
                          item.id === "faqs" && <FaQuestionCircle size={16} />
                        )}
                        <span className="text-sm font-medium">{item.label}</span>
                      </div>
                      {item.expandable && (
                        <div className="flex items-center">
                          {isExpanded ? (
                            <FaChevronUp className="h-3 w-3" />
                          ) : (
                            <FaChevronDown className="h-3 w-3" />
                          )}
                        </div>
                      )}
                    </button>

                    {/* Dropdown Children */}
                    {item.expandable && isExpanded && (
                      <div className="ml-4 mt-1 space-y-1">
                        {item.children?.map((child) => (
                          <Link
                            key={child.id}
                            href={`/dashboard/${child.id}`}
                            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition ${child.id === activeItemId
                              ? "bg-emerald-50 text-emerald-900 border-emerald-200"
                              : "text-black hover:bg-slate-50 hover:text-slate-900"
                              }`}
                          >
                            {child.icon}
                            <span className="text-sm font-medium">{child.label}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Logout at Bottom */}
            <div className="shrink-0 px-4 py-4 border-t border-slate-200 space-y-2">
              <button
                type="button"
                onClick={() => window.open(process.env.NODE_ENV === 'development' ? 'http://localhost:3000/' : 'https://lakshyadeep-orpin.vercel.app', '_blank')}
                className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 transition-colors"
                title="Visit Website"
              >
                <FaExternalLinkAlt className="h-4 w-4" />
                <span>Visit Website</span>
              </button>
              <button
                type="button"
                onClick={handleSignOut}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                <FaSignOutAlt className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Menu Button */}
        <div className="lg:hidden fixed top-4 left-4 z-40">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 rounded-lg bg-white border border-slate-200 shadow-sm"
          >
            <FaBars className="h-6 w-6 text-black" />
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 w-full bg-white">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <img
                    src="/logo.png"
                    alt="Lakshyadeep Logo"
                    className="h-6 w-auto"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">Lakshyadeep</p>
                    <p className="truncate text-xs text-slate-500">
                      {currentUser?.email ?? "admin@lakshyadeep.com"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-md p-2 text-slate-500 hover:bg-slate-100"
                >
                  <FaTimes className="h-6 w-6" />
                </button>
              </div>

              <div className="border-t border-slate-200 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src="/logo.png"
                    alt="Lakshyadeep Logo"
                    className="h-6 w-auto"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">Lakshyadeep</p>
                    <p className="truncate text-xs text-slate-500">
                      {currentUser?.email ?? "admin@lakshyadeep.com"}
                    </p>
                  </div>
                </div>

                {/* Mobile navigation (so Feedback shows up here too). */}
                <div className="mt-2 space-y-2">
                  <Link
                    href="/dashboard/contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block rounded-lg px-3 py-2 text-sm font-semibold transition ${activeItemId === "contact"
                      ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
                      : "text-slate-700 hover:bg-slate-50 border border-slate-200"
                      }`}
                  >
                    Messages
                  </Link>
                  <Link
                    href="/dashboard/feedback"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block rounded-lg px-3 py-2 text-sm font-semibold transition ${activeItemId === "feedback"
                      ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
                      : "text-slate-700 hover:bg-slate-50 border border-slate-200"
                      }`}
                  >
                    Feedback
                  </Link>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    handleSignOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  <FaSignOutAlt className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-0 overflow-y-auto">
          <AdminFeedbackProvider>{children}</AdminFeedbackProvider>
        </main>
      </div>
    </div>
  );
}
