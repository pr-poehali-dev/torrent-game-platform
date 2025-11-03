import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import AdminSidebar from "@/components/admin/AdminSidebar";
import StatsCards from "@/components/admin/StatsCards";
import AddTorrentForm from "@/components/admin/AddTorrentForm";
import TorrentsTable from "@/components/admin/TorrentsTable";
import UsersTable from "@/components/admin/UsersTable";
import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog";
import AdminFunctions from "@/components/admin/AdminFunctions";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    poster: "",
    size: "",
    category: "",
    description: "",
  });
  const [stats, setStats] = useState({
    games: "0",
    users: "0",
    comments: "0"
  });
  const [torrents, setTorrents] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [editingTorrent, setEditingTorrent] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteType, setDeleteType] = useState<'torrent' | 'user'>('torrent');
  const [activeTab, setActiveTab] = useState('add');
  const [uploadingPoster, setUploadingPoster] = useState(false);

  useEffect(() => {
    const isAuth = localStorage.getItem("adminAuth");
    if (isAuth !== "true") {
      navigate("/admin");
    }
    fetchStats();
    fetchTorrents();
    fetchUsers();
    fetchCategories();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/666e4a26-f33a-4f88-b3b1-d9aaa5b427ae?action=stats');
      const data = await response.json();
      setStats({
        games: data.games.toLocaleString('ru-RU'),
        users: data.users.toLocaleString('ru-RU'),
        comments: data.comments.toLocaleString('ru-RU')
      });
    } catch (error) {
      console.error('Ошибка загрузки статистики:', error);
    }
  };

  const fetchTorrents = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/666e4a26-f33a-4f88-b3b1-d9aaa5b427ae');
      const data = await response.json();
      setTorrents(data.torrents || []);
    } catch (error) {
      console.error('Failed to fetch torrents:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/666e4a26-f33a-4f88-b3b1-d9aaa5b427ae?action=users');
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/666e4a26-f33a-4f88-b3b1-d9aaa5b427ae?action=categories');
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleDeleteTorrent = async (id: string) => {
    try {
      const response = await fetch(`https://functions.poehali.dev/666e4a26-f33a-4f88-b3b1-d9aaa5b427ae?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: "Торрент удален",
          description: "Торрент успешно удален из базы данных",
        });
        fetchTorrents();
        fetchStats();
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить торрент",
        variant: "destructive",
      });
    }
    setDeleteId(null);
  };

  const handleDeleteUser = async (id: string) => {
    try {
      const response = await fetch(`https://functions.poehali.dev/666e4a26-f33a-4f88-b3b1-d9aaa5b427ae/users/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: "Пользователь удален",
          description: "Пользователь успешно удален из базы данных",
        });
        fetchUsers();
        fetchStats();
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить пользователя",
        variant: "destructive",
      });
    }
    setDeleteId(null);
  };

  const handleUpdateTorrent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`https://functions.poehali.dev/666e4a26-f33a-4f88-b3b1-d9aaa5b427ae/${editingTorrent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editingTorrent.title,
          poster: editingTorrent.poster,
          downloads: parseInt(editingTorrent.downloads),
          size: parseFloat(editingTorrent.size),
          category: editingTorrent.category,
          description: editingTorrent.description,
        }),
      });

      if (response.ok) {
        toast({
          title: "Торрент обновлен",
          description: `"${editingTorrent.title}" успешно обновлен`,
        });
        setEditingTorrent(null);
        fetchTorrents();
      } else {
        throw new Error('Failed to update');
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить торрент",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    toast({
      title: "Выход выполнен",
      description: "До свидания!",
    });
    navigate("/admin");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('https://functions.poehali.dev/666e4a26-f33a-4f88-b3b1-d9aaa5b427ae', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          poster: formData.poster,
          size: parseFloat(formData.size),
          category: formData.category,
          description: formData.description,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Торрент добавлен",
          description: `"${formData.title}" успешно добавлен в базу данных`,
        });
        
        setFormData({
          title: "",
          poster: "",
          size: "",
          category: "",
          description: "",
        });
        
        fetchStats();
      } else {
        toast({
          title: "Ошибка",
          description: data.message || "Не удалось добавить торрент",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка сети",
        description: "Проверьте подключение к интернету",
        variant: "destructive",
      });
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (file: File) => {
    setUploadingPoster(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const response = await fetch('https://api.poehali.dev/upload-image', {
        method: 'POST',
        body: formDataUpload,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({ ...prev, poster: data.url }));
        toast({
          title: "Постер загружен",
          description: "Изображение успешно загружено",
        });
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить изображение",
        variant: "destructive",
      });
    } finally {
      setUploadingPoster(false);
    }
  };

  const handleTorrentDelete = (id: string) => {
    setDeleteId(id);
    setDeleteType('torrent');
  };

  const handleUserDelete = (id: string) => {
    setDeleteId(id);
    setDeleteType('user');
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      if (deleteType === 'torrent') {
        handleDeleteTorrent(deleteId);
      } else {
        handleDeleteUser(deleteId);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        torrentsCount={torrents.length}
        usersCount={users.length}
        onLogout={handleLogout}
      />

      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-8 py-8">
          <StatsCards stats={stats} />

          <div className="w-full">
            {activeTab === 'add' && (
              <AddTorrentForm 
                formData={formData}
                categories={categories}
                onSubmit={handleSubmit}
                onChange={handleChange}
                onFileUpload={handleFileUpload}
                uploadingPoster={uploadingPoster}
              />
            )}

            {activeTab === 'torrents' && (
              <TorrentsTable 
                torrents={torrents}
                editingTorrent={editingTorrent}
                setEditingTorrent={setEditingTorrent}
                onUpdate={handleUpdateTorrent}
                onDelete={handleTorrentDelete}
              />
            )}

            {activeTab === 'users' && (
              <UsersTable 
                users={users}
                onDelete={handleUserDelete}
              />
            )}

            {activeTab === 'functions' && (
              <AdminFunctions />
            )}
          </div>

          <DeleteConfirmDialog 
            open={deleteId !== null}
            onOpenChange={() => setDeleteId(null)}
            deleteType={deleteType}
            onConfirm={handleConfirmDelete}
          />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;