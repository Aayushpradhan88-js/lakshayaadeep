"use client";

import { useState, useEffect } from "react";
import { getSupabaseClient } from "@/lib/supabase/supabase";

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

function FAQSection() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
          .from('faq')
          .select('id, question, answer')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (error) throw error;
        setFaqs(data || []);

        // Open the first one by default if available
        if (data && data.length > 0) {
          setOpen(data[0].id);
        }
      } catch (err) {
        console.error('Error fetching FAQs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  return (
    <section id="faqs" className="w-full scroll-mt-24 bg-white px-6 py-16">
      <div className="mx-auto max-w-2xl">
        {/* Heading */}
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-cyan-400">
            Got Questions?
          </p>
          <h2 className="text-4xl font-bold">
            <span className="text-[#ed7423]">Frequently</span>{" "}
            <span className="text-gray-900">Asked Questions</span>
          </h2>
          <p className="mx-auto mt-3 max-w-sm text-sm text-black">
            Everything you need to know about donating and volunteering with Lakshyadeep.
          </p>
        </div>

        {/* Accordion */}
        <div className="flex flex-col gap-3">
          {loading ? (
            // Skeleton Loader
            [1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 w-full animate-pulse rounded-2xl bg-gray-50" />
            ))
          ) : faqs.length > 0 ? (
            faqs.map((faq) => {
              const isOpen = open === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`overflow-hidden rounded-2xl border transition-all ${isOpen
                    ? "border-cyan-200 bg-cyan-50"
                    : "border-gray-100 bg-gray-50 hover:border-gray-200"
                    }`}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : faq.id)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left"
                  >
                    <span className={`text-sm font-semibold ${isOpen ? "text-cyan-600" : "text-black"}`}>
                      {faq.question}
                    </span>
                    <span
                      className={`ml-4 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold transition-transform ${isOpen
                        ? "bg-cyan-400 text-white rotate-45"
                        : "bg-white text-black border border-gray-200"
                        }`}
                    >
                      +
                    </span>
                  </button>
                  {isOpen && (
                    <p className="px-5 pb-5 text-sm leading-relaxed text-black">
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-black border border-dashed rounded-2xl border-gray-200">
              No FAQs available at the moment.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default FAQSection;