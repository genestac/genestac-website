import { MetadataRoute } from 'next'
import { supabase } from "@/lib/supabase"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.genestac.com'
  
  // Fetch dynamic blog routes
  const { data: blogs } = await supabase
    .from('blogs')
    .select('slug, published_at, created_at')
    .eq('status', 'published')
    
  const blogUrls = (blogs || []).map((blog) => ({
    url: `${baseUrl}/blogs/${blog.slug}`,
    lastModified: new Date(blog.published_at || blog.created_at || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const staticRoutes = [
    '',
    '/about-us',
    '/blogs',
    '/chronic-pain-treatment',
    '/contact-us',
    '/delete-account',
    '/faq',
    '/hair-treatment',
    '/joint-sports-injury-treatment',
    '/musculoskeletal-pain-treatment',
    '/news-insights',
    '/pain-management-new',
    '/precision-regenerative-care',
    '/pricing',
    '/privacy-policy',
    '/quick-enquiry',
    '/spine-nerve-disorder-treatment',
    '/start-journey',
    '/success-stories',
    '/terms-conditions',
    '/transformations',
    '/weightloss',
    '/services/advanced-gene-therapy',
    '/services/bone-marrow-therapy',
    '/services/cd138-plasma-cell-therapy',
    '/services/cd19-cell-therapy',
    '/services/cd34-stem-cell-enrichment',
    '/services/cd45ra-stem-cell-therapy',
    '/services/cd56-cell-enrichment',
    '/services/gcmaf-immune-therapy',
    '/services/muse-cell-therapy',
    '/services/natural-killer-cell-therapy',
    '/services/pbse-therapy',
    '/services/pbse-volume-reduction-treatment',
    '/services/prp-therapy',
    '/services/tcr-therapy'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Fetch dynamic product routes
  const { data: products } = await supabase
    .from('inventory')
    .select('slug, id, updated_at')
    .not('slug', 'is', null)

  const productUrls = (products || []).map((product) => ({
    url: `${baseUrl}/products/${product.slug || product.id}`,
    lastModified: new Date(product.updated_at || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...staticRoutes, ...blogUrls, ...productUrls]
}
