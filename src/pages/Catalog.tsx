import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
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

const Catalog = () => {
  const [searchParams] = useSearchParams();
  const [allTorrents, setAllTorrents] = useState<TorrentCard[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const selectedCategories = searchParams.get('categories')?.split(',').filter(Boolean) || [];
  const steamDeckOnly = searchParams.get('steamDeck') === 'true';

  useEffect(() => {
    fetchTorrents();
    fetchCategories();
    
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
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

  const getCategoryNames = () => {
    return selectedCategories
      .map(slug => categories.find(c => c.slug === slug)?.name)
      .filter(Boolean)
      .join(', ');
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
        handleAuth={handleAuth}
        handleLogout={handleLogout}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Icon name="Filter" className="text-primary" size={24} />
            <h1 className="text-3xl font-bold">Результаты фильтрации</h1>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedCategories.map(slug => {
              const category = categories.find(c => c.slug === slug);
              return category ? (
                <Badge key={slug} variant="default" className="text-sm py-1 px-3">
                  <Icon name={getCategoryIcon(slug)} size={14} className="mr-1" />
                  {category.name}
                </Badge>
              ) : null;
            })}
            {steamDeckOnly && (
              <Badge variant="default" className="text-sm py-1 px-3 bg-green-500">
                <Icon name="Gamepad2" size={14} className="mr-1" />
                Steam Deck
              </Badge>
            )}
          </div>

          <p className="text-muted-foreground">
            Найдено игр: <span className="font-semibold text-foreground">{filteredTorrents.length}</span>
          </p>
        </div>

        {filteredTorrents.length > 0 ? (
          <TorrentGrid 
            torrents={filteredTorrents}
            formatDownloads={formatDownloads}
            getCategoryIcon={getCategoryIcon}
          />
        ) : (
          <div className="text-center py-16">
            <Icon name="SearchX" className="mx-auto mb-4 text-muted-foreground" size={64} />
            <h2 className="text-2xl font-semibold mb-2">Ничего не найдено</h2>
            <p className="text-muted-foreground">
              Попробуйте изменить параметры фильтрации
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Catalog;
