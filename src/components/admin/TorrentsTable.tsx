import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface TorrentsTableProps {
  torrents: any[];
  editingTorrent: any;
  setEditingTorrent: (torrent: any) => void;
  onUpdate: (e: React.FormEvent) => void;
  onDelete: (id: string) => void;
}

const TorrentsTable = ({ torrents, editingTorrent, setEditingTorrent, onUpdate, onDelete }: TorrentsTableProps) => {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="Gamepad2" className="text-primary" size={24} />
          Управление торрентами
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50">
                <TableHead className="w-20">Постер</TableHead>
                <TableHead className="min-w-[150px]">Название</TableHead>
                <TableHead className="hidden sm:table-cell">Категория</TableHead>
                <TableHead className="hidden md:table-cell">Размер</TableHead>
                <TableHead className="hidden lg:table-cell">Скачивания</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {torrents.map((torrent) => (
                <TableRow key={torrent.id}>
                  <TableCell>
                    <img 
                      src={torrent.poster} 
                      alt={torrent.title}
                      className="w-12 h-16 sm:w-16 sm:h-20 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="min-w-[120px]">
                      <div className="line-clamp-2">{torrent.title}</div>
                      <div className="sm:hidden text-xs text-muted-foreground mt-1">
                        {torrent.size} ГБ
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {torrent.category && Array.isArray(torrent.category) && torrent.category.map((cat: string, idx: number) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{torrent.size} ГБ</TableCell>
                  <TableCell className="hidden lg:table-cell">{torrent.downloads.toLocaleString('ru-RU')}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 sm:gap-2 justify-end">
                      <Dialog open={editingTorrent?.id === torrent.id} onOpenChange={(open) => !open && setEditingTorrent(null)}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setEditingTorrent(torrent)}
                          >
                            <Icon name="Edit" size={16} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Редактировать торрент</DialogTitle>
                          </DialogHeader>
                          {editingTorrent && (
                            <form onSubmit={onUpdate} className="space-y-4">
                              <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                  <Label>Название</Label>
                                  <Input
                                    value={editingTorrent.title}
                                    onChange={(e) => setEditingTorrent({...editingTorrent, title: e.target.value})}
                                    required
                                  />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                  <Label>Категории</Label>
                                  <div className="border rounded-md p-3 space-y-2">
                                    {['action', 'rpg', 'horror', 'sport', 'racing', 'strategy', 'multiplayer', 'indie', 'adventure', 'shooter', 'simulation'].map((cat) => {
                                      const categoryLabels: Record<string, string> = {
                                        action: 'Экшен',
                                        rpg: 'RPG',
                                        horror: 'Хоррор',
                                        sport: 'Спорт',
                                        racing: 'Гонки',
                                        strategy: 'Стратегия',
                                        multiplayer: 'Мультиплеер',
                                        indie: 'Инди',
                                        adventure: 'Приключения',
                                        shooter: 'Шутер',
                                        simulation: 'Симулятор'
                                      };
                                      const categories = editingTorrent.category || [];
                                      return (
                                        <div key={cat} className="flex items-center space-x-2">
                                          <Checkbox
                                            id={`cat-${cat}`}
                                            checked={categories.includes(cat)}
                                            onCheckedChange={(checked) => {
                                              const newCategories = checked
                                                ? [...categories, cat]
                                                : categories.filter((c: string) => c !== cat);
                                              setEditingTorrent({...editingTorrent, category: newCategories});
                                            }}
                                          />
                                          <label htmlFor={`cat-${cat}`} className="text-sm cursor-pointer">
                                            {categoryLabels[cat]}
                                          </label>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label>Постер URL</Label>
                                  <Input
                                    value={editingTorrent.poster}
                                    onChange={(e) => setEditingTorrent({...editingTorrent, poster: e.target.value})}
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Размер (ГБ)</Label>
                                  <Input
                                    type="number"
                                    step="0.1"
                                    value={editingTorrent.size}
                                    onChange={(e) => setEditingTorrent({...editingTorrent, size: e.target.value})}
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Скачивания</Label>
                                  <Input
                                    type="number"
                                    value={editingTorrent.downloads}
                                    onChange={(e) => setEditingTorrent({...editingTorrent, downloads: e.target.value})}
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Steam Deck</Label>
                                  <Select 
                                    value={editingTorrent.steamDeck ? "yes" : "no"} 
                                    onValueChange={(value) => setEditingTorrent({...editingTorrent, steamDeck: value === "yes"})}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="yes">Да</SelectItem>
                                      <SelectItem value="no">Нет</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label>Описание</Label>
                                <Textarea
                                  value={editingTorrent.description}
                                  onChange={(e) => setEditingTorrent({...editingTorrent, description: e.target.value})}
                                  className="min-h-[100px]"
                                  required
                                />
                              </div>
                              <div className="flex gap-2 justify-end">
                                <Button type="button" variant="outline" onClick={() => setEditingTorrent(null)}>
                                  Отмена
                                </Button>
                                <Button type="submit">
                                  Сохранить
                                </Button>
                              </div>
                            </form>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => onDelete(torrent.id)}
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TorrentsTable;