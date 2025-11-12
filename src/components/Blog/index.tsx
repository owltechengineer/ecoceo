"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faArrowRight, faNewspaper, faSearch, faUser, faImage as faImageIcon, faArrowLeft, faArrowCircleRight, faPlus, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { safeFetch } from '@/sanity/lib/client';
import { postsQuery } from '@/sanity/lib/queries';
import { getImageUrl, getTextValue } from '@/sanity/lib/image';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Blog = ({ homepage = false }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  // Hooks per la versione completa del blog (sempre dichiarati, anche se usati solo quando homepage = false)
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsData = await safeFetch(postsQuery);
        setPosts(postsData);
      } catch (error) {
        console.error('Error fetching posts data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Per homepage: mostra solo gli ultimi 3 articoli
  const displayedPosts = homepage ? posts.slice(0, 3) : posts;

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-lg text-gray-600">Caricamento articoli...</p>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <FontAwesomeIcon icon={faNewspaper} className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Nessun articolo disponibile</h3>
          <p className="text-gray-600 mb-8">Crea i tuoi primi articoli in Sanity Studio per iniziare.</p>
          <button 
            onClick={() => window.location.href = '/studio'}
            className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            <FontAwesomeIcon icon={faPlus} className="w-5 h-5 mr-2" />
            Vai a Sanity Studio
          </button>
        </div>
      </div>
    );
  }

  // Versione homepage: card simili ai servizi
  if (homepage) {
    return (
      <>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
          {displayedPosts.map((post, index) => (
            <Link
              key={post._id || index}
              href={`/blog/${post.slug?.current || post._id}`}
              className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white/40 via-white/30 to-white/20 backdrop-blur-xl shadow-2xl duration-500 hover:shadow-2xl hover:shadow-primary/40 hover:scale-[1.03] hover:-translate-y-2 transition-all h-full flex flex-col border border-white/20 hover:border-primary/40 before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/0 before:via-primary/0 before:to-primary/0 hover:before:from-primary/10 hover:before:via-primary/5 hover:before:to-primary/10 before:transition-all before:duration-500 before:pointer-events-none"
            >
              {/* Post Image Header */}
              <div className="relative h-56 overflow-hidden">
                {post.mainImage ? (
                  <Image
                    src={getImageUrl(post.mainImage)}
                    alt={getTextValue(post.title)}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    priority={index < 3}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 via-primary/10 to-transparent flex items-center justify-center">
                  </div>
                )}
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500"></div>
                
                {/* Category Badge */}
                {post.categories && post.categories.length > 0 && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-primary text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm">
                      {post.categories[0]}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-8 flex-grow flex flex-col">
                {/* Post Title */}
                <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors duration-300 mb-4 leading-tight">
                  {getTextValue(post.title)}
                </h3>
                
                {/* Post Date */}
                {post.publishedAt && (
                  <div className="flex items-center text-sm text-white/70 mb-4">
                    <FontAwesomeIcon icon={faCalendarAlt} className="w-4 h-4 mr-2 text-black" />
                    <span>
                      {new Date(post.publishedAt).toLocaleDateString('it-IT', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                )}

                {/* Excerpt */}
                <p className="mb-6 text-base text-white/90 leading-relaxed flex-grow line-clamp-3">
                  {getTextValue(post.body?.[0]?.children?.[0]?.text)?.substring(0, 150) || 
                   'Nessun contenuto disponibile'}...
                </p>

                {/* Read More Link */}
                <div className="mt-auto pt-6 border-t border-white/20">
                  <div className="inline-flex items-center text-white font-semibold text-sm group-hover:gap-3 transition-all duration-300">
                    <span>Leggi l'articolo</span>
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform"
                    />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Scopri Blog Button */}
        <div className="text-center mt-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-primary via-primary/90 to-primary text-white py-4 px-8 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105 transform"
          >
            <FontAwesomeIcon icon={faNewspaper} className="w-6 h-6" />
            <span>Scopri Blog</span>
            <FontAwesomeIcon icon={faArrowRight} className="w-6 h-6" />
          </Link>
        </div>
      </>
    );
  }

  // Versione pagina blog completa (con ricerca, filtri, paginazione)
  const postsPerPage = 9;

  // Filter posts based on search and category
  const filteredPosts = posts.filter(post => {
    const matchesSearch = getTextValue(post.title).toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getTextValue(post.body?.[0]?.children?.[0]?.text || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.categories?.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(posts.flatMap(post => post.categories || [])))];

  return (
    <div className="space-y-12">
      {/* Search and Filter Section */}
      <div className="bg-white/30 backdrop-blur/30 backdrop-blurrounded-2xl shadow-lg p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faSearch} className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Cerca articoli..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'Tutti' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-gray-600">
            {filteredPosts.length === 1 
              ? '1 articolo trovato' 
              : `${filteredPosts.length} articoli trovati`
            }
          </p>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentPosts.map((post, index) => (
          <article
            key={post._id || index}
            className="group bg-white/30 backdrop-blur/30 backdrop-blurrounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
          >
            {/* Image */}
            <Link href={`/blog/${post.slug?.current || post._id}`}>
              <div className="relative aspect-[16/10] overflow-hidden">
                {post.mainImage ? (
                  <img
                    src={getImageUrl(post.mainImage)}
                    alt={getTextValue(post.title)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <FontAwesomeIcon icon={faImageIcon} className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                
                {/* Category Badge */}
                {post.categories && post.categories.length > 0 && (
                  <div className="absolute top-4 left-4">
                    <span className="inline-block bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {post.categories[0]}
                    </span>
                  </div>
                )}
              </div>
            </Link>

            {/* Content */}
            <div className="p-6">
              {/* Meta */}
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faUser} className="w-4 h-4 mr-1" />
                  <span>Admin</span>
                </div>
                <span className="mx-2">•</span>
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faCalendarAlt} className="w-4 h-4 mr-1" />
                  <span>
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
              </div>

              {/* Title */}
              <Link href={`/blog/${post.slug?.current || post._id}`}>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {getTextValue(post.title)}
                </h3>
              </Link>

              {/* Excerpt */}
              <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                {getTextValue(post.body?.[0]?.children?.[0]?.text)?.substring(0, 120) || 
                 'Nessun contenuto disponibile'}...
              </p>

              {/* Read More */}
              <Link 
                href={`/blog/${post.slug?.current || post._id}`}
                className="inline-flex items-center text-primary font-semibold hover:text-primary/80 transition-colors"
              >
                Leggi di più
                <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </article>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-gray-500 bg-white/30 backdrop-blur/30 backdrop-blurborder border-gray-300 rounded-lg hover:bg-white/30disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Precedente
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 text-sm font-medium rounded-lg ${
                  currentPage === page
                    ? 'bg-primary text-white'
                    : 'text-gray-500 bg-white/30 backdrop-blur/30 backdrop-blurborder border-gray-300 hover:bg-white/30'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-500 bg-white/30 backdrop-blur/30 backdrop-blurborder border-gray-300 rounded-lg hover:bg-white/30disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Successiva
            </button>
          </nav>
        </div>
      )}

      {/* No Results */}
      {filteredPosts.length === 0 && (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <FontAwesomeIcon icon={faSearch} className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Nessun risultato trovato</h3>
            <p className="text-gray-600 mb-6">
              Prova a modificare i filtri di ricerca o a cercare qualcos'altro.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              <FontAwesomeIcon icon={faArrowCircleRight} className="w-5 h-5 mr-2" />
              Reset Filtri
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;
