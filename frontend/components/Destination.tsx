"use client";

import { motion } from "framer-motion";
import {
  FiArrowUpRight,
  FiExternalLink,
  FiGithub,
  FiLinkedin,
  FiMail,
  FiTwitter,
} from "react-icons/fi";
import { SiGeeksforgeeks, SiLeetcode } from "react-icons/si";
import type { Contact, SocialLink } from "../app/data/types";
import { track } from "../lib/track";

/**
 * Destination — the invitation (section 14).
 *
 * Not "contact me" — the beginning of a conversation. One line of
 * encouragement, then a clear way in. Social links are supporting, not noisy.
 */

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface DestinationProps {
  contact: Contact;
  socialLinks: SocialLink[];
}

export default function Destination({
  contact,
  socialLinks,
}: DestinationProps) {
  const emailLink = socialLinks.find(
    (link) =>
      link.name.toLowerCase() === "email" || link.url.startsWith("mailto:"),
  );
  const emailUrl = emailLink ? emailLink.url : "mailto:shreyam91183@gmail.com";

  const getSocial = (name: string) => {
    switch (name.toLowerCase()) {
      case "github":
        return { Icon: FiGithub, size: 18 };
      case "linkedin":
        return { Icon: FiLinkedin, size: 18 };
      case "email":
        return { Icon: FiMail, size: 18 };
      case "leetcode":
        return { Icon: SiLeetcode, size: 18 };
      case "geeksforgeeks":
        return { Icon: SiGeeksforgeeks, size: 18 };
      default:
        return { Icon: FiExternalLink, size: 18 };
    }
  };

  return (
    <section
      id="contact"
      className="relative w-full md:py-16 bg-[#fcfcfc] dark:bg-[#0a0a0a] transition-colors duration-300 overflow-hidden"
    >
      {/* Soft ambient glow behind the statement */}
      <div className="absolute left-1/2 top-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e0e7ff] dark:bg-blue-900/20 blur-[140px] opacity-50 mix-blend-multiply dark:mix-blend-screen" />

      <div className="relative max-w-3xl mx-auto px-6 z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <span className="text-xs font-mono text-[#3b82f6] uppercase tracking-[0.3em] mb-6 block">
            Contact
          </span>

          {/* One strong invitation */}
          <h2 className="text-4xl md:text-6xl font-light tracking-tight text-[#1a1a1a] dark:text-[#fcfcfc] leading-[1.08]">
            Have something{" "}
            <span className="text-[#3b82f6]">worth building</span>?
          </h2>

          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 font-light leading-relaxed mt-6 max-w-xl mx-auto">
            {contact.cta ||
              "Tell me what you're thinking — even if it's still rough. A product, an idea, a problem that needs a builder."}
          </p>

          {/* Clear way in */}
          <a
            href={emailUrl}
            onClick={() => track("contact_email")}
            className="group mt-10 inline-flex items-center gap-3 text-[#1a1a1a] dark:text-white text-lg font-normal"
          >
            <span className="border-b border-[#3b82f6]/60 pb-1 transition-colors group-hover:border-[#3b82f6]">
              Let&apos;s talk
            </span>
            <FiArrowUpRight className="text-[#3b82f6] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </motion.div>

        {/* Supporting contact options */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-14 flex flex-wrap justify-center items-center gap-4"
        >
          {socialLinks
            .filter((social) => social.name.toLowerCase() !== "email")
            .map((social) => {
              const { Icon, size } = getSocial(social.name);
              return (
                <a
                  key={social.url}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    track("click_social", { platform: social.name })
                  }
                  className="w-10 h-10 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-[#3b82f6] hover:border-[#3b82f6]/60 transition-colors"
                  aria-label={social.name}
                  title={social.name}
                >
                  <Icon size={size} />
                </a>
              );
            })}
        </motion.div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 left-0 right-0 z-10 px-6 text-center">
        <p className="text-[11px] font-mono text-gray-400 dark:text-gray-600">
          © {new Date().getFullYear()} &nbsp;
 Shreyam Kanaujiya — built with
          persistence &amp; a sense of direction.
        </p>
      </div>
    </section>
  );
}
