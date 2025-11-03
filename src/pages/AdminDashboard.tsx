import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Icon from "@/components/ui/icon";
import { useToast } from "@/hooks/use-toast";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    poster: "",
    downloads: "",
    size: "",
    category: "",
    description: "",
  });
  const [stats, setStats] = useState({
    games: "0",
    users: "0",
    comments: "0"
  });
  const [torrents, setTorrents] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [editingTorrent, setEditingTorrent] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteType, setDeleteType] = useState<'torrent' | 'user'>('torrent');
  const [activeTab, setActiveTab] = useState('add');

  useEffect(() => {
    const isAuth = localStorage.getItem("adminAuth");
    if (isAuth !== "true") {
      navigate("/admin");
    }
    fetchStats();
    fetchTorrents();
    fetchUsers();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/666e4a26-f33a-4f88-b3b1-d9aaa5b427ae/stats');
      const data = await response.json();
      setStats({
        games: data.games.toLocaleString('ru-RU'),
        users: data.users.toLocaleString('ru-RU'),
        comments: data.comments.toLocaleString('ru-RU')
      });
    } catch (error) {
      console.error('Ошибка загрузки статистики:', error);
    }
  };

  const fetchTorrents = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/666e4a26-f33a-4f88-b3b1-d9aaa5b427ae');
      const data = await response.json();
      setTorrents(data.torrents || []);
    } catch (error) {
      console.error('Failed to fetch torrents:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/666e4a26-f33a-4f88-b3b1-d9aaa5b427ae/users');
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleDeleteTorrent = async (id: string) => {
    try {
      const response = await fetch(`https://functions.poehali.dev/666e4a26-f33a-4f88-b3b1-d9aaa5b427ae/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: "Торрент удален",
          description: "Торрент успешно удален из базы данных",
        });
        fetchTorrents();
        fetchStats();
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить торрент",
        variant: "destructive",
      });
    }
    setDeleteId(null);
  };

  const handleDeleteUser = async (id: string) => {
    try {
      const response = await fetch(`https://functions.poehali.dev/666e4a26-f33a-4f88-b3b1-d9aaa5b427ae/users/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: "Пользователь удален",
          description: "Пользователь успешно удален из базы данных",
        });
        fetchUsers();
        fetchStats();
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить пользователя",
        variant: "destructive",
      });
    }
    setDeleteId(null);
  };

  const handleUpdateTorrent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`https://functions.poehali.dev/666e4a26-f33a-4f88-b3b1-d9aaa5b427ae/${editingTorrent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editingTorrent.title,
          poster: editingTorrent.poster,
          downloads: parseInt(editingTorrent.downloads),
          size: parseFloat(editingTorrent.size),
          category: editingTorrent.category,
          description: editingTorrent.description,
        }),
      });

      if (response.ok) {
        toast({
          title: "Торрент обновлен",
          description: `"${editingTorrent.title}" успешно обновлен`,
        });
        setEditingTorrent(null);
        fetchTorrents();
      } else {
        throw new Error('Failed to update');
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить торрент",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    toast({
      title: "Выход выполнен",
      description: "До свидания!",
    });
    navigate("/admin");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('https://functions.poehali.dev/666e4a26-f33a-4f88-b3b1-d9aaa5b427ae', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          poster: formData.poster,
          downloads: parseInt(formData.downloads),
          size: parseFloat(formData.size),
          category: formData.category,
          description: formData.description,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Торрент добавлен",
          description: `"${formData.title}" успешно добавлен в базу данных`,
        });
        
        setFormData({
          title: "",
          poster: "",
          downloads: "",
          size: "",
          category: "",
          description: "",
        });
        
        fetchStats();
      } else {
        toast({
          title: "Ошибка",
          description: data.message || "Не удалось добавить торрент",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка сети",
        description: "Проверьте подключение к интернету",
        variant: "destructive",
      });
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon name="Shield" className="text-primary" size={28} />
              <h1 className="text-2xl font-bold">Админ-панель TorrTop</h1>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <Icon name="LogOut" size={18} className="mr-2" />
              Выйти
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="bg-gradient-to-br from-card to-secondary border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Icon name="Gamepad2" className="text-primary" size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.games}</div>
                  <div className="text-sm text-muted-foreground">Всего игр</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-card to-secondary border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Icon name="Users" className="text-primary" size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.users}</div>
                  <div className="text-sm text-muted-foreground">Пользователей</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-card to-secondary border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Icon name="MessageSquare" className="text-primary" size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.comments}</div>
                  <div className="text-sm text-muted-foreground">Комментариев</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="add">
              <Icon name="Plus" size={18} className="mr-2" />
              Добавить
            </TabsTrigger>
            <TabsTrigger value="torrents">
              <Icon name="Gamepad2" size={18} className="mr-2" />
              Торренты ({torrents.length})
            </TabsTrigger>
            <TabsTrigger value="users">
              <Icon name="Users" size={18} className="mr-2" />
              Пользователи ({users.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="add">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Plus" className="text-primary" size={24} />
                  Добавить новый торрент
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Название игры</Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Cyberpunk 2077"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    className="bg-secondary border-border"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Категория</Label>
                  <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
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
                    onChange={(e) => handleChange("poster", e.target.value)}
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
                    onChange={(e) => handleChange("size", e.target.value)}
                    className="bg-secondary border-border"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="downloads">Скачивания</Label>
                  <Input
                    id="downloads"
                    type="number"
                    placeholder="245890"
                    value={formData.downloads}
                    onChange={(e) => handleChange("downloads", e.target.value)}
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
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="bg-secondary border-border min-h-[120px]"
                  required
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1">
                  <Icon name="Plus" size={18} className="mr-2" />
                  Добавить торрент
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate("/")}>
                  <Icon name="Home" size={18} className="mr-2" />
                  На главную
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
          </TabsContent>

          <TabsContent value="torrents">
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
                                    <form onSubmit={handleUpdateTorrent} className="space-y-4">
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
                                onClick={() => {
                                  setDeleteId(torrent.id);
                                  setDeleteType('torrent');
                                }}
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
          </TabsContent>

          <TabsContent value="users">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Users" className="text-primary" size={24} />
                  Управление пользователями
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-secondary/50">
                        <TableHead>Имя</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Дата регистрации</TableHead>
                        <TableHead className="text-right">Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.username}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            {new Date(user.created_at).toLocaleDateString('ru-RU')}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => {
                                setDeleteId(user.id);
                                setDeleteType('user');
                              }}
                            >
                              <Icon name="Trash2" size={16} className="mr-2" />
                              Удалить
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
              <AlertDialogDescription>
                {deleteType === 'torrent' 
                  ? 'Это действие удалит торрент из базы данных. Это действие нельзя отменить.'
                  : 'Это действие удалит пользователя из базы данных. Это действие нельзя отменить.'
                }
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Отмена</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (deleteId) {
                    if (deleteType === 'torrent') {
                      handleDeleteTorrent(deleteId);
                    } else {
                      handleDeleteUser(deleteId);
                    }
                  }
                }}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Удалить
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
};

export default AdminDashboard;