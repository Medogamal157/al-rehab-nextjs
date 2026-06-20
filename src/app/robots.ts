import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://al-rehabgroup.com';

  // Public, content-only paths. Admin/API/auth stay private for every crawler.
  const disallow = ['/admin/', '/api/', '/login', '/_next/', '/private/'];

  // AI / LLM crawlers we explicitly welcome so the site can surface in
  // ChatGPT, Perplexity, Google AI Overviews, Gemini, Claude, Copilot, etc.
  const aiUserAgents = [
    'GPTBot', // OpenAI training
    'OAI-SearchBot', // ChatGPT search
    'ChatGPT-User', // ChatGPT browsing on user request
    'PerplexityBot', // Perplexity index
    'Perplexity-User', // Perplexity browsing on user request
    'Google-Extended', // Gemini / Vertex grounding
    'GoogleOther',
    'Applebot-Extended', // Apple Intelligence
    'ClaudeBot', // Anthropic
    'Claude-User',
    'anthropic-ai',
    'CCBot', // Common Crawl (feeds many LLMs)
    'Bingbot', // Copilot / Bing
    'Amazonbot',
  ];

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow,
      },
      ...aiUserAgents.map((userAgent) => ({
        userAgent,
        allow: '/',
        disallow,
      })),
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
