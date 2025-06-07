import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  article?: {
    author?: string;
    publishedTime?: string;
    modifiedTime?: string;
    section?: string;
    tags?: string[];
  };
}

export const SEO = ({
  title = "Intellab - AI-Powered Programming Learning Platform",
  description = "Master programming and algorithms with AI assistance on Intellab. Learn through structured coding courses, solve algorithm problems, and get personalized AI guidance to accelerate your programming journey.",
  keywords = "AI programming tutor, coding courses, algorithm problems, programming practice, AI-assisted learning, software development, computer science education, coding bootcamp, programming mentor",
  image = "https://www.intellab.site/og-image.png",
  url = "https://www.intellab.site/",
  type = "website",
  article
}: SEOProps) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": type === "article" ? "Article" : "WebPage",
    name: title,
    description: description,
    url: url,
    image: image,
    ...(article && {
      author: {
        "@type": "Person",
        name: article.author
      },
      datePublished: article.publishedTime,
      dateModified: article.modifiedTime,
      articleSection: article.section,
      keywords: article.tags?.join(", ")
    })
  };

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />

      {/* Twitter */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* Structured Data */}
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>

      {/* Article specific meta tags */}
      {article && (
        <>
          <meta property="article:author" content={article.author} />
          <meta property="article:published_time" content={article.publishedTime} />
          <meta property="article:modified_time" content={article.modifiedTime} />
          <meta property="article:section" content={article.section} />
          {article.tags?.map((tag) => <meta key={tag} property="article:tag" content={tag} />)}
        </>
      )}
    </Helmet>
  );
};
