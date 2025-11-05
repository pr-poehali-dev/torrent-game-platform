import Icon from "@/components/ui/icon";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

interface TorrentGridProps {
  torrents: TorrentCard[];
  formatDownloads: (num: number) => string;
  getCategoryIcon: (category: string) => string;
}

const TorrentGrid = ({ torrents, formatDownloads, getCategoryIcon }: TorrentGridProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {torrents.map((torrent) => (
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
            <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2">
              {torrent.category && torrent.category.length > 0 && torrent.category.map((cat, idx) => (
                <Badge key={idx} className="bg-primary/90 backdrop-blur-sm">
                  <Icon name={getCategoryIcon(cat)} size={12} className="mr-1" />
                  {cat}
                </Badge>
              ))}
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
  );
};

export default TorrentGrid;
