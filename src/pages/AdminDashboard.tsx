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

  useEffect(() => {
    const isAuth = localStorage.getItem("adminAuth");
    if (isAuth !== "true") {
      navigate("/admin");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    toast({
      title: "Выход выполнен",
      description: "До свидания!",
    });
    navigate("/admin");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Торрент добавлен",
      description: `"${formData.title}" успешно добавлен в каталог`,
    });
    
    setFormData({
      title: "",
      poster: "",
      downloads: "",
      size: "",
      category: "",
      description: "",
    });
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
                  <div className="text-2xl font-bold">12,847</div>
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
                  <div className="text-2xl font-bold">342,891</div>
                  <div className="text-sm text-muted-foreground">Пользователей</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-card to-secondary border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Icon name="Download" className="text-primary" size={24} />
                </div>
                <div>
                  <div className="text-2xl font-bold">1.2M</div>
                  <div className="text-sm text-muted-foreground">Скачиваний</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

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
      </main>
    </div>
  );
};

export default AdminDashboard;
