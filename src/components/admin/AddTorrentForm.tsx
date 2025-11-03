import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Icon from "@/components/ui/icon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddTorrentFormProps {
  formData: {
    title: string;
    poster: string;
    size: string;
    category: string;
    description: string;
  };
  onSubmit: (e: React.FormEvent) => void;
  onChange: (field: string, value: string) => void;
}

const AddTorrentForm = ({ formData, onSubmit, onChange }: AddTorrentFormProps) => {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="Plus" className="text-primary" size={24} />
          Добавить новый торрент
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
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

            <div className="space-y-2">
              <Label htmlFor="category">Категория</Label>
              <Select value={formData.category} onValueChange={(value) => onChange("category", value)}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="action">Экшен</SelectItem>
                  <SelectItem value="rpg">RPG</SelectItem>
                  <SelectItem value="horror">Хоррор</SelectItem>
                  <SelectItem value="sport">Спорт</SelectItem>
                  <SelectItem value="racing">Гонки</SelectItem>
                  <SelectItem value="strategy">Стратегия</SelectItem>
                  <SelectItem value="multiplayer">Мультиплеер</SelectItem>
                  <SelectItem value="indie">Инди</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="poster">URL постера</Label>
              <Input
                id="poster"
                type="url"
                placeholder="https://example.com/poster.jpg"
                value={formData.poster}
                onChange={(e) => onChange("poster", e.target.value)}
                className="bg-secondary border-border"
                required
              />
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