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
    <Card className="mb-4 border-border animate-fade-in">
      <CardContent className="p-6">
        <div className="relative" ref={searchRef}>
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
            <div className="absolute z-50 w-full mt-2 bg-card border border-border rounded-lg shadow-lg overflow-hidden">
              {searchResults.map((torrent) => (
                <div
                  key={torrent.id}
                  onClick={() => handleResultClick(torrent.id)}
                  className="flex items-center gap-3 p-3 hover:bg-accent cursor-pointer transition-colors"
                >
                  <img
                    src={torrent.poster}
                    alt={torrent.title}
                    className="w-12 h-16 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{torrent.title}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Icon name="Download" size={12} />
                        {torrent.downloads?.toLocaleString()}
                      </span>
                      <span>{torrent.size} ГБ</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
    
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

          <div className="flex items-center gap-2 pt-2 border-t border-border">
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
        </div>
      </CardContent>
    </Card>
    </>
  );
};

export default FilterSection;