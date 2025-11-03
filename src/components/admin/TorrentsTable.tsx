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
        <div className="rounded-md border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50">
                <TableHead>Постер</TableHead>
                <TableHead>Название</TableHead>
                <TableHead>Категория</TableHead>
                <TableHead>Размер</TableHead>
                <TableHead>Скачивания</TableHead>
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
                      className="w-16 h-20 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{torrent.title}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded text-sm">
                      {torrent.category}
                    </span>
                  </TableCell>
                  <TableCell>{torrent.size} ГБ</TableCell>
                  <TableCell>{torrent.downloads.toLocaleString('ru-RU')}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Dialog>
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
                                <div className="space-y-2">
                                  <Label>Категория</Label>
                                  <Select 
                                    value={editingTorrent.category} 
                                    onValueChange={(value) => setEditingTorrent({...editingTorrent, category: value})}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
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
