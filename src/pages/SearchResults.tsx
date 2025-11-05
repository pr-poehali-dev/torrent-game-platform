import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import TorrentGrid from '@/components/TorrentGrid';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  
  const [allTorrents, setAllTorrents] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchTorrents();
    fetchCategories();
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

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

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/666e4a26-f33a-4f88-b3b1-d9aaa5b427ae?action=categories');
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Ошибка загрузки категорий:', error);
    }
  };

  const handleAuth = () => {
    navigate('/auth');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const getCategoryIcon = (categorySlug: string): string => {
    const cat = categories.find(c => c.slug === categorySlug);
    return cat?.icon || 'Gamepad2';
  };

  const formatDownloads = (downloads: number): string => {
    if (downloads >= 1000000) {
      return `${(downloads / 1000000).toFixed(1)}M`;
    }
    if (downloads >= 1000) {
      return `${(downloads / 1000).toFixed(1)}K`;
    }
    return downloads.toString();
  };

  const searchResults = allTorrents.filter(torrent =>
    torrent.title.toLowerCase().includes(query.toLowerCase())
  );

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
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <Icon name="ArrowLeft" size={18} className="mr-2" />
            Назад
          </Button>

          <div className="flex items-center gap-3 mb-2">
            <Icon name="Search" className="text-primary" size={28} />
            <h1 className="text-3xl font-bold">Результаты поиска</h1>
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <span>Запрос:</span>
            <Badge variant="secondary" className="text-base px-3 py-1">
              {query}
            </Badge>
            <span>•</span>
            <span>{searchResults.length} игр найдено</span>
          </div>
        </div>

        {searchResults.length > 0 ? (
          <TorrentGrid
            torrents={searchResults}
            formatDownloads={formatDownloads}
            getCategoryIcon={getCategoryIcon}
          />
        ) : (
          <div className="text-center py-16">
            <Icon name="SearchX" size={64} className="text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Ничего не найдено</h2>
            <p className="text-muted-foreground mb-6">
              По запросу "{query}" не найдено ни одной игры
            </p>
            <Button onClick={() => navigate('/')}>
              <Icon name="Home" size={18} className="mr-2" />
              На главную
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchResults;