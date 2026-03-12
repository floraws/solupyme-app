import React, { useState, useEffect, useRef } from "react";
import { ChevronDownIcon, XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export interface SearchableOption {
  value: string;
  label: string;
  description?: string;
  category?: string;
}

export interface SearchableSelectProps {
  label: string;
  options: SearchableOption[];
  value?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  loadingMessage?: string;
  isLoading?: boolean;
  clearable?: boolean;
  maxHeight?: string;
  showCategories?: boolean;
}

export const SearchableSelect = React.forwardRef<HTMLDivElement, SearchableSelectProps>(
  ({
    label,
    options,
    value,
    onChange,
    onBlur,
    error,
    placeholder = "Selecciona una opción",
    required = false,
    disabled = false,
    className = "",
    searchPlaceholder = "Buscar...",
    emptyMessage = "No se encontraron resultados",
    loadingMessage = "Cargando...",
    isLoading = false,
    clearable = false,
    maxHeight = "200px",
    showCategories = false
  }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const optionsRef = useRef<HTMLDivElement>(null);

    // Filtrar opciones basado en la búsqueda
    const filteredOptions = options.filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Agrupar por categorías si está habilitado
    const groupedOptions = showCategories
      ? filteredOptions.reduce((groups, option) => {
          const category = option.category || "Sin categoría";
          if (!groups[category]) {
            groups[category] = [];
          }
          groups[category].push(option);
          return groups;
        }, {} as Record<string, SearchableOption[]>)
      : { "": filteredOptions };

    // Encontrar la opción seleccionada
    const selectedOption = options.find(option => option.value === value);

    // Manejar selección de opción
    const handleSelect = React.useCallback((optionValue: string) => {
      onChange(optionValue);
      setIsOpen(false);
      setSearchTerm("");
      setHighlightedIndex(-1);
    }, [onChange]);

    // Cerrar dropdown al hacer clic fuera
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
          setSearchTerm("");
          setHighlightedIndex(-1);
          onBlur?.();
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onBlur]);

    // Manejar navegación por teclado
    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (!isOpen) return;

        switch (event.key) {
          case "ArrowDown":
            event.preventDefault();
            setHighlightedIndex(prev => 
              prev < filteredOptions.length - 1 ? prev + 1 : 0
            );
            break;
          case "ArrowUp":
            event.preventDefault();
            setHighlightedIndex(prev => 
              prev > 0 ? prev - 1 : filteredOptions.length - 1
            );
            break;
          case "Enter":
            event.preventDefault();
            if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
              handleSelect(filteredOptions[highlightedIndex].value);
            }
            break;
          case "Escape":
            setIsOpen(false);
            setSearchTerm("");
            setHighlightedIndex(-1);
            break;
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, highlightedIndex, filteredOptions, handleSelect]);

    // Auto-scroll para opción destacada
    useEffect(() => {
      if (highlightedIndex >= 0 && optionsRef.current) {
        const highlightedElement = optionsRef.current.children[highlightedIndex] as HTMLElement;
        if (highlightedElement) {
          highlightedElement.scrollIntoView({
            block: "nearest",
            behavior: "smooth"
          });
        }
      }
    }, [highlightedIndex]);

    const handleClear = (event: React.MouseEvent) => {
      event.stopPropagation();
      onChange("");
      setSearchTerm("");
    };

    const handleToggle = () => {
      if (disabled) return;
      
      setIsOpen(!isOpen);
      if (!isOpen) {
        setTimeout(() => inputRef.current?.focus(), 0);
      }
    };

    const baseClasses = `
      relative w-full bg-white border rounded-lg shadow-sm cursor-pointer
      transition-all duration-200 ease-in-out
      ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'hover:border-gray-400'}
      ${error ? 'border-red-300 focus-within:ring-red-500 focus-within:border-red-500' : 'border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500'}
      ${isOpen ? 'ring-2 ring-blue-500 border-blue-500' : ''}
    `;

    return (
      <div className={className} ref={ref}>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        <div className={baseClasses} ref={containerRef}>
          {/* Main Input Area */}
          <div
            className="flex items-center justify-between px-3 py-3 min-h-[2.75rem]"
            onClick={handleToggle}
          >
            <div className="flex-1 flex items-center">
              {selectedOption ? (
                <div className="flex-1">
                  <div className="text-sm text-gray-900">{selectedOption.label}</div>
                  {selectedOption.description && (
                    <div className="text-xs text-gray-500 truncate">{selectedOption.description}</div>
                  )}
                </div>
              ) : (
                <span className="text-gray-400 text-sm">{placeholder}</span>
              )}
            </div>
            
            <div className="flex items-center space-x-1">
              {clearable && selectedOption && !disabled && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <XMarkIcon className="h-4 w-4 text-gray-400" />
                </button>
              )}
              <ChevronDownIcon 
                className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                }`} 
              />
            </div>
          </div>

          {/* Dropdown */}
          {isOpen && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
              {/* Search Input */}
              <div className="p-3 border-b border-gray-200">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    ref={inputRef}
                    type="text"
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setHighlightedIndex(-1);
                    }}
                  />
                </div>
              </div>

              {/* Options List */}
              <div 
                className="overflow-y-auto"
                style={{ maxHeight }}
                ref={optionsRef}
              >
                {isLoading ? (
                  <div className="px-3 py-4 text-center text-sm text-gray-500">
                    {loadingMessage}
                  </div>
                ) : filteredOptions.length === 0 ? (
                  <div className="px-3 py-4 text-center text-sm text-gray-500">
                    {emptyMessage}
                  </div>
                ) : (
                  Object.entries(groupedOptions).map(([category, categoryOptions]) => (
                    <div key={category}>
                      {showCategories && category && (
                        <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 border-b border-gray-200">
                          {category}
                        </div>
                      )}
                      {categoryOptions.map((option) => {
                        const globalIndex = filteredOptions.findIndex(opt => opt.value === option.value);
                        const isHighlighted = globalIndex === highlightedIndex;
                        const isSelected = option.value === value;
                        
                        return (
                          <div
                            key={option.value}
                            className={`
                              px-3 py-3 cursor-pointer transition-colors duration-150
                              ${isHighlighted ? 'bg-blue-50 text-blue-900' : ''}
                              ${isSelected ? 'bg-blue-100 text-blue-900 font-medium' : 'text-gray-900'}
                              hover:bg-gray-50
                            `}
                            onClick={() => handleSelect(option.value)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="text-sm">{option.label}</div>
                                {option.description && (
                                  <div className="text-xs text-gray-500 mt-1">{option.description}</div>
                                )}
                              </div>
                              {isSelected && (
                                <div className="ml-2">
                                  <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  }
);

SearchableSelect.displayName = "SearchableSelect";
