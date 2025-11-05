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
  steamRating?: number | null;
  metacriticScore?: number | null;
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
          </div>
          <CardContent className="p-4 space-y-3">
            <h3 className="font-semibold text-sm truncate">{torrent.title}</h3>
            
            <div className="flex flex-wrap gap-2">
              {torrent.category && torrent.category.length > 0 && torrent.category.map((cat, idx) => (
                <Badge key={idx} variant="secondary">
                  <Icon name={getCategoryIcon(cat)} size={12} className="mr-1" />
                  {cat}
                </Badge>
              ))}
              {torrent.steamDeck && (
                <Badge className="bg-green-500 text-white">Steam Deck</Badge>
              )}
            </div>
            
            <div className="flex items-center justify-between gap-2 text-muted-foreground text-xs">
              <div className="flex items-center gap-1">
                <Icon name="Download" size={14} />
                <span>{formatDownloads(torrent.downloads)}</span>
              </div>
              <span>{torrent.size} ГБ</span>
            </div>
            
            {torrent.steamRating && torrent.steamRating > 0 && (
              <div className="pt-2 border-t border-border">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Отзывы Steam</span>
                  <svg className="w-3 h-3 text-muted-foreground" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.454 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.253 0-2.265-1.014-2.265-2.265z"/>
                  </svg>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 flex-1">
                    <Icon name="ThumbsUp" size={12} className="text-green-500" />
                    <span className="text-xs font-semibold text-green-500">
                      {Math.round(torrent.steamRating * 0.85).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 flex-1 justify-end">
                    <Icon name="ThumbsDown" size={12} className="text-red-500" />
                    <span className="text-xs font-semibold text-red-500">
                      {Math.round(torrent.steamRating * 0.15).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TorrentGrid;