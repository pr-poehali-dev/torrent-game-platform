import { useState } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TelegramAuthProps {
  onAuth: (user: any) => void;
}

const TelegramAuth = ({ onAuth }: TelegramAuthProps) => {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = () => {
    if (!username || !firstName) {
      toast({
        title: "Ошибка",
        description: "Заполните все поля",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    const userData = {
      telegram_id: Date.now(),
      username: username,
      first_name: firstName,
      last_name: '',
      photo_url: `https://ui-avatars.com/api/?name=${firstName}&background=0088cc&color=fff`
    };

    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('authToken', `tg_${userData.telegram_id}`);

    toast({
      title: "Вход выполнен",
      description: `Добро пожаловать, ${firstName}!`,
    });

    onAuth(userData);
    setLoading(false);
    setOpen(false);
    setUsername("");
    setFirstName("");
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="bg-[#0088cc] hover:bg-[#0077b3] text-white"
      >
        <Icon name="Send" size={18} className="mr-2" />
        Войти через Telegram
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Вход через Telegram</DialogTitle>
            <DialogDescription>
              Введите ваши данные для входа
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Имя</Label>
              <Input
                id="firstName"
                placeholder="Иван"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <Button 
              onClick={handleLogin} 
              disabled={loading}
              className="w-full bg-[#0088cc] hover:bg-[#0077b3]"
            >
              <Icon name={loading ? "Loader2" : "LogIn"} size={18} className={loading ? "mr-2 animate-spin" : "mr-2"} />
              {loading ? "Вход..." : "Войти"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TelegramAuth;