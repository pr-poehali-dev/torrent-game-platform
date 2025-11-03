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
    <div className="grid gap-6 md:grid-cols-3 mb-8">
      <Card className="bg-gradient-to-br from-card to-secondary border-border">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Icon name="Gamepad2" className="text-primary" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.games}</div>
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
              <div className="text-2xl font-bold">{stats.users}</div>
              <div className="text-sm text-muted-foreground">Пользователей</div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-card to-secondary border-border">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Icon name="MessageSquare" className="text-primary" size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.comments}</div>
              <div className="text-sm text-muted-foreground">Комментариев</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
