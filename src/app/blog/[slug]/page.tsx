"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { safeFetch } from '@/sanity/lib/client';
import { postBySlugQuery } from '@/sanity/lib/queries';
import { getImageUrl, getTextValue } from '@/sanity/lib/image';
import SharePost from "@/components/Blog/SharePost";
import TagButton from "@/components/Blog/TagButton";
import Breadcrumb from "@/components/Common/Breadcrumb";
import Link from 'next/link';
import { PortableText } from '@portabletext/react';

const BlogPostPage = () => {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postData = await safeFetch(postBySlugQuery, { slug });
        setPost(postData);
      } catch (error) {
        console.error('Error fetching post data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-lg text-gray-600">Caricamento articolo...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Articolo non trovato</h3>
          <p className="text-gray-600 mb-6">L'articolo che stai cercando non esiste o è stato rimosso.</p>
          <Link
            href="/blog"
            className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Torna al Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Breadcrumb Section - Sfondo standard */}
      <div>
        <Breadcrumb
          pageName={getTextValue(post.title)}
          description="Leggi l'articolo completo del nostro blog"
        />
      </div>

      {/* Blog Post Content - Sfondo standard */}
      <div>
        <section className="py-16 lg:py-20">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              {/* Article Header */}
              <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Hero Image */}
                {post.mainImage && (
                  <div className="relative aspect-[21/9] overflow-hidden">
                    <img
                      src={getImageUrl(post.mainImage)}
                      alt={getTextValue(post.title)}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    
                    {/* Category Badge */}
                    {post.categories && post.categories.length > 0 && (
                      <div className="absolute top-6 left-6">
                        <span className="inline-block bg-primary text-white text-sm font-semibold px-4 py-2 rounded-full">
                          {post.categories[0]}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Article Content */}
                <div className="p-8 lg:p-12">
                  {/* Title */}
                  <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                    {getTextValue(post.title)}
                  </h1>

                  {/* Meta Information */}
                  <div className="flex flex-wrap items-center gap-6 mb-8 pb-8 border-b border-gray-200">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Admin</p>
                        <p className="text-xs text-gray-500">Autore</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm text-gray-600">
                        {post.publishedAt 
                          ? new Date(post.publishedAt).toLocaleDateString('it-IT', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                          : 'Data non disponibile'
                        }
                      </span>
                    </div>

                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm text-gray-600">5 min di lettura</span>
                    </div>
                  </div>

                  {/* Article Body */}
                  <div className="prose prose-lg max-w-none">
                    {post.body && post.body.length > 0 ? (
                      <PortableText
                        value={post.body}
                        components={{
                          block: {
                            h1: ({children}) => <h1 className="text-3xl font-bold text-gray-900 mb-6 mt-8">{children}</h1>,
                            h2: ({children}) => <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">{children}</h2>,
                            h3: ({children}) => <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6">{children}</h3>,
                            h4: ({children}) => <h4 className="text-lg font-bold text-gray-900 mb-2 mt-4">{children}</h4>,
                            normal: ({children}) => <p className="text-gray-700 leading-relaxed mb-6">{children}</p>,
                          },
                          list: {
                            bullet: ({children}) => <ul className="list-disc list-inside mb-6 space-y-2 text-gray-700">{children}</ul>,
                            number: ({children}) => <ol className="list-decimal list-inside mb-6 space-y-2 text-gray-700">{children}</ol>,
                          },
                          listItem: ({children}) => <li className="text-gray-700">{children}</li>,
                        }}
                      />
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">Contenuto non disponibile</p>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {post.categories && post.categories.length > 0 && (
                    <div className="mt-12 pt-8 border-t border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Tag:</h4>
                      <div className="flex flex-wrap gap-2">
                        {post.categories.map((category, index) => (
                          <TagButton key={index} text={category} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Share Section */}
                  <div className="mt-12 pt-8 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <h5 className="text-lg font-semibold text-gray-900 mb-2">
                          Condividi questo articolo:
                        </h5>
                        <p className="text-sm text-gray-600">
                          Aiuta altri a scoprire questo contenuto interessante
                        </p>
                      </div>
                      <SharePost />
                    </div>
                  </div>
                </div>
              </article>

              {/* Back to Blog Button */}
              <div className="text-center mt-12">
                <Link
                  href="/blog"
                  className="inline-flex items-center bg-gray-100 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Torna al Blog
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default BlogPostPage;
