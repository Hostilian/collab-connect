'use client';

import { useState } from 'react';

interface MapSearchProps {
    onSearch: (query: string) => void;
    onFilterChange: (filter: MapFilters) => void;
    currentFilters: MapFilters;
}

export interface MapFilters {
    verificationLevel?: 'verified' | 'pending' | 'unverified' | 'all';
    searchQuery: string;
}

export default function MapSearch({ onSearch, onFilterChange, currentFilters }: MapSearchProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleSearchChange = (query: string) => {
        onFilterChange({ ...currentFilters, searchQuery: query });
        onSearch(query);
    };

    const handleVerificationChange = (level: MapFilters['verificationLevel']) => {
        onFilterChange({ ...currentFilters, verificationLevel: level });
    };

    const clearFilters = () => {
        onFilterChange({ searchQuery: '', verificationLevel: 'all' });
        onSearch('');
    };

    const hasActiveFilters = currentFilters.searchQuery || currentFilters.verificationLevel !== 'all';

    return (
        <div className="pointer-events-auto absolute right-6 top-6 w-80">
            <div className="rounded-2xl bg-white shadow-xl">
                {/* Search Input */}
                <div className="p-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search by name or location..."
                            value={currentFilters.searchQuery}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-4 py-2 pr-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                        <svg
                            className="absolute right-3 top-2.5 h-5 w-5 text-slate-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>

                    {/* Filter Toggle Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="mt-3 flex w-full items-center justify-between rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                    >
                        <span className="flex items-center gap-2">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                                />
                            </svg>
                            Filters
                            {hasActiveFilters && (
                                <span className="flex h-2 w-2 rounded-full bg-indigo-600"></span>
                            )}
                        </span>
                        <svg
                            className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>

                {/* Filter Panel */}
                {isOpen && (
                    <div className="border-t border-slate-200 p-4">
                        <div className="space-y-4">
                            {/* Verification Level Filter */}
                            <div>
                                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-600">
                                    Verification Status
                                </label>
                                <div className="space-y-2">
                                    {[
                                        { value: 'all', label: 'All Users', color: 'slate' },
                                        { value: 'verified', label: 'Verified Only', color: 'emerald' },
                                        { value: 'pending', label: 'Pending', color: 'amber' },
                                        { value: 'unverified', label: 'Unverified', color: 'slate' },
                                    ].map((option) => (
                                        <label
                                            key={option.value}
                                            className="flex cursor-pointer items-center gap-2 rounded-lg p-2 transition-colors hover:bg-slate-50"
                                        >
                                            <input
                                                type="radio"
                                                name="verification"
                                                value={option.value}
                                                checked={currentFilters.verificationLevel === option.value}
                                                onChange={(e) =>
                                                    handleVerificationChange(
                                                        e.target.value as MapFilters['verificationLevel']
                                                    )
                                                }
                                                className="h-4 w-4 border-slate-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
                                            />
                                            <span className="flex items-center gap-2 text-sm">
                                                {option.value !== 'all' && (
                                                    <span
                                                        className={`h-3 w-3 rounded-full bg-${option.color}-${
                                                            option.color === 'emerald' ? '500' : '400'
                                                        }`}
                                                    ></span>
                                                )}
                                                {option.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Clear Filters Button */}
                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="w-full rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
                                >
                                    Clear All Filters
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
