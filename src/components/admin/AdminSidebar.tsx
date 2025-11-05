import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { useNavigate } from "react-router-dom";

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  torrentsCount: number;
  usersCount: number;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const AdminSidebar = ({ activeTab, setActiveTab, torrentsCount, usersCount, onLogout, isOpen, onClose }: AdminSidebarProps) => {
  const navigate = useNavigate();

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <aside className={`
        fixed lg:sticky top-0 h-screen overflow-y-auto
        w-64 border-r border-border lg:bg-card/50 bg-card z-50
        transition-transform duration-300 lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <Icon name="Shield" className="text-primary" size={28} />
          <div>
            <h1 className="font-bold text-lg">TorrTop</h1>
            <p className="text-xs text-muted-foreground">Админ-панель</p>
          </div>
        </div>
      </div>

      <nav className="p-4 space-y-2">
        <button
          onClick={() => setActiveTab('add')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            activeTab === 'add' 
              ? 'bg-primary text-primary-foreground' 
              : 'hover:bg-secondary'
          }`}
        >
          <Icon name="Plus" size={20} />
          <span className="font-medium">Добавить торрент</span>
        </button>

        <button
          onClick={() => setActiveTab('torrents')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            activeTab === 'torrents' 
              ? 'bg-primary text-primary-foreground' 
              : 'hover:bg-secondary'
          }`}
        >
          <Icon name="Gamepad2" size={20} />
          <div className="flex-1 text-left">
            <span className="font-medium">Торренты</span>
            <p className="text-xs opacity-70">{torrentsCount} игр</p>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            activeTab === 'users' 
              ? 'bg-primary text-primary-foreground' 
              : 'hover:bg-secondary'
          }`}
        >
          <Icon name="Users" size={20} />
          <div className="flex-1 text-left">
            <span className="font-medium">Пользователи</span>
            <p className="text-xs opacity-70">{usersCount} чел.</p>
          </div>
        </button>

        <button
          onClick={() => navigate("/")}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-secondary"
        >
          <Icon name="Home" size={20} />
          <span className="font-medium">На главную</span>
        </button>

        <div className="mt-4 pt-4 border-t border-border">
          <button
            onClick={() => setActiveTab('functions')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              activeTab === 'functions' 
                ? 'bg-primary text-primary-foreground' 
                : 'hover:bg-secondary'
            }`}
          >
            <Icon name="FolderPlus" size={16} />
            <span className="text-sm">Добавить категорию</span>
          </button>
        </div>
      </nav>

      <div className="absolute bottom-0 w-64 p-4 border-t border-border lg:bg-card/50 bg-card">
        <Button variant="outline" onClick={onLogout} className="w-full">
          <Icon name="LogOut" size={18} className="mr-2" />
          Выйти
        </Button>
      </div>
    </aside>
    </>
  );
};

export default AdminSidebar;