import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Icon from "@/components/ui/icon";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AdminFunctions = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<any[]>([]);
  const [newCategory, setNewCategory] = useState({ name: "", slug: "", icon: "Gamepad2" });
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [showEditIconPicker, setShowEditIconPicker] = useState(false);
  
  const availableIcons = [
    { name: 'Gamepad2', label: 'Игры' },
    { name: 'Zap', label: 'Экшен' },
    { name: 'Sword', label: 'РПГ' },
    { name: 'Brain', label: 'Стратегия' },
    { name: 'Target', label: 'Шутер' },
    { name: 'Compass', label: 'Приключения' },
    { name: 'Car', label: 'Гонки' },
    { name: 'Trophy', label: 'Спорт' },
    { name: 'Cpu', label: 'Симулятор' },
    { name: 'Puzzle', label: 'Головоломка' },
    { name: 'Ghost', label: 'Хоррор' },
    { name: 'Lightbulb', label: 'Инди' },
    { name: 'Users', label: 'ММО' },
    { name: 'Sparkles', label: 'Казуальная' },
    { name: 'Dumbbell', label: 'Файтинг' },
    { name: 'Music', label: 'Музыкальная' },
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/666e4a26-f33a-4f88-b3b1-d9aaa5b427ae?action=categories');
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.name && newCategory.slug) {
      try {
        const response = await fetch('https://functions.poehali.dev/666e4a26-f33a-4f88-b3b1-d9aaa5b427ae?action=categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newCategory)
        });

        if (response.ok) {
          toast({
            title: "Категория добавлена",
            description: `Категория "${newCategory.name}" успешно добавлена`,
          });
          setNewCategory({ name: "", slug: "", icon: "Gamepad2" });
          setShowIconPicker(false);
          fetchCategories();
        }
      } catch (error) {
        toast({
          title: "Ошибка",
          description: "Не удалось добавить категорию",
          variant: "destructive",
        });
      }
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить эту категорию?')) {
      return;
    }
    
    try {
      const response = await fetch(`https://functions.poehali.dev/666e4a26-f33a-4f88-b3b1-d9aaa5b427ae?action=categories&id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: "Категория удалена",
          description: "Категория успешно удалена",
        });
        fetchCategories();
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить категорию",
        variant: "destructive",
      });
    }
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    
    try {
      const response = await fetch(`https://functions.poehali.dev/666e4a26-f33a-4f88-b3b1-d9aaa5b427ae?action=categories&id=${editingCategory.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingCategory.name,
          slug: editingCategory.slug,
          icon: editingCategory.icon
        })
      });

      if (response.ok) {
        toast({
          title: "Категория обновлена",
          description: `Категория "${editingCategory.name}" успешно обновлена`,
        });
        setEditingCategory(null);
        setShowEditIconPicker(false);
        fetchCategories();
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить категорию",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="FolderPlus" className="text-primary" size={24} />
            Добавить категорию
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddCategory} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Название категории</Label>
                <Input
                  placeholder="Например: Экшен"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Slug (для URL)</Label>
                <Input
                  placeholder="Например: action"
                  value={newCategory.slug}
                  onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Иконка категории</Label>
              <div className="relative">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowIconPicker(!showIconPicker)}
                  className="w-full justify-start"
                >
                  <Icon name={newCategory.icon} size={18} className="mr-2" />
                  {availableIcons.find(i => i.name === newCategory.icon)?.label || newCategory.icon}
                  <Icon name="ChevronDown" size={16} className="ml-auto" />
                </Button>
                
                {showIconPicker && (
                  <div className="absolute z-50 w-full mt-2 p-2 bg-card border border-border rounded-lg shadow-lg grid grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                    {availableIcons.map((iconOption) => (
                      <button
                        key={iconOption.name}
                        type="button"
                        onClick={() => {
                          setNewCategory({ ...newCategory, icon: iconOption.name });
                          setShowIconPicker(false);
                        }}
                        className={`p-3 rounded-lg border-2 transition-all hover:border-primary flex flex-col items-center gap-1 ${
                          newCategory.icon === iconOption.name ? 'border-primary bg-primary/10' : 'border-border'
                        }`}
                      >
                        <Icon name={iconOption.name} size={24} />
                        <span className="text-[10px] text-center">{iconOption.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <Button type="submit" className="w-full md:w-auto">
              <Icon name="Plus" size={18} className="mr-2" />
              Добавить категорию
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="FolderOpen" className="text-primary" size={24} />
            Управление категориями
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/50">
                  <TableHead>ID</TableHead>
                  <TableHead>Иконка</TableHead>
                  <TableHead>Название</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Количество игр</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-mono">{category.id}</TableCell>
                    <TableCell>
                      <Icon name={category.icon || 'Gamepad2'} size={20} className="text-primary" />
                    </TableCell>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded text-sm font-mono">
                        {category.slug}
                      </span>
                    </TableCell>
                    <TableCell>{category.count} игр</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setEditingCategory(category)}
                        >
                          <Icon name="Pencil" size={16} />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          <Icon name="Trash2" size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {editingCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Pencil" className="text-primary" size={24} />
                Редактировать категорию
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateCategory} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Название категории</Label>
                    <Input
                      placeholder="Например: Экшен"
                      value={editingCategory.name}
                      onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Slug (для URL)</Label>
                    <Input
                      placeholder="Например: action"
                      value={editingCategory.slug}
                      onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Иконка категории</Label>
                  <div className="relative">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowEditIconPicker(!showEditIconPicker)}
                      className="w-full justify-start"
                    >
                      <Icon name={editingCategory.icon || 'Gamepad2'} size={18} className="mr-2" />
                      {availableIcons.find(i => i.name === editingCategory.icon)?.label || editingCategory.icon}
                      <Icon name="ChevronDown" size={16} className="ml-auto" />
                    </Button>
                    
                    {showEditIconPicker && (
                      <div className="absolute z-50 w-full mt-2 p-2 bg-card border border-border rounded-lg shadow-lg grid grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                        {availableIcons.map((iconOption) => (
                          <button
                            key={iconOption.name}
                            type="button"
                            onClick={() => {
                              setEditingCategory({ ...editingCategory, icon: iconOption.name });
                              setShowEditIconPicker(false);
                            }}
                            className={`p-3 rounded-lg border-2 transition-all hover:border-primary flex flex-col items-center gap-1 ${
                              editingCategory.icon === iconOption.name ? 'border-primary bg-primary/10' : 'border-border'
                            }`}
                          >
                            <Icon name={iconOption.name} size={24} />
                            <span className="text-[10px] text-center">{iconOption.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2 justify-end">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      setEditingCategory(null);
                      setShowEditIconPicker(false);
                    }}
                  >
                    <Icon name="X" size={18} className="mr-2" />
                    Отмена
                  </Button>
                  <Button type="submit">
                    <Icon name="Save" size={18} className="mr-2" />
                    Сохранить
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminFunctions;