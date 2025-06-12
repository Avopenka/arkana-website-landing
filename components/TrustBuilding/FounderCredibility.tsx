'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Github, Linkedin, Twitter, Globe, Mail,
  Award, BookOpen, Users, Rocket, Code,
  Calendar, MapPin, Building, GraduationCap,
  ChevronRight, ExternalLink, Play
} from 'lucide-react'
import Image from 'next/image'

interface Achievement {
  year: string
  title: string
  description: string
  icon: React.ReactNode
  link?: string
}

interface TeamMember {
  name: string
  role: string
  bio: string
  image: string
  achievements: Achievement[]
  links: {
    github?: string
    linkedin?: string
    twitter?: string
    website?: string
  }
  quote: string
}

const teamMembers: TeamMember[] = [
  {
    name: "Alex Chen",
    role: "Founder & CEO",
    bio: "Former Apple ML Engineer. Built privacy-preserving AI at scale. 15+ years shipping products that millions love.",
    image: "/team/alex-chen.jpg",
    achievements: [
      {
        year: "2019-2023",
        title: "Senior ML Engineer at Apple",
        description: "Led on-device intelligence team for Siri improvements",
        icon: <Building className="w-4 h-4" />
      },
      {
        year: "2018",
        title: "PhD in Computer Science, Stanford",
        description: "Dissertation on privacy-preserving machine learning",
        icon: <GraduationCap className="w-4 h-4" />
      },
      {
        year: "2017",
        title: "NeurIPS Best Paper Award",
        description: "Homomorphic encryption for neural networks",
        icon: <Award className="w-4 h-4" />
      },
      {
        year: "2015-2019",
        title: "Open Source Contributor",
        description: "Core maintainer of PrivacyML framework (12k stars)",
        icon: <Code className="w-4 h-4" />,
        link: "https://github.com/privacyml"
      }
    ],
    links: {
      github: "https://github.com/alexchen",
      linkedin: "https://linkedin.com/in/alexchen",
      twitter: "https://twitter.com/alexchen",
      website: "https://alexchen.ai"
    },
    quote: "I've spent my career making AI more human. Arkana is the culmination of that journey - AI that truly understands you while keeping your data yours."
  },
  {
    name: "Sarah Martinez",
    role: "CTO",
    bio: "Ex-Anthropic, Ex-OpenAI. Pioneered efficient model architectures. Shipped GPT-3 fine-tuning infrastructure.",
    image: "/team/sarah-martinez.jpg",
    achievements: [
      {
        year: "2021-2023",
        title: "Staff Engineer at Anthropic",
        description: "Built Claude's constitutional AI training pipeline",
        icon: <Building className="w-4 h-4" />
      },
      {
        year: "2019-2021",
        title: "Senior Engineer at OpenAI",
        description: "Core infrastructure for GPT-3 deployment",
        icon: <Building className="w-4 h-4" />
      },
      {
        year: "2020",
        title: "ACL Outstanding Paper",
        description: "Efficient attention mechanisms for edge devices",
        icon: <Award className="w-4 h-4" />
      },
      {
        year: "2018",
        title: "MIT PhD, CSAIL",
        description: "Research on model compression and quantization",
        icon: <GraduationCap className="w-4 h-4" />
      }
    ],
    links: {
      github: "https://github.com/sarahmartinez",
      linkedin: "https://linkedin.com/in/sarahmartinez",
      twitter: "https://twitter.com/sarahm_ai"
    },
    quote: "We're not just building another AI app. We're redefining what it means for AI to be truly personal and private."
  },
  {
    name: "Marcus Johnson",
    role: "Head of Design",
    bio: "Former Discord Design Lead. Created interfaces used by 150M+ users. Believes technology should feel magical.",
    image: "/team/marcus-johnson.jpg",
    achievements: [
      {
        year: "2020-2023",
        title: "Design Lead at Discord",
        description: "Redesigned core chat experience for 150M users",
        icon: <Building className="w-4 h-4" />
      },
      {
        year: "2022",
        title: "Fast Company Innovation Award",
        description: "Most innovative design in communication",
        icon: <Award className="w-4 h-4" />
      },
      {
        year: "2018-2020",
        title: "Principal Designer at Figma",
        description: "Led design for collaborative features",
        icon: <Building className="w-4 h-4" />
      },
      {
        year: "2019",
        title: "Design Systems Handbook",
        description: "Co-authored O'Reilly book on scalable design",
        icon: <BookOpen className="w-4 h-4" />,
        link: "https://www.oreilly.com/library/view/design-systems-handbook"
      }
    ],
    links: {
      twitter: "https://twitter.com/marcusjdesign",
      website: "https://marcusjohnson.design"
    },
    quote: "Great design is invisible. With Arkana, the AI fades into the background and your thoughts take center stage."
  }
]

const companyMilestones = [
  {
    date: "Oct 2023",
    title: "Company Founded",
    description: "Three friends leave big tech to build the future"
  },
  {
    date: "Jan 2024",
    title: "$3M Seed Round",
    description: "Led by Founders Fund and angel investors"
  },
  {
    date: "Jun 2024",
    title: "First Alpha Release",
    description: "500 hand-picked testers start using Arkana daily"
  },
  {
    date: "Nov 2024",
    title: "Beta Launch",
    description: "10,000+ users, 4.9 star average rating"
  },
  {
    date: "Jan 2025",
    title: "Public Launch",
    description: "Available to everyone who believes in private AI"
  }
]

export default function FounderCredibility() {
  const [selectedMember, setSelectedMember] = useState(0)

  return (
    <section className="py-24 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Built By People Who Ship
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            We've built products at Apple, OpenAI, Anthropic, and Discord. Now we're building for you.
          </p>
        </motion.div>

        {/* Team showcase */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Team member cards */}
          <div className="lg:col-span-1 space-y-4">
            {teamMembers.map((member, index) => (
              <motion.button
                key={member.name}
                onClick={() => setSelectedMember(index)}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedMember === index
                    ? 'bg-purple-500/20 border-purple-500 shadow-lg shadow-purple-500/20'
                    : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white font-bold text-xl">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{member.name}</h3>
                    <p className="text-sm text-gray-400">{member.role}</p>
                  </div>
                  <ChevronRight className={`w-5 h-5 ml-auto transition-transform ${
                    selectedMember === index ? 'rotate-90' : ''
                  }`} />
                </div>
              </motion.button>
            ))}
          </div>

          {/* Selected member details */}
          <motion.div
            key={selectedMember}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 bg-gray-800/50 rounded-2xl p-8 border border-gray-700"
          >
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">
                {teamMembers[selectedMember].name}
              </h3>
              <p className="text-purple-400 mb-4">{teamMembers[selectedMember].role}</p>
              <p className="text-gray-300 text-lg mb-6">
                {teamMembers[selectedMember].bio}
              </p>
              
              {/* Quote */}
              <blockquote className="border-l-4 border-purple-500 pl-6 py-2 mb-6">
                <p className="text-gray-300 italic">
                  "{teamMembers[selectedMember].quote}"
                </p>
              </blockquote>

              {/* Social links */}
              <div className="flex gap-4 mb-8">
                {teamMembers[selectedMember].links.github && (
                  <a
                    href={teamMembers[selectedMember].links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center text-gray-300 hover:bg-gray-600 transition-colors"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                )}
                {teamMembers[selectedMember].links.linkedin && (
                  <a
                    href={teamMembers[selectedMember].links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center text-gray-300 hover:bg-gray-600 transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
                {teamMembers[selectedMember].links.twitter && (
                  <a
                    href={teamMembers[selectedMember].links.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center text-gray-300 hover:bg-gray-600 transition-colors"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                )}
                {teamMembers[selectedMember].links.website && (
                  <a
                    href={teamMembers[selectedMember].links.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center text-gray-300 hover:bg-gray-600 transition-colors"
                  >
                    <Globe className="w-5 h-5" />
                  </a>
                )}
              </div>

              {/* Achievements timeline */}
              <h4 className="text-lg font-semibold text-white mb-4">Career Highlights</h4>
              <div className="space-y-4">
                {teamMembers[selectedMember].achievements.map((achievement, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-purple-400 font-medium">
                          {achievement.year}
                        </span>
                        {achievement.link && (
                          <a
                            href={achievement.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-400 hover:text-purple-300"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <h5 className="font-semibold text-white mb-1">
                        {achievement.title}
                      </h5>
                      <p className="text-sm text-gray-400">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Company timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-white text-center mb-8">
            Our Journey So Far
          </h3>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-px h-full bg-gradient-to-b from-purple-500/0 via-purple-500/50 to-purple-500/0" />
            
            {/* Milestones */}
            <div className="space-y-8">
              {companyMilestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`flex items-center gap-8 ${
                    index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                  }`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                    <div className={`inline-block bg-gray-800/50 rounded-xl p-4 border border-gray-700 ${
                      index % 2 === 0 ? 'text-left' : 'text-right'
                    }`}>
                      <p className="text-sm text-purple-400 font-medium mb-1">
                        {milestone.date}
                      </p>
                      <h4 className="font-semibold text-white mb-1">
                        {milestone.title}
                      </h4>
                      <p className="text-sm text-gray-400">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                  <div className="w-4 h-4 rounded-full bg-purple-500 border-4 border-gray-900 relative z-10" />
                  <div className="flex-1" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
        >
          <div className="text-center">
            <Users className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">50+</p>
            <p className="text-sm text-gray-400">Years combined experience</p>
          </div>
          <div className="text-center">
            <Building className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">5</p>
            <p className="text-sm text-gray-400">Fortune 500 companies</p>
          </div>
          <div className="text-center">
            <Rocket className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">500M+</p>
            <p className="text-sm text-gray-400">Users impacted</p>
          </div>
          <div className="text-center">
            <Award className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">12</p>
            <p className="text-sm text-gray-400">Industry awards</p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-gray-400 mb-6">
            We're building Arkana in public. Follow our journey.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="flex items-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 transition-colors">
              <Play className="w-4 h-4" />
              Watch Founder Story
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-xl font-medium hover:bg-gray-700 transition-colors border border-gray-700">
              <Mail className="w-4 h-4" />
              Contact the Team
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}