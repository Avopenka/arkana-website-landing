import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  author: string;
  tags: string[];
  readingTime: number;
}

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-lg p-6 hover:border-brand-teal/50 transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs bg-brand-teal/20 text-brand-teal rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        <time className="text-sm text-gray-400">{post.readingTime} min read</time>
      </div>
      
      <h2 className="text-xl font-semibold text-white mb-3 hover:text-brand-teal transition-colors">
        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
      </h2>
      
      <p className="text-gray-300 mb-4 line-clamp-3">{post.excerpt}</p>
      
      <div className="flex justify-between items-center text-sm text-gray-400">
        <span>By {post.author}</span>
        <span>{new Date(post.date).toLocaleDateString()}</span>
      </div>
    </motion.article>
  );
}