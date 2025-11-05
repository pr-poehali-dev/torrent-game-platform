import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

interface FilterSectionProps {
  categories: any[];
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  steamDeckOnly: boolean;
  setSteamDeckOnly: (value: boolean) => void;
  getCategoryIcon: (category: string) => string;
  onApplyFilters?: () => void;
  allTorrents?: any[];
}

const FilterSection = ({ 
  categories, 
  selectedCategories, 
  setSelectedCategories, 
  steamDeckOnly, 
  setSteamDeckOnly, 
  getCategoryIcon,
  onApplyFilters,
  allTorrents = []
}: FilterSectionProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const toggleCategory = (slug: string) => {
    if (selectedCategories.includes(slug)) {
      setSelectedCategories(selectedCategories.filter(c => c !== slug));
    } else {
      setSelectedCategories([...selectedCategories, slug]);
    }
  };

  const clearFilters = () => {
    setSelectedCategories([]);
  };

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const filtered = allTorrents.filter(torrent => 
        torrent.title.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);
      setSearchResults(filtered);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchQuery, allTorrents]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowResults(false);
    }
  };

  const handleResultClick = (torrentId: string) => {
    navigate(`/torrent/${torrentId}`);
    setShowResults(false);
    setSearchQuery("");
  };

  return (
    <>
    <Card className="mb-8 border-border animate-fade-in">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Icon name="Filter" className="text-primary" size={20} />
            <h3 className="text-lg font-semibold">Фильтры</h3>
          </div>
          {(selectedCategories.length > 0 || steamDeckOnly) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                clearFilters();
                setSteamDeckOnly(false);
              }}
            >
              <Icon name="X" size={14} className="mr-1" />
              Сбросить
            </Button>
          )}
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Категории</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Button
                  key={cat.slug}
                  variant={selectedCategories.includes(cat.slug) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleCategory(cat.slug)}
                >
                  <Icon name={getCategoryIcon(cat.slug)} size={14} className="mr-1" />
                  {cat.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Checkbox 
              id="steamDeck" 
              checked={steamDeckOnly}
              onCheckedChange={(checked) => setSteamDeckOnly(checked as boolean)}
            />
            <label 
              htmlFor="steamDeck" 
              className="text-sm font-medium cursor-pointer flex items-center gap-2"
            >
              <Icon name="Gamepad2" size={16} className="text-green-500" />
              Поддержка Steam Deck
            </label>
          </div>

          {(selectedCategories.length > 0 || steamDeckOnly) && onApplyFilters && (
            <div className="pt-4">
              <Button 
                onClick={onApplyFilters} 
                className="w-full"
                size="lg"
              >
                <Icon name="Search" size={18} className="mr-2" />
                Показать результаты
              </Button>
            </div>
          )}

          <div className="relative pt-4" ref={searchRef}>
            <div className="flex items-center gap-3 mb-2">
              <Icon name="Search" className="text-primary" size={20} />
              <h3 className="text-lg font-semibold">Поиск</h3>
            </div>
            
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Введите название игры..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
                onFocus={() => searchQuery.trim() && setShowResults(true)}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={!searchQuery.trim()}>
                <Icon name="Search" size={18} className="mr-2" />
                Найти
              </Button>
            </div>

            {showResults && searchResults.length > 0 && (
              <div className="absolute z-50 w-full mt-2 bg-card border border-border rounded-lg shadow-lg overflow-hidden max-h-[500px] overflow-y-auto">
                {searchResults.map((torrent) => (
                  <div
                    key={torrent.id}
                    onClick={() => handleResultClick(torrent.id)}
                    className="flex items-start gap-3 p-3 cursor-pointer transition-all border-b border-border last:border-b-0 hover:border-l-4 hover:border-l-primary hover:pl-2"
                  >
                    <img
                      src={torrent.poster}
                      alt={torrent.title}
                      className="w-16 h-24 object-cover rounded flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0 space-y-2">
                      <p className="font-semibold text-sm">{torrent.title}</p>
                      
                      <div className="flex flex-wrap gap-1.5">
                        {torrent.category && torrent.category.length > 0 && torrent.category.map((cat: string, idx: number) => (
                          <Badge key={idx} variant="secondary" className="text-[10px] py-0 h-5">
                            <Icon name={getCategoryIcon(cat)} size={10} className="mr-1" />
                            {cat}
                          </Badge>
                        ))}
                        {torrent.steamDeck && (
                          <Badge className="bg-green-500 text-white text-[10px] py-0 h-5">
                            <Icon name="Gamepad2" size={10} className="mr-1" />
                            Deck
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Icon name="Download" size={12} />
                          {torrent.downloads?.toLocaleString()}
                        </span>
                        <span>{torrent.size} ГБ</span>
                      </div>
                      
                      {torrent.steamRating && torrent.steamRating > 0 && (
                        <div className="flex items-center gap-3 pt-1 border-t border-border/50">
                          <div className="flex items-center gap-1">
                            <svg className="w-2.5 h-2.5 text-muted-foreground" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.454 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.253 0-2.265-1.014-2.265-2.265z"/>
                            </svg>
                            <Icon name="ThumbsUp" size={10} className="text-green-500" />
                            <span className="text-[10px] font-semibold text-green-500">
                              {Math.round(torrent.steamRating * 0.85).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Icon name="ThumbsDown" size={10} className="text-red-500" />
                            <span className="text-[10px] font-semibold text-red-500">
                              {Math.round(torrent.steamRating * 0.15).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
    </>
  );
};

export default FilterSection;