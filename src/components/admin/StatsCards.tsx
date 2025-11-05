import { Card, CardContent } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

interface StatsCardsProps {
  stats: {
    games: string;
    users: string;
    comments: string;
  };
}

const StatsCards = ({ stats }: StatsCardsProps) => {
  return (
    <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 sm:grid-cols-3 mb-6 sm:mb-8">
      <Card className="bg-gradient-to-br from-card to-secondary border-border">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-primary/10 rounded-lg">
              <Icon name="Gamepad2" className="text-primary" size={20} />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold">{stats.games}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Всего игр</div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-card to-secondary border-border">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-primary/10 rounded-lg">
              <Icon name="Users" className="text-primary" size={20} />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold">{stats.users}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Пользователей</div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-card to-secondary border-border">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-primary/10 rounded-lg">
              <Icon name="MessageSquare" className="text-primary" size={20} />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold">{stats.comments}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Комментариев</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;