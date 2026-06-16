"use client";

import React from "react";
import { motion } from "framer-motion";
import { FiMail, FiTwitter, FiGithub, FiLinkedin, FiExternalLink } from "react-icons/fi";
import { SiLeetcode, SiGeeksforgeeks } from "react-icons/si";
import { Contact, SocialLink } from "../app/data/types";

interface DestinationProps {
  contact: Contact;
  socialLinks: SocialLink[];
}

export default function Destination({ contact, socialLinks }: DestinationProps) {
  // Find email link or fallback
  const emailLink = socialLinks.find(
    (link) => link.name.toLowerCase() === "email" || link.url.startsWith("mailto:")
  );
  const emailUrl = emailLink ? emailLink.url : "mailto:shreyam91183@gmail.com";

  // Get matching React icon
  const getSocialIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case "github":
        return <FiGithub size={20} />;
      case "linkedin":
        return <FiLinkedin size={20} />;
      case "twitter":
      case "x":
        return <FiTwitter size={20} />;
      case "email":
        return <FiMail size={20} />;
      case "leetcode":
        return <SiLeetcode size={20} />;
      case "geeksforgeeks":
        return <SiGeeksforgeeks size={20} />;
      default:
        return <FiExternalLink size={20} />;
    }
  };

  return (
    <section id="contact" className="relative w-full py-18 bg-white dark:bg-[#0a0a0a] transition-colors duration-300 overflow-hidden">
      {/* Soft gradient backgrounds for light mode */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-100 dark:bg-blue-900/40 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-[80px] opacity-70 dark:opacity-30 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-purple-50 dark:bg-purple-900/40 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-[100px] opacity-70 dark:opacity-30 -translate-x-1/2 translate-y-1/2" />

      <div className="relative max-w-4xl mx-auto px-6 z-10">
        <div className="text-center mb-16">
          <span className="text-xs font-mono text-blue-500 dark:text-blue-400 uppercase tracking-widest mb-4 block">08</span>
          <h2 className="text-4xl md:text-6xl font-light text-[#1a1a1a] dark:text-white mb-6">
            Ready for a new <span className="font-serif italic text-gray-500 dark:text-gray-400">Expedition?</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-lg font-light leading-relaxed">
            {contact.cta || "I'm always looking for new challenges, ambitious teams, and projects that make an impact. Let's build something remarkable together."}
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          <a
            href={emailUrl}
            className="group relative px-8 py-4 bg-[#1a1a1a] dark:bg-blue-600 rounded-full overflow-hidden mb-12 shadow-[0_10px_30px_rgba(26,26,26,0.2)] dark:shadow-[0_10px_30px_rgba(37,99,235,0.2)] hover:shadow-[0_10px_40px_rgba(26,26,26,0.3)] dark:hover:shadow-[0_10px_40px_rgba(37,99,235,0.3)] transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gray-800 dark:from-blue-700 to-[#1a1a1a] dark:to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center gap-3">
              <FiMail className="text-white text-xl" />
              <span className="text-white font-medium tracking-wide">Send a Message</span>
            </div>
          </a>

          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 px-4">
            {socialLinks
              .filter((social) => social.name.toLowerCase() !== "email")
              .map((social, i) => (
                <a
                  key={i}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-gray-100 dark:bg-[#1a1a1a] flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-[#1a1a1a] dark:hover:text-white hover:bg-gray-200 dark:hover:bg-[#222222] transition-all border border-gray-200 dark:border-gray-800 shadow-sm"
                  title={social.name}
                >
                  {getSocialIcon(social.name)}
                </a>
              ))}
          </div>
        </motion.div>
      </div>
      
      <div className="absolute bottom-8 left-0 right-0 text-center z-10">
        <p className="text-xs font-mono text-gray-400">
          © {new Date().getFullYear()} Shreyam Kanaujiya. Built with precision and a sense of adventure.
        </p>
      </div>
    </section>
  );
}
