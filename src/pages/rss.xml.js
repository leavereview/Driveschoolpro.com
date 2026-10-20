// /rss.xml — blog feed. Metricool's Blog connection and RSS autolists read this,
// so new posts can be shared to social automatically. Same filter as the blog index.
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const now = new Date();
  const posts = (await getCollection('blog'))
    .filter(post => new Date(post.data.date) <= now && !post.data.noindex)
    .sort((a, b) => new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf());

  return rss({
    title: 'DriveSchoolPro blog',
    description: 'Tips and guides for UK driving instructors and driving schools.',
    site: context.site,
    items: posts.map(post => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: new Date(post.data.updatedDate ?? post.data.date),
      link: `/blog/${post.slug}/`,
      ...(post.data.image && {
        enclosure: {
          url: new URL(post.data.image, context.site).href,
          type: post.data.image.endsWith('.png') ? 'image/png' : post.data.image.endsWith('.webp') ? 'image/webp' : 'image/jpeg',
          length: 0,
        },
      }),
    })),
    customData: '<language>en-gb</language>',
  });
}
