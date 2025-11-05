import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from "@/components/Header";
import AuthModal from "@/components/AuthModal";
import FilterSection from "@/components/FilterSection";
import StatsSection from "@/components/StatsSection";
import TorrentGrid from "@/components/TorrentGrid";

interface TorrentCard {
  id: number;
  title: string;
  poster: string;
  downloads: number;
  size: number;
  category: string[];
  description: string;
  steamDeck?: boolean;
}

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [allTorrents, setAllTorrents] = useState<TorrentCard[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    games: "0",
    users: "0",
    comments: "0"
  });
  const [warningMessage, setWarningMessage] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [steamDeckOnly, setSteamDeckOnly] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

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

  const filteredTorrents = allTorrents.filter(t => {
    let matches = true;
    
    if (selectedCategories.length > 0) {
      matches = selectedCategories.some(cat => t.category && t.category.includes(cat));
    }
    
    if (steamDeckOnly) {
      matches = matches && t.steamDeck === true;
    }
    
    return matches;
  });

  const popularTorrents = filteredTorrents.slice(0, 8);
  const steamDeckGames = allTorrents.filter(t => t.category && t.category.includes('indie')).slice(0, 4);
  const networkGames = allTorrents.filter(t => t.category && t.category.includes('multiplayer')).slice(0, 4);

  const formatDownloads = (num: number) => {
    return num.toLocaleString('ru-RU');
  };

  const getCategoryIcon = (categorySlug: string) => {
    const cat = categories.find(c => c.slug === categorySlug);
    return cat?.icon || 'Gamepad2';
  };

  const handleApplyFilters = () => {
    const params = new URLSearchParams();
    if (selectedCategories.length > 0) {
      params.set('categories', selectedCategories.join(','));
    }
    if (steamDeckOnly) {
      params.set('steamDeck', 'true');
    }
    navigate(`/catalog?${params.toString()}`);
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
      <Header 
        user={user}
        onOpenAuth={() => setShowAuthModal(true)}
        handleLogout={handleLogout}
      />
      
      <AuthModal 
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        onAuth={handleAuth}
      />

      <main className="container mx-auto px-4 py-8">
        <FilterSection 
          categories={categories}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          steamDeckOnly={steamDeckOnly}
          setSteamDeckOnly={setSteamDeckOnly}
          getCategoryIcon={getCategoryIcon}
          onApplyFilters={handleApplyFilters}
          allTorrents={allTorrents}
        />

        <StatsSection stats={stats} />

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
            <h2 className="text-2xl font-bold">
              {selectedCategories.length > 0 || steamDeckOnly
                ? 'Результаты фильтрации' 
                : 'Популярные торренты'}
            </h2>
            {(selectedCategories.length > 0 || steamDeckOnly) && (
              <Badge variant="secondary" className="text-sm">
                {popularTorrents.length} игр
              </Badge>
            )}
          </div>
          <TorrentGrid 
            torrents={popularTorrents}
            formatDownloads={formatDownloads}
            getCategoryIcon={getCategoryIcon}
          />
        </section>

        {selectedCategories.length === 0 && !steamDeckOnly && (
          <>
            <section className="mb-16 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-3 mb-6">
                <Icon name="Gamepad2" className="text-primary" size={24} />
                <h2 className="text-2xl font-bold">Поддерживается Steam Deck</h2>
              </div>
              <TorrentGrid 
                torrents={steamDeckGames}
                formatDownloads={formatDownloads}
                getCategoryIcon={getCategoryIcon}
              />
            </section>

            <section className="mb-16 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center gap-3 mb-6">
                <Icon name="Wifi" className="text-primary" size={24} />
                <h2 className="text-2xl font-bold">Торренты которые можно играть по сети</h2>
              </div>
              <TorrentGrid 
                torrents={networkGames}
                formatDownloads={formatDownloads}
                getCategoryIcon={getCategoryIcon}
              />
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default Index;