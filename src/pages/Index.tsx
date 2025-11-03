import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TorrentCard {
  id: number;
  title: string;
  poster: string;
  downloads: number;
  size: number;
}

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const stats = {
    games: "12,847",
    users: "342,891",
    comments: "1,234,567"
  };

  const popularTorrents: TorrentCard[] = [
    { id: 1, title: "Cyberpunk 2077", poster: "https://cdn.poehali.dev/projects/1d1921d0-74be-4a28-add5-def6ede04b63/files/652b4c17-c5df-45d1-b06c-7f98c76eeae7.jpg", downloads: 245890, size: 57.3 },
    { id: 2, title: "Elden Ring", poster: "https://cdn.poehali.dev/projects/1d1921d0-74be-4a28-add5-def6ede04b63/files/9395dda1-6d14-4170-ba88-042d162df52c.jpg", downloads: 189456, size: 48.2 },
    { id: 3, title: "Red Dead Redemption 2", poster: "https://cdn.poehali.dev/projects/1d1921d0-74be-4a28-add5-def6ede04b63/files/59db34d0-9bce-4ff7-a5f5-4c98c1030e32.jpg", downloads: 167234, size: 112.4 },
    { id: 4, title: "God of War", poster: "https://cdn.poehali.dev/projects/1d1921d0-74be-4a28-add5-def6ede04b63/files/9395dda1-6d14-4170-ba88-042d162df52c.jpg", downloads: 156789, size: 67.9 },
  ];

  const steamDeckGames: TorrentCard[] = [
    { id: 5, title: "Hades", poster: "https://cdn.poehali.dev/projects/1d1921d0-74be-4a28-add5-def6ede04b63/files/9395dda1-6d14-4170-ba88-042d162df52c.jpg", downloads: 98765, size: 15.6 },
    { id: 6, title: "Vampire Survivors", poster: "https://cdn.poehali.dev/projects/1d1921d0-74be-4a28-add5-def6ede04b63/files/59db34d0-9bce-4ff7-a5f5-4c98c1030e32.jpg", downloads: 87654, size: 0.8 },
    { id: 7, title: "Stardew Valley", poster: "https://cdn.poehali.dev/projects/1d1921d0-74be-4a28-add5-def6ede04b63/files/652b4c17-c5df-45d1-b06c-7f98c76eeae7.jpg", downloads: 76543, size: 1.2 },
    { id: 8, title: "Dead Cells", poster: "https://cdn.poehali.dev/projects/1d1921d0-74be-4a28-add5-def6ede04b63/files/9395dda1-6d14-4170-ba88-042d162df52c.jpg", downloads: 65432, size: 2.3 },
  ];

  const networkGames: TorrentCard[] = [
    { id: 9, title: "Counter-Strike 2", poster: "https://cdn.poehali.dev/projects/1d1921d0-74be-4a28-add5-def6ede04b63/files/59db34d0-9bce-4ff7-a5f5-4c98c1030e32.jpg", downloads: 198765, size: 28.5 },
    { id: 10, title: "Rust", poster: "https://cdn.poehali.dev/projects/1d1921d0-74be-4a28-add5-def6ede04b63/files/652b4c17-c5df-45d1-b06c-7f98c76eeae7.jpg", downloads: 145678, size: 23.7 },
    { id: 11, title: "Valheim", poster: "https://cdn.poehali.dev/projects/1d1921d0-74be-4a28-add5-def6ede04b63/files/9395dda1-6d14-4170-ba88-042d162df52c.jpg", downloads: 123456, size: 4.2 },
    { id: 12, title: "ARK: Survival Evolved", poster: "https://cdn.poehali.dev/projects/1d1921d0-74be-4a28-add5-def6ede04b63/files/59db34d0-9bce-4ff7-a5f5-4c98c1030e32.jpg", downloads: 112345, size: 89.3 },
  ];

  const formatDownloads = (num: number) => {
    return num.toLocaleString('ru-RU');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold text-primary">TorrTop</h1>
              <nav className="hidden md:flex items-center gap-6">
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </a>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Правообладателям
                </a>
              </nav>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative w-64 hidden lg:block">
                <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input 
                  type="search" 
                  placeholder="Поиск игр..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-secondary border-border"
                />
              </div>
              <Button variant="ghost" size="icon">
                <Icon name="User" size={20} />
              </Button>
            </div>
          </div>
          
          <div className="lg:hidden mt-4">
            <div className="relative">
              <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input 
                type="search" 
                placeholder="Поиск игр..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary border-border"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 animate-fade-in">
          <Card className="bg-gradient-to-br from-card to-secondary border-border hover:border-primary transition-all duration-300 hover:scale-105 group">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <Icon name="Gamepad2" className="text-primary" size={28} />
                </div>
                <div className="flex-1">
                  <div className="text-3xl font-bold text-primary mb-1">{stats.games}</div>
                  <div className="text-sm text-muted-foreground">Всего игр</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-card to-secondary border-border hover:border-primary transition-all duration-300 hover:scale-105 group">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <Icon name="Users" className="text-primary" size={28} />
                </div>
                <div className="flex-1">
                  <div className="text-3xl font-bold text-primary mb-1">{stats.users}</div>
                  <div className="text-sm text-muted-foreground">Пользователей</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-card to-secondary border-border hover:border-primary transition-all duration-300 hover:scale-105 group">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <Icon name="MessageSquare" className="text-primary" size={28} />
                </div>
                <div className="flex-1">
                  <div className="text-3xl font-bold text-primary mb-1">{stats.comments}</div>
                  <div className="text-sm text-muted-foreground">Комментариев</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <section className="mb-16 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-3 mb-6">
            <Icon name="TrendingUp" className="text-primary" size={24} />
            <h2 className="text-2xl font-bold">Популярные торренты</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularTorrents.map((torrent) => (
              <Card 
                key={torrent.id} 
                className="group bg-card border-border overflow-hidden hover:border-primary transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                <div className="aspect-[3/4] overflow-hidden relative">
                  <img 
                    src={torrent.poster} 
                    alt={torrent.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <Badge className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-primary/90 backdrop-blur-sm">
                    {torrent.size} ГБ
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-sm mb-2 truncate">{torrent.title}</h3>
                  <div className="flex items-center gap-2 text-muted-foreground text-xs">
                    <Icon name="Download" size={14} />
                    <span>{formatDownloads(torrent.downloads)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-16 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-3 mb-6">
            <Icon name="Gamepad2" className="text-primary" size={24} />
            <h2 className="text-2xl font-bold">Поддерживается Steam Deck</h2>
            <Badge variant="secondary" className="ml-2">Verified</Badge>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {steamDeckGames.map((torrent) => (
              <Card 
                key={torrent.id} 
                className="group bg-card border-border overflow-hidden hover:border-primary transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                <div className="aspect-[3/4] overflow-hidden relative">
                  <img 
                    src={torrent.poster} 
                    alt={torrent.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <Badge className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-primary/90 backdrop-blur-sm">
                    {torrent.size} ГБ
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-sm mb-2 truncate">{torrent.title}</h3>
                  <div className="flex items-center gap-2 text-muted-foreground text-xs">
                    <Icon name="Download" size={14} />
                    <span>{formatDownloads(torrent.downloads)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-16 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center gap-3 mb-6">
            <Icon name="Wifi" className="text-primary" size={24} />
            <h2 className="text-2xl font-bold">Торренты которые можно играть по сети</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {networkGames.map((torrent) => (
              <Card 
                key={torrent.id} 
                className="group bg-card border-border overflow-hidden hover:border-primary transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                <div className="aspect-[3/4] overflow-hidden relative">
                  <img 
                    src={torrent.poster} 
                    alt={torrent.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <Badge className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-primary/90 backdrop-blur-sm">
                    {torrent.size} ГБ
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-sm mb-2 truncate">{torrent.title}</h3>
                  <div className="flex items-center gap-2 text-muted-foreground text-xs">
                    <Icon name="Download" size={14} />
                    <span>{formatDownloads(torrent.downloads)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-card mt-16">
        <div className="container mx-auto px-4 py-12">
          <nav className="flex flex-wrap items-center justify-center gap-6 mb-8">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              FAQ
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Правообладателям
            </a>
          </nav>
          
          <div className="text-center text-sm text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            <p>
              Администрация сайта не несёт ответственности за содержание материалов находящихся на ресурсе. 
              Если вы являетесь правообладателем и хотите полностью или частично убрать свой материал с нашего сайта, 
              то напишите администрации с ссылками на соответствующие документы. Ваша собственность находилась в 
              свободном доступе и только поэтому была опубликована на нашем сайте. Сайт некоммерческий, и мы не 
              имеем возможности проверять все публикации пользователей.
            </p>
          </div>
          
          <div className="text-center mt-8 text-xs text-muted-foreground">
            © 2024 TorrTop. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;