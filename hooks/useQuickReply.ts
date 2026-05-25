import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Snippet, Category } from '../lib/types';
import { INITIAL_SNIPPETS, INITIAL_CATEGORIES } from '../lib/constants';

export function useQuickReply() {
  const [snippets, setSnippets] = useState<Snippet[]>(INITIAL_SNIPPETS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['All']);
  const [searchQuery, setSearchQuery] = useState('');
  
  // UI states
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDark = document.documentElement.classList.contains('dark');
      if (isDark) {
        queueMicrotask(() => {
          setTheme('dark');
        });
      }
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };
  const [showSplash, setShowSplash] = useState(true);
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());
  const [copiedSnippetId, setCopiedSnippetId] = useState<number | null>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  
  // Bottom Sheet States
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState<Snippet | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('General');
  const [formBody, setFormBody] = useState('');
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [isAboutGoalsOpen, setIsAboutGoalsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sorting and Variable Modal States
  const [sortBy, setSortBy] = useState<'recent' | 'usage'>('recent');
  const [isVariableModalOpen, setIsVariableModalOpen] = useState(false);
  const [activeVariableSnippet, setActiveVariableSnippet] = useState<Snippet | null>(null);
  const [variableKeys, setVariableKeys] = useState<string[]>([]);
  
  // Category Manager State
  const [editCategoryName, setEditCategoryName] = useState('');
  const [editCategoryEmoji, setEditCategoryEmoji] = useState('🏷️');
  
  // Toast Notification State
  const [toast, setToast] = useState({ visible: false, message: '' });
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Trigger Toast feedback
  const triggerToast = (message: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast({ visible: true, message });
    toastTimeoutRef.current = setTimeout(() => {
      setToast({ visible: false, message: '' });
    }, 2500);
  };

  // Load from local storage and handle Share Links on mount
  useEffect(() => {
    let loadedFromLink = false;
    let newCats = INITIAL_CATEGORIES;
    let newSnips = INITIAL_SNIPPETS;

    // Check for share link
    const urlParams = new URLSearchParams(window.location.search);
    const dataParam = urlParams.get('data');

    if (dataParam) {
      try {
        const decoded = decodeURIComponent(escape(atob(dataParam)));
        const parsed = JSON.parse(decoded);
        
        if (parsed.snippets || parsed.categories) {
          const savedSnippets = localStorage.getItem('quickreply_snippets');
          const savedCategories = localStorage.getItem('quickreply_categories');
          let localSnips = savedSnippets ? JSON.parse(savedSnippets) : INITIAL_SNIPPETS;
          let localCats = savedCategories ? JSON.parse(savedCategories) : INITIAL_CATEGORIES;
          
          if (Array.isArray(parsed.categories)) {
            parsed.categories.forEach((ic: any) => {
              if (ic && ic.name && !localCats.some((c: any) => c.name === ic.name)) {
                localCats.push({ name: ic.name, emoji: ic.emoji || '🏷️' });
              }
            });
          }
          if (Array.isArray(parsed.snippets)) {
            parsed.snippets.forEach((is: any) => {
              if (is && is.title && is.body) {
                const newSnippet = {
                  id: Date.now() + Math.random(),
                  title: is.title,
                  body: is.body,
                  category: is.category || 'General'
                };
                if (!localCats.some((c: any) => c.name === newSnippet.category)) {
                  localCats.push({ name: newSnippet.category, emoji: '🏷️' });
                }
                localSnips.push(newSnippet);
              }
            });
          }
          
          newCats = localCats;
          newSnips = localSnips;
          loadedFromLink = true;
          
          window.history.replaceState({}, document.title, window.location.pathname);
          setTimeout(() => triggerToast('Data imported seamlessly!'), 1000);
        }
      } catch(e) {
        console.error("Failed to parse link data");
      }
    }

    if (!loadedFromLink) {
      const savedSnippets = localStorage.getItem('quickreply_snippets');
      const savedCategories = localStorage.getItem('quickreply_categories');
      if (savedSnippets) {
        try { newSnips = JSON.parse(savedSnippets); } catch(e) {}
      }
      if (savedCategories) {
        try { newCats = JSON.parse(savedCategories); } catch(e) {}
      }
    }

    queueMicrotask(() => {
      setSnippets(newSnips);
      setCategories(newCats);
      setIsDataLoaded(true);

      const sharedTitle = urlParams.get('title');
      const sharedText = urlParams.get('text');
      const sharedUrl = urlParams.get('url');

      if (sharedTitle || sharedText || sharedUrl) {
        const combinedBody = [sharedText, sharedUrl].filter(Boolean).join('\n');
        setFormTitle(sharedTitle || 'Shared Snippet');
        setFormCategory('General');
        setFormBody(combinedBody);
        setIsBottomSheetOpen(true);
        window.history.replaceState({}, document.title, window.location.pathname);
        setTimeout(() => triggerToast('Shared snippet loaded!'), 1000);
      }
    });
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (!isDataLoaded) return;
    localStorage.setItem('quickreply_snippets', JSON.stringify(snippets));
  }, [snippets, isDataLoaded]);

  useEffect(() => {
    if (!isDataLoaded) return;
    localStorage.setItem('quickreply_categories', JSON.stringify(categories));
  }, [categories, isDataLoaded]);

  // Set mounted state and manage splash timeout
  useEffect(() => {
    queueMicrotask(() => {
      setMounted(true);
    });
    
    // Splash screen timer
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 2200);

    return () => {
      clearTimeout(splashTimer);
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  // Filter and sort snippets based on Category + Search Term + Sort Criteria
  const filteredSnippets = useMemo(() => {
    const filtered = snippets.filter((snippet) => {
      const matchesCategory = selectedCategories.includes('All') || selectedCategories.includes(snippet.category);
      const matchesSearch = 
        snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        snippet.body.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (sortBy === 'usage') {
      return [...filtered].sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0));
    }
    return filtered;
  }, [snippets, selectedCategories, searchQuery, sortBy]);

  // Compute item counts for the category tabs
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: snippets.length };
    categories.forEach(cat => {
      counts[cat.name] = snippets.filter(s => s.category === cat.name).length;
    });
    return counts;
  }, [snippets, categories]);

  const handleExport = () => {
    const dataStr = JSON.stringify({ snippets, categories }, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'quickreply-backup.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    triggerToast('Backup exported successfully');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        
        let newCats = [...categories];
        if (Array.isArray(data.categories)) {
          data.categories.forEach((ic: any) => {
            if (ic && ic.name && !newCats.some(c => c.name === ic.name)) {
              newCats.push({ name: ic.name, emoji: ic.emoji || '🏷️' });
            }
          });
        }

        let newSnips = [...snippets];
        if (Array.isArray(data.snippets)) {
          data.snippets.forEach((is: any) => {
            if (is && is.title && is.body) {
              const newSnippet = {
                id: Date.now() + Math.random(),
                title: is.title,
                body: is.body,
                category: is.category || 'General'
              };
              if (!newCats.some(c => c.name === newSnippet.category)) {
                newCats.push({ name: newSnippet.category, emoji: '🏷️' });
              }
              newSnips.push(newSnippet);
            }
          });
        }

        setCategories(newCats);
        setSnippets(newSnips);
        triggerToast('Data imported successfully');
        setIsSettingsOpen(false);
      } catch (err) {
        triggerToast('Invalid backup file');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleShareLink = () => {
    try {
      const dataStr = JSON.stringify({ snippets, categories });
      const encoded = btoa(unescape(encodeURIComponent(dataStr)));
      const url = `${window.location.origin}${window.location.pathname}?data=${encoded}`;
      navigator.clipboard.writeText(url);
      triggerToast('Share link copied to clipboard!');
    } catch(err) {
      triggerToast('Failed to generate link');
    }
  };

  const handleShareSnippet = (e: React.MouseEvent, snippet: Snippet) => {
    e.stopPropagation();
    try {
      const cat = categories.find(c => c.name === snippet.category) || { name: snippet.category, emoji: '🏷️' };
      const dataStr = JSON.stringify({ snippets: [snippet], categories: [cat] });
      const encoded = btoa(unescape(encodeURIComponent(dataStr)));
      const url = `${window.location.origin}${window.location.pathname}?data=${encoded}`;
      navigator.clipboard.writeText(url);
      triggerToast('Snippet link copied!');
    } catch(err) {
      triggerToast('Failed to generate link');
    }
  };

  // Expand or collapse card text body
  const toggleCardExpansion = (id: number) => {
    const next = new Set(expandedCards);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setExpandedCards(next);
  };

  // Copy to clipboard with success state & placeholder check
  const handleCopyText = async (e: React.MouseEvent, id: number, text: string) => {
    e.stopPropagation();

    // Check for variables/placeholders matching {variable}
    const matches = [...text.matchAll(/\{([^}]+)\}/g)].map(m => m[1]);
    if (matches.length > 0) {
      const uniqueKeys = Array.from(new Set(matches));
      const snip = snippets.find(s => s.id === id) || { id, title: '', body: text, category: '' };
      setActiveVariableSnippet(snip);
      setVariableKeys(uniqueKeys);
      setIsVariableModalOpen(true);
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedSnippetId(id);
      triggerToast('Copied to clipboard!');
      
      // Increment usage statistics
      setSnippets(prev => prev.map(s => s.id === id ? { ...s, usageCount: (s.usageCount || 0) + 1 } : s));

      // Reset card visual state
      setTimeout(() => {
        setCopiedSnippetId(null);
      }, 1500);
    } catch (err) {
      triggerToast('Failed to copy text.');
    }
  };

  // Copy variable filled template to clipboard
  const handleCopyVariableFilled = async (filledText: string, id: number) => {
    try {
      await navigator.clipboard.writeText(filledText);
      setCopiedSnippetId(id);
      triggerToast('Copied filled text!');

      // Increment usage statistics
      setSnippets(prev => prev.map(s => s.id === id ? { ...s, usageCount: (s.usageCount || 0) + 1 } : s));

      setIsVariableModalOpen(false);
      setActiveVariableSnippet(null);
      setVariableKeys([]);

      setTimeout(() => {
        setCopiedSnippetId(null);
      }, 1500);
    } catch (err) {
      triggerToast('Failed to copy filled text.');
    }
  };

  // Open bottom sheet for fresh layout
  const handleOpenAdd = (defaultTitle?: any) => {
    setEditingSnippet(null);
    setFormTitle(typeof defaultTitle === 'string' ? defaultTitle : '');
    setFormCategory('General');
    setFormBody('');
    setIsBottomSheetOpen(true);
  };

  // Open bottom sheet populated with existing details
  const handleOpenEdit = (e: React.MouseEvent, snippet: Snippet) => {
    e.stopPropagation();
    setEditingSnippet(snippet);
    setFormTitle(snippet.title);
    setFormCategory(snippet.category);
    setFormBody(snippet.body);
    setIsBottomSheetOpen(true);
  };

  // Handle Form Submission
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formBody.trim()) return;

    if (editingSnippet) {
      // Edit logic
      setSnippets(prev => prev.map(s => s.id === editingSnippet.id ? {
        ...s,
        title: formTitle.trim(),
        category: formCategory,
        body: formBody.trim()
      } : s));
      triggerToast('Snippet updated successfully');
    } else {
      // Add logic
      const newSnippet: Snippet = {
        id: Date.now(),
        title: formTitle.trim(),
        category: formCategory,
        body: formBody.trim()
      };
      setSnippets(prev => [newSnippet, ...prev]);
      triggerToast('New snippet saved');
    }
    setIsBottomSheetOpen(false);
  };

  // Delete Action
  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setSnippets(prev => prev.filter(s => s.id !== id));
    triggerToast('Snippet deleted');
  };

  const getCategoryEmoji = (categoryName: string) => {
    const cat = categories.find(c => c.name === categoryName);
    return cat ? cat.emoji : '🏷️';
  };

  const handleAddCategory = (name: string, emoji: string) => {
    const trimmedName = name.trim();
    if (trimmedName && !categories.some(c => c.name === trimmedName)) {
      setCategories(prev => [...prev, { name: trimmedName, emoji: emoji || '🏷️' }]);
      triggerToast('Category added');
      return true;
    }
    return false;
  };

  const handleToggleCategory = (categoryName: string) => {
    if (categoryName === 'All') {
      setSelectedCategories(['All']);
    } else {
      setSelectedCategories(prev => {
        const next = prev.filter(c => c !== 'All');
        if (next.includes(categoryName)) {
          const filtered = next.filter(c => c !== categoryName);
          return filtered.length === 0 ? ['All'] : filtered;
        } else {
          return [...next, categoryName];
        }
      });
    }
  };

  const handleDeleteCategory = (name: string) => {
    setCategories(prev => prev.filter(c => c.name !== name));
    triggerToast('Category deleted');
    setSelectedCategories(prev => {
      const next = prev.filter(c => c !== name);
      return next.length === 0 ? ['All'] : next;
    });
  };
  const handleReorderCategories = (newCategories: Category[]) => {
    setCategories(newCategories);
  };
  return {
    snippets,
    categories,
    selectedCategories,
    toggleCategory: handleToggleCategory,
    searchQuery,
    setSearchQuery,
    mounted,
    showSplash,
    expandedCards,
    copiedSnippetId,
    isBottomSheetOpen,
    setIsBottomSheetOpen,
    editingSnippet,
    formTitle,
    setFormTitle,
    formCategory,
    setFormCategory,
    formBody,
    setFormBody,
    isSettingsOpen,
    setIsSettingsOpen,
    isCategoryManagerOpen,
    setIsCategoryManagerOpen,
    isAboutGoalsOpen,
    setIsAboutGoalsOpen,
    editCategoryName,
    setEditCategoryName,
    editCategoryEmoji,
    setEditCategoryEmoji,
    toast,
    fileInputRef,
    filteredSnippets,
    categoryCounts,
    handleExport,
    handleImport,
    handleShareLink,
    handleShareSnippet,
    toggleCardExpansion,
    handleCopyText,
    handleOpenAdd,
    handleOpenEdit,
    handleSave,
    handleDelete,
    getCategoryEmoji,
    handleAddCategory,
    handleDeleteCategory,
    handleReorderCategories,
    sortBy,
    setSortBy,
    isVariableModalOpen,
    setIsVariableModalOpen,
    activeVariableSnippet,
    variableKeys,
    handleCopyVariableFilled,
    theme,
    toggleTheme
  };
}
