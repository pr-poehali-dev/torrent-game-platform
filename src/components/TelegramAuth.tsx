import { useState } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { useToast } from "@/hooks/use-toast";

interface TelegramAuthProps {
  onAuth: (user: any) => void;
}

const TelegramAuth = ({ onAuth }: TelegramAuthProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleTelegramLogin = () => {
    setLoading(true);
    
    toast({
      title: "Авторизация",
      description: "Для корректной работы авторизации через Telegram необходимо настроить домен бота в @BotFather командой /setdomain",
    });

    setTimeout(() => {
      const mockUser = {
        telegram_id: Date.now(),
        username: "demo_user",
        first_name: "Демо",
        last_name: "Пользователь",
        photo_url: "https://via.placeholder.com/150",
      };

      localStorage.setItem("user", JSON.stringify(mockUser));
      localStorage.setItem("authToken", `tg_${mockUser.telegram_id}`);

      toast({
        title: "Вход выполнен",
        description: `Добро пожаловать, ${mockUser.first_name}!`,
      });

      onAuth(mockUser);
      setLoading(false);
    }, 1000);
  };

  return (
    <Button
      onClick={handleTelegramLogin}
      disabled={loading}
      variant="outline"
      size="icon"
    >
      <Icon
        name={loading ? "Loader2" : "Send"}
        size={20}
        className={loading ? "animate-spin" : ""}
      />
    </Button>
  );
};

export default TelegramAuth;