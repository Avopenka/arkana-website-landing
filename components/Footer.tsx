'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const isInView = useInView(footerRef, { once: false, amount: 0.3 });

  const footerLinks = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "#features" },
        { name: "Pricing", href: "#pricing" },
        { name: "Privacy", href: "#privacy" },
        { name: "FAQ", href: "#faq" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About", href: "#about" },
        { name: "Blog", href: "#blog" },
        { name: "Careers", href: "#careers" },
        { name: "Contact", href: "#contact" }
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Terms", href: "#terms" },
        { name: "Privacy", href: "#privacy-policy" },
        { name: "Cookies", href: "#cookies" }
      ]
    }
  ];

  const socialLinks = [
    { name: "X", href: "https://x.com/ArkanaChat", icon: "twitter" },
    { name: "LinkedIn", href: "https://linkedin.com/company/arkana-chat", icon: "linkedin" },
    { name: "Instagram", href: "https://instagram.com/arkana.chat", icon: "instagram" }
  ];

  return (
    <footer 
      ref={footerRef}
      className="bg-pure-black pt-16 pb-8 relative overflow-hidden"
    >
      {/* Luxury background effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(22,255,225,0.03),transparent_30%)]"></div>
      
      <div className="container-luxury relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
          {/* Logo and description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            className="md:col-span-2"
          >
            <Link href="/" className="block mb-6">
              <Image 
                src="/MainLogoENoNameNoBackGround.png" 
                alt="Arkana" 
                width={120} 
                height={120} 
                className="object-contain h-12 w-auto" 
              />
            </Link>
            
            <p className="text-white/80 mb-6">
              A companion for your mind. Lives in your pocket. Listens to your voice. Guards your secrets.
            </p>
            
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <Link 
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-brand-teal/20 hover:text-brand-teal transition-all duration-300"
                  aria-label={social.name}
                >
                  <span className="sr-only">{social.name}</span>
                  {social.icon === "twitter" && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M23 3.00005C22.0424 3.67552 20.9821 4.19216 19.86 4.53005C19.2577 3.83756 18.4573 3.34674 17.567 3.12397C16.6767 2.90121 15.7395 2.95724 14.8821 3.2845C14.0247 3.61176 13.2884 4.19445 12.773 4.95376C12.2575 5.71308 11.9877 6.61238 12 7.53005V8.53005C10.2426 8.57561 8.50127 8.18586 6.93101 7.39549C5.36074 6.60513 4.01032 5.43868 3 4.00005C3 4.00005 -1 13 8 17C5.94053 18.398 3.48716 19.099 1 19C10 24 21 19 21 7.50005C20.9991 7.2215 20.9723 6.94364 20.92 6.67005C21.9406 5.66354 22.6608 4.39276 23 3.00005Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                  {social.icon === "linkedin" && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M6 9H2V21H6V9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                  {social.icon === "instagram" && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 2H7C4.23858 2 2 4.23858 2 7V17C2 19.7614 4.23858 22 7 22H17C19.7614 22 22 19.7614 22 17V7C22 4.23858 19.7614 2 17 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16 11.37C16.1234 12.2022 15.9813 13.0522 15.5938 13.799C15.2063 14.5458 14.5931 15.1514 13.8416 15.5297C13.0901 15.9079 12.2384 16.0396 11.4078 15.9059C10.5771 15.7723 9.80976 15.3801 9.21484 14.7852C8.61992 14.1902 8.22773 13.4229 8.09407 12.5922C7.9604 11.7615 8.09207 10.9099 8.47033 10.1584C8.84859 9.40685 9.45419 8.79374 10.201 8.40624C10.9478 8.01874 11.7978 7.87659 12.63 8C13.4789 8.12588 14.2649 8.52146 14.8717 9.1283C15.4785 9.73515 15.8741 10.5211 16 11.37Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M17.5 6.5H17.51" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </Link>
              ))}
            </div>
          </motion.div>
          
          {/* Footer links */}
          {footerLinks.map((column, idx) => (
            <motion.div
              key={column.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.1 * (idx + 1), ease: [0.19, 1, 0.22, 1] }}
            >
              <h4 className="text-white font-medium mb-4">{column.title}</h4>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-white/70 hover:text-brand-teal transition-colors duration-300 focus:outline-none focus:text-brand-teal"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.19, 1, 0.22, 1] }}
          className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-white/70 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Arkana. All rights reserved.
          </p>
          
          <div className="flex space-x-6">
            <Link 
              href="#terms"
              className="text-white/70 hover:text-brand-teal transition-colors duration-300 text-sm focus:outline-none focus:text-brand-teal"
            >
              Terms
            </Link>
            <Link 
              href="#privacy"
              className="text-white/70 hover:text-brand-teal transition-colors duration-300 text-sm focus:outline-none focus:text-brand-teal"
            >
              Privacy
            </Link>
            <Link 
              href="#cookies"
              className="text-white/70 hover:text-brand-teal transition-colors duration-300 text-sm focus:outline-none focus:text-brand-teal"
            >
              Cookies
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
