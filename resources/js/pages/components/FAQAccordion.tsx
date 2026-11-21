import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useLightMotion } from "@/hooks/useLightMotion";
import type { FAQItem } from "@/types/common";

interface FAQAccordionProps {
  items: FAQItem[];
}

function FaqAnswerPanel({ answer }: { answer: string }) {
  return (
    <div className="border-t border-[#003B7A]/8 px-5 pb-5 pt-3 text-sm leading-relaxed text-[#003B7A]/70 sm:px-6">
      {answer}
    </div>
  );
}

export function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const useStaticMotion = useLightMotion();

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={item.question}
            className="overflow-hidden rounded-[1.35rem] border-2 border-[#003B7A]/10 bg-white shadow-[0_8px_30px_-14px_rgba(0,59,122,0.15)]"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-[#003B7A]/[0.03] sm:px-6"
              aria-expanded={isOpen}
            >
              <span className="pr-4 text-sm font-bold text-[#003B7A] sm:text-base">
                {item.question}
              </span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-[#003B7A]/45 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {useStaticMotion ? (
              <div
                className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <FaqAnswerPanel answer={item.answer} />
                </div>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <FaqAnswerPanel answer={item.answer} />
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        );
      })}
    </div>
  );
}
