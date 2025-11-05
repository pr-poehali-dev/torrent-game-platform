import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import TelegramAuth from "@/components/TelegramAuth";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TorrentCard {
  id: number;
  title: string;
  poster: string;
  downloads: number;
  size: number;
  category: string;
  description: string;
  steamDeck?: boolean;
}

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [allTorrents, setAllTorrents] = useState<TorrentCard[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [stats, setStats] = useState({
    games: "0",
    users: "0",
    comments: "0"
  });
  const [warningMessage, setWarningMessage] = useState("");

  useEffect(() => {
    fetchTorrents();
    fetchStats();
    fetchCategories();
    
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const savedWarning = localStorage.getItem('siteWarning');
    if (savedWarning) {
      setWarningMessage(savedWarning);
    }

    const handleWarningUpdate = () => {
      const updatedWarning = localStorage.getItem('siteWarning');
      setWarningMessage(updatedWarning || '');
    };

    window.addEventListener('warningUpdated', handleWarningUpdate);
    return () => window.removeEventListener('warningUpdated', handleWarningUpdate);
  }, []);

  const handleAuth = (userData: any) => {
    setUser(userData);
    setShowAuthDialog(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    setUser(null);
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/666e4a26-f33a-4f88-b3b1-d9aaa5b427ae?action=categories');
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Ошибка загрузки категорий:', error);
    }
  };

  const fetchTorrents = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/666e4a26-f33a-4f88-b3b1-d9aaa5b427ae');
      const data = await response.json();
      setAllTorrents(data.torrents || []);
    } catch (error) {
      console.error('Ошибка загрузки торрентов:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/666e4a26-f33a-4f88-b3b1-d9aaa5b427ae?action=stats');
      const data = await response.json();
      setStats({
        games: data.games.toLocaleString('ru-RU'),
        users: data.users.toLocaleString('ru-RU'),
        comments: data.comments.toLocaleString('ru-RU')
      });
      if (data.warning) {
        setWarningMessage(data.warning);
      }
    } catch (error) {
      console.error('Ошибка загрузки статистики:', error);
    }
  };

  const popularTorrents = allTorrents.slice(0, 4);
  const steamDeckGames = allTorrents.filter(t => t.category === 'indie').slice(0, 4);
  const networkGames = allTorrents.filter(t => t.category === 'multiplayer').slice(0, 4);

  const formatDownloads = (num: number) => {
    return num.toLocaleString('ru-RU');
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      action: 'Sword',
      adventure: 'Map',
      rpg: 'Wand2',
      strategy: 'Brain',
      shooter: 'Target',
      indie: 'Sparkles',
      multiplayer: 'Users',
      sports: 'Trophy',
      racing: 'Car',
      simulation: 'Cog'
    };
    return icons[category] || 'Folder';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader2" className="animate-spin text-primary mx-auto mb-4" size={48} />
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold text-primary">TorrTop</h1>
              <nav className="hidden md:flex items-center gap-6">
                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="text-sm bg-transparent hover:bg-accent">
                        Категории
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="grid gap-2 p-4 w-[400px] md:w-[500px] lg:w-[600px] lg:grid-cols-2">
                          {categories.map((category) => (
                            <Button key={category.id} variant="ghost" className="justify-start gap-3 h-auto py-3 group">
                              <Icon name="FolderOpen" size={20} className="text-primary group-hover:text-white transition-colors" />
                              <div className="text-left">
                                <div className="font-semibold">{category.name}</div>
                                <div className="text-xs text-muted-foreground">{category.count} игр</div>
                              </div>
                            </Button>
                          ))}
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
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
              
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Avatar>
                        <AvatarImage src={user.photo_url} />
                        <AvatarFallback>{user.first_name?.[0] || 'U'}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem disabled>
                      <div className="flex flex-col">
                        <span className="font-medium">{user.first_name} {user.last_name}</span>
                        {user.username && <span className="text-xs text-muted-foreground">@{user.username}</span>}
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <Icon name="LogOut" size={16} className="mr-2" />
                      Выйти
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <TelegramAuth onAuth={handleAuth} />
              )}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8 animate-fade-in">
          <Card className="bg-gradient-to-br from-card to-secondary border-border hover:border-primary transition-all duration-300 hover:scale-105 group">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <Icon name="Gamepad2" className="text-primary" size={20} />
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-bold text-primary">{stats.games}</div>
                  <div className="text-xs text-muted-foreground">Всего игр</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-card to-secondary border-border hover:border-primary transition-all duration-300 hover:scale-105 group">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <Icon name="Users" className="text-primary" size={20} />
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-bold text-primary">{stats.users}</div>
                  <div className="text-xs text-muted-foreground">Пользователей</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-card to-secondary border-border hover:border-primary transition-all duration-300 hover:scale-105 group">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <Icon name="MessageSquare" className="text-primary" size={20} />
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-bold text-primary">{stats.comments}</div>
                  <div className="text-xs text-muted-foreground">Комментариев</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {warningMessage && (
          <Alert className="mb-8 border-yellow-500/50 bg-yellow-500/10">
            <Icon name="AlertTriangle" className="h-4 w-4 !text-yellow-500" />
            <AlertDescription className="text-yellow-600 dark:text-yellow-400">
              {warningMessage}
            </AlertDescription>
          </Alert>
        )}

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
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    <Badge className="bg-primary/90 backdrop-blur-sm">
                      <Icon name={getCategoryIcon(torrent.category)} size={12} className="mr-1" />
                      {torrent.category}
                    </Badge>
                    {torrent.steamDeck && (
                      <Badge className="bg-green-500/90 backdrop-blur-sm">
                        <Icon name="Gamepad2" size={12} className="mr-1" />
                        Deck
                      </Badge>
                    )}
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-sm mb-2 truncate">{torrent.title}</h3>
                  <div className="flex items-center justify-between gap-2 text-muted-foreground text-xs">
                    <div className="flex items-center gap-1">
                      <Icon name="Download" size={14} />
                      <span>{formatDownloads(torrent.downloads)}</span>
                    </div>
                    <span>{torrent.size} ГБ</span>
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
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    <Badge className="bg-primary/90 backdrop-blur-sm">
                      <Icon name={getCategoryIcon(torrent.category)} size={12} className="mr-1" />
                      {torrent.category}
                    </Badge>
                    {torrent.steamDeck && (
                      <Badge className="bg-green-500/90 backdrop-blur-sm">
                        <Icon name="Gamepad2" size={12} className="mr-1" />
                        Deck
                      </Badge>
                    )}
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-sm mb-2 truncate">{torrent.title}</h3>
                  <div className="flex items-center justify-between gap-2 text-muted-foreground text-xs">
                    <div className="flex items-center gap-1">
                      <Icon name="Download" size={14} />
                      <span>{formatDownloads(torrent.downloads)}</span>
                    </div>
                    <span>{torrent.size} ГБ</span>
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
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    <Badge className="bg-primary/90 backdrop-blur-sm">
                      <Icon name={getCategoryIcon(torrent.category)} size={12} className="mr-1" />
                      {torrent.category}
                    </Badge>
                    {torrent.steamDeck && (
                      <Badge className="bg-green-500/90 backdrop-blur-sm">
                        <Icon name="Gamepad2" size={12} className="mr-1" />
                        Deck
                      </Badge>
                    )}
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-sm mb-2 truncate">{torrent.title}</h3>
                  <div className="flex items-center justify-between gap-2 text-muted-foreground text-xs">
                    <div className="flex items-center gap-1">
                      <Icon name="Download" size={14} />
                      <span>{formatDownloads(torrent.downloads)}</span>
                    </div>
                    <span>{torrent.size} ГБ</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;