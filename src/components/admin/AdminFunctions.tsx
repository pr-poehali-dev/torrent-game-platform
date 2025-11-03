import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Icon from "@/components/ui/icon";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AdminFunctions = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: "Экшен", slug: "action", count: 3 },
    { id: 2, name: "RPG", slug: "rpg", count: 2 },
    { id: 3, name: "Хоррор", slug: "horror", count: 1 },
    { id: 4, name: "Спорт", slug: "sport", count: 1 },
    { id: 5, name: "Гонки", slug: "racing", count: 1 },
    { id: 6, name: "Стратегия", slug: "strategy", count: 1 },
    { id: 7, name: "Мультиплеер", slug: "multiplayer", count: 1 },
    { id: 8, name: "Инди", slug: "indie", count: 0 },
  ]);
  const [newCategory, setNewCategory] = useState({ name: "", slug: "" });

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.name && newCategory.slug) {
      const newId = Math.max(...categories.map(c => c.id)) + 1;
      setCategories([...categories, { id: newId, ...newCategory, count: 0 }]);
      setNewCategory({ name: "", slug: "" });
    }
  };

  const handleDeleteCategory = (id: number) => {
    setCategories(categories.filter(c => c.id !== id));
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
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded text-sm font-mono">
                        {category.slug}
                      </span>
                    </TableCell>
                    <TableCell>{category.count} игр</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminFunctions;
