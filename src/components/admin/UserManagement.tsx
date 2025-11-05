import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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

const UserManagement = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/666e4a26-f33a-4f88-b3b1-d9aaa5b427ae?action=users');
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить пользователей",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleAdmin = async (userId: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`https://functions.poehali.dev/666e4a26-f33a-4f88-b3b1-d9aaa5b427ae?action=users&id=${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_admin: !currentStatus
        })
      });

      if (response.ok) {
        toast({
          title: currentStatus ? "Права администратора отозваны" : "Права администратора выданы",
          description: "Изменения применены успешно",
        });
        fetchUsers();
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить права пользователя",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-6 text-center">
          <Icon name="Loader2" className="animate-spin text-primary mx-auto mb-4" size={48} />
          <p className="text-muted-foreground">Загрузка пользователей...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="Users" className="text-primary" size={24} />
          Управление пользователями
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50">
                <TableHead>Пользователь</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Дата регистрации</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.first_name?.[0] || user.username?.[0] || 'U'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.first_name || user.username}</div>
                        <div className="text-sm text-muted-foreground">@{user.username}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{user.email}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(user.created_at)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {user.is_admin ? (
                      <Badge className="bg-primary text-primary-foreground">
                        <Icon name="Shield" size={12} className="mr-1" />
                        Администратор
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <Icon name="User" size={12} className="mr-1" />
                        Пользователь
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant={user.is_admin ? "destructive" : "default"}
                      size="sm"
                      onClick={() => toggleAdmin(user.id, user.is_admin)}
                    >
                      <Icon name={user.is_admin ? "ShieldOff" : "ShieldCheck"} size={16} className="mr-2" />
                      {user.is_admin ? "Отозвать права" : "Сделать админом"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-4 text-sm text-muted-foreground">
          Всего пользователей: {users.length}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserManagement;
