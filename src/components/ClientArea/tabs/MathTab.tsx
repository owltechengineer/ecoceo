"use client";

import React, { useState, useEffect } from 'react';
import { client } from '@/sanity/lib/client';

interface MathTool {
  _id: string;
  title: string;
  description: string;
  toolType: 'calculator' | 'formula' | 'converter' | 'graph';
  content: any;
  categories: string[];
  tags: string[];
  isActive: boolean;
  order: number;
  _createdAt: string;
}

const MathTab: React.FC = () => {
  const [mathTools, setMathTools] = useState<MathTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const fetchMathTools = async () => {
      try {
        setLoading(true);
        const query = `
          *[_type == "clientMath" && isActive == true] | order(order asc, _createdAt desc) {
            _id,
            title,
            description,
            toolType,
            content,
            categories,
            tags,
            isActive,
            order,
            _createdAt
          }
        `;
        
        const tools = await client.fetch(query);
        setMathTools(tools);
      } catch (error) {
        console.error('Errore nel caricamento degli strumenti matematici:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMathTools();
  }, []);

  const categories = ['all', ...Array.from(new Set(mathTools.flatMap(tool => tool.categories)))];

  const filteredTools = selectedCategory === 'all' 
    ? mathTools 
    : mathTools.filter(tool => tool.categories.includes(selectedCategory));

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
            }`}
          >
            {category === 'all' ? 'Tutti' : category}
          </button>
        ))}
      </div>

      {/* Math Tools Grid */}
      {filteredTools.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🤖</div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Nessuno strumento matematico disponibile
          </h3>
          <p className="text-gray-300">
            Gli strumenti matematici e di robotica saranno disponibili a breve.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <div
              key={tool._id}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl border border-gray-600/50 p-6 hover:shadow-2xl transition-shadow duration-200"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 bg-blue-600/20 rounded-lg mr-4">
                  <span className="text-2xl">
                    {tool.toolType === 'calculator' && '🧮'}
                    {tool.toolType === 'formula' && '📐'}
                    {tool.toolType === 'converter' && '🔄'}
                    {tool.toolType === 'graph' && '📊'}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{tool.title}</h3>
                  <p className="text-sm text-gray-400 capitalize">{tool.toolType}</p>
                </div>
              </div>
              
              <p className="text-gray-300 mb-4">{tool.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {tool.categories.map((category) => (
                  <span
                    key={category}
                    className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full"
                  >
                    {category}
                  </span>
                ))}
              </div>
              
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                Apri Strumento
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Coming Soon Section */}
      <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl p-6 border border-purple-500/30">
        <div className="flex items-center mb-4">
          <div className="p-3 bg-purple-600/20 rounded-lg mr-4">
            <span className="text-2xl">🚀</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Strumenti in Arrivo</h3>
            <p className="text-gray-300">Nuovi strumenti matematici e di robotica saranno aggiunti presto</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-gray-600/50">
            <div className="text-2xl mb-2">📊</div>
            <p className="text-sm font-medium text-gray-300">Grafici</p>
          </div>
          <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-gray-600/50">
            <div className="text-2xl mb-2">🧮</div>
            <p className="text-sm font-medium text-gray-300">Calcolatori</p>
          </div>
          <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-gray-600/50">
            <div className="text-2xl mb-2">🤖</div>
            <p className="text-sm font-medium text-gray-300">Robotica</p>
          </div>
          <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-gray-600/50">
            <div className="text-2xl mb-2">🔄</div>
            <p className="text-sm font-medium text-gray-300">Convertitori</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MathTab;
