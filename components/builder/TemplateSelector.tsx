'use client';

import React from 'react';
import { TemplateType } from '@/lib/types/menu';
import { templateInfo } from '@/lib/templates';

interface TemplateSelectorProps {
  selectedTemplate: TemplateType;
  onSelect: (template: TemplateType) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onSelect,
}) => {
  const templates: TemplateType[] = ['classic', 'modern', 'minimal'];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Template</h3>
        <p className="text-gray-600">Select a design that matches your restaurant's style</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {templates.map((template) => {
          const info = templateInfo[template];
          const isSelected = selectedTemplate === template;

          return (
            <button
              key={template}
              onClick={() => onSelect(template)}
              className={`group relative p-6 rounded-xl border-2 transition-all text-left hover-lift ${
                isSelected
                  ? 'border-gray-900 bg-gray-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-gray-400 shadow-sm'
              }`}
            >
              {/* Selected Badge */}
              {isSelected && (
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}

              {/* Template Name & Tag */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className={`text-xl font-bold mb-1 transition-colors ${
                    isSelected ? 'text-gray-900' : 'text-gray-900 group-hover:text-gray-700'
                  }`}>
                    {info.name}
                  </h4>
                  <span className={`inline-block text-xs font-medium px-3 py-1 rounded-full border ${
                    isSelected
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-gray-100 text-gray-700 border-gray-300'
                  }`}>
                    {template}
                  </span>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-3 leading-relaxed">{info.description}</p>
              <p className="text-xs text-gray-500 mb-5">{info.preview}</p>

              {/* Visual Preview */}
              <div className={`rounded-xl p-4 transition-all ${
                isSelected ? 'bg-white' : 'bg-gray-50'
              }`}>
                {template === 'classic' && (
                  <div className="space-y-2.5">
                    <div className="h-2 bg-[#292524] w-3/4 mx-auto rounded"></div>
                    <div className="h-1 bg-[#57534e] w-1/2 mx-auto rounded"></div>
                    <div className="h-px bg-[#e7e5e4] w-full my-3"></div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="h-1.5 bg-gray-900 w-1/3 rounded"></div>
                        <div className="h-1.5 bg-gray-600 w-1/6 rounded"></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="h-1.5 bg-gray-900 w-2/5 rounded"></div>
                        <div className="h-1.5 bg-gray-600 w-1/6 rounded"></div>
                      </div>
                    </div>
                  </div>
                )}
                {template === 'modern' && (
                  <div className="bg-black rounded-lg p-3">
                    <div className="h-2 bg-emerald-400 w-2/3 rounded mb-3"></div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="h-10 bg-zinc-800 rounded"></div>
                      <div className="h-10 bg-zinc-800 rounded"></div>
                    </div>
                  </div>
                )}
                {template === 'minimal' && (
                  <div className="space-y-2">
                    <div className="h-1.5 bg-black w-1/2 rounded"></div>
                    <div className="space-y-2.5 pt-2">
                      <div className="flex justify-between items-center pb-2.5 border-b border-[#e7e5e4]">
                        <div className="h-1 bg-[#78716c] w-1/3 rounded"></div>
                        <div className="h-1 bg-[#78716c] w-1/6 rounded"></div>
                      </div>
                      <div className="flex justify-between items-center pb-2.5 border-b border-[#e7e5e4]">
                        <div className="h-1 bg-[#78716c] w-2/5 rounded"></div>
                        <div className="h-1 bg-[#78716c] w-1/6 rounded"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Select Button */}
              <div className="mt-5">
                {isSelected ? (
                  <div className="text-center text-sm font-medium text-gray-900 py-2">
                    Currently Selected
                  </div>
                ) : (
                  <div className="text-center text-sm font-medium text-gray-600 group-hover:text-gray-900 py-2 transition-colors">
                    Click to Select
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-lg bg-gray-900 flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Tip: Try them all!</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              You can switch between templates anytime. Click the Preview tab to see how your menu looks with each design.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
