import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FilterSectionProps {
  categories: any[];
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  getCategoryIcon: (category: string) => string;
}

const FilterSection = ({ categories, selectedCategory, setSelectedCategory, getCategoryIcon }: FilterSectionProps) => {
  return (
    <Card className="mb-8 border-border animate-fade-in">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Icon name="Filter" className="text-primary" size={20} />
          <h3 className="text-lg font-semibold">Фильтры</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Категории</label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                Все
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat.slug}
                  variant={selectedCategory === cat.slug ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.slug)}
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
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterSection;
