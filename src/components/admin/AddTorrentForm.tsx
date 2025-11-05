import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import Icon from "@/components/ui/icon";

interface AddTorrentFormProps {
  formData: {
    title: string;
    poster: string;
    size: string;
    category: string[];
    description: string;
    steamDeck: boolean;
  };
  categories: Array<{ id: number; name: string; slug: string }>;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (field: string, value: any) => void;
  onFileUpload: (file: File) => void;
  uploadingPoster: boolean;
}

const AddTorrentForm = ({ formData, categories, onSubmit, onChange, onFileUpload, uploadingPoster }: AddTorrentFormProps) => {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="Plus" className="text-primary" size={24} />
          Добавить новый торрент
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4 sm:space-y-6">
          <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Название игры</Label>
              <Input
                id="title"
                type="text"
                placeholder="Cyberpunk 2077"
                value={formData.title}
                onChange={(e) => onChange("title", e.target.value)}
                className="bg-secondary border-border"
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Категории</Label>
              <div className="border rounded-md p-3 bg-secondary grid grid-cols-2 md:grid-cols-3 gap-2">
                {categories.map((cat) => (
                  <div key={cat.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`add-cat-${cat.slug}`}
                      checked={formData.category.includes(cat.slug)}
                      onCheckedChange={(checked) => {
                        const newCategories = checked
                          ? [...formData.category, cat.slug]
                          : formData.category.filter((c: string) => c !== cat.slug);
                        onChange("category", newCategories);
                      }}
                    />
                    <label htmlFor={`add-cat-${cat.slug}`} className="text-sm cursor-pointer">
                      {cat.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="poster">Постер игры</Label>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex gap-2">
                    <Input
                      id="poster"
                      type="url"
                      placeholder="https://example.com/poster.jpg или загрузите файл"
                      value={formData.poster}
                      onChange={(e) => onChange("poster", e.target.value)}
                      className="bg-secondary border-border flex-1"
                      required
                    />
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        id="poster-upload"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) onFileUpload(file);
                        }}
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        disabled={uploadingPoster}
                        onClick={() => document.getElementById('poster-upload')?.click()}
                      >
                        <Icon name={uploadingPoster ? "Loader2" : "Upload"} size={18} className={uploadingPoster ? "mr-2 animate-spin" : "mr-2"} />
                        {uploadingPoster ? "Загрузка..." : "Загрузить"}
                      </Button>
                    </div>
                  </div>
                </div>
                {formData.poster && (
                  <div className="flex-shrink-0 relative">
                    <div className="w-32 h-44 rounded-lg overflow-hidden border-2 border-border bg-secondary">
                      <img 
                        src={formData.poster} 
                        alt="Предпросмотр постера"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/300x400/1a1a1a/666?text=Ошибка';
                        }}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                      onClick={() => onChange("poster", "")}
                    >
                      <Icon name="X" size={14} />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="size">Размер (ГБ)</Label>
              <Input
                id="size"
                type="number"
                step="0.1"
                placeholder="57.3"
                value={formData.size}
                onChange={(e) => onChange("size", e.target.value)}
                className="bg-secondary border-border"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="steamDeck">Steam Deck</Label>
              <div className="flex items-center space-x-2 h-10">
                <Checkbox
                  id="steamDeck"
                  checked={formData.steamDeck}
                  onCheckedChange={(checked) => onChange("steamDeck", checked)}
                />
                <label htmlFor="steamDeck" className="text-sm cursor-pointer">
                  Совместимо со Steam Deck
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              placeholder="Описание игры..."
              value={formData.description}
              onChange={(e) => onChange("description", e.target.value)}
              className="bg-secondary border-border min-h-[120px]"
              required
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" className="flex-1">
              <Icon name="Plus" size={18} className="mr-2" />
              Добавить торрент
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddTorrentForm;