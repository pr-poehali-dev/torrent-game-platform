import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

interface FilterSectionProps {
  categories: any[];
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  steamDeckOnly: boolean;
  setSteamDeckOnly: (value: boolean) => void;
  getCategoryIcon: (category: string) => string;
}

const FilterSection = ({ 
  categories, 
  selectedCategories, 
  setSelectedCategories, 
  steamDeckOnly, 
  setSteamDeckOnly, 
  getCategoryIcon 
}: FilterSectionProps) => {
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

  return (
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
                  <Badge variant="secondary" className="ml-2">
                    {cat.count}
                  </Badge>
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
              Только игры с поддержкой Steam Deck
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterSection;
