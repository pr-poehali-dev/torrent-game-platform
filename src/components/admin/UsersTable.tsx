import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface UsersTableProps {
  users: any[];
  onDelete: (id: string) => void;
}

const UsersTable = ({ users, onDelete }: UsersTableProps) => {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="Users" className="text-primary" size={24} />
          Управление пользователями
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50">
                <TableHead className="min-w-[120px]">Имя</TableHead>
                <TableHead className="min-w-[180px] hidden sm:table-cell">Email</TableHead>
                <TableHead className="hidden md:table-cell">Дата регистрации</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div>{user.username}</div>
                      <div className="sm:hidden text-xs text-muted-foreground mt-1">
                        {user.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{user.email}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {new Date(user.created_at).toLocaleDateString('ru-RU')}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => onDelete(user.id)}
                    >
                      <Icon name="Trash2" size={16} className="sm:mr-2" />
                      <span className="hidden sm:inline">Удалить</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default UsersTable;