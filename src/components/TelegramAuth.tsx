import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { useToast } from "@/hooks/use-toast";

interface TelegramAuthProps {
  onAuth: (user: any) => void;
}

declare global {
  interface Window {
    TelegramLoginWidget?: any;
    onTelegramAuth?: (user: any) => void;
  }
}

const TelegramAuth = ({ onAuth }: TelegramAuthProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
    document.body.appendChild(script);

    window.onTelegramAuth = (user: any) => {
      setLoading(true);
      
      const userData = {
        telegram_id: user.id,
        username: user.username || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        photo_url: user.photo_url || ''
      };

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('authToken', `tg_${user.id}`);

      toast({
        title: "Вход выполнен",
        description: `Добро пожаловать, ${user.first_name}!`,
      });

      onAuth(userData);
      setLoading(false);
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [onAuth, toast]);

  const handleTelegramLogin = () => {
    const botUsername = 'YOUR_BOT_USERNAME';
    const width = 600;
    const height = 700;
    const left = (window.screen.width / 2) - (width / 2);
    const top = (window.screen.height / 2) - (height / 2);
    
    window.open(
      `https://oauth.telegram.org/auth?bot_id=YOUR_BOT_ID&origin=${window.location.origin}&request_access=write`,
      'telegram-login',
      `width=${width},height=${height},left=${left},top=${top}`
    );
  };

  return (
    <Button
      onClick={handleTelegramLogin}
      disabled={loading}
      className="bg-[#0088cc] hover:bg-[#0077b3] text-white"
    >
      <Icon name={loading ? "Loader2" : "Send"} size={18} className={loading ? "mr-2 animate-spin" : "mr-2"} />
      {loading ? "Вход..." : "Войти через Telegram"}
    </Button>
  );
};

export default TelegramAuth;