import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.string(),
    updatedDate: z.string().optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    tags: z.array(z.string()).optional(),
    author: z.string().default('John Powell'),
    category: z.string().optional(),
    /** US-focused or off-topic posts: kept live for visitors, hidden from search and listings */
    noindex: z.boolean().optional(),
    skill_number: z.number().optional(),
    howTo: z.object({
      name: z.string(),
      description: z.string(),
      steps: z.array(z.object({
        name: z.string(),
        text: z.string(),
      }))
    }).optional(),
    faqs: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).optional(),
  }),
});

export const collections = {
  blog: blogCollection,
};
