import Icon from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  user: any;
  handleAuth: (userData: any) => void;
  handleLogout: () => void;
  categories: any[];
}

const Header = ({ searchQuery, setSearchQuery, user, handleAuth, handleLogout, categories }: HeaderProps) => {
  return (
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
  );
};

export default Header;
