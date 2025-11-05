import Icon from "@/components/ui/icon";
import { Card, CardContent } from "@/components/ui/card";

interface StatsSectionProps {
  stats: {
    games: string;
    users: string;
    comments: string;
  };
}

const StatsSection = ({ stats }: StatsSectionProps) => {
  return (
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
  );
};

export default StatsSection;
