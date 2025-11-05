import Icon from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
  user: any;
  onOpenAuth: () => void;
  handleLogout: () => void;
}

const Header = ({ user, onOpenAuth, handleLogout }: HeaderProps) => {
  return (
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
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar>
                      <AvatarImage src={user.avatar || user.photo_url} />
                      <AvatarFallback>{user.first_name?.[0] || user.username?.[0] || 'U'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem disabled>
                    <div className="flex flex-col">
                      <span className="font-medium">{user.first_name || user.username}</span>
                      {user.email && <span className="text-xs text-muted-foreground">{user.email}</span>}
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Icon name="User" size={16} className="mr-2" />
                    Изменить профиль
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <Icon name="LogOut" size={16} className="mr-2" />
                    Выйти
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={onOpenAuth} variant="outline">
                <Icon name="LogIn" size={18} className="mr-2" />
                Войти
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;