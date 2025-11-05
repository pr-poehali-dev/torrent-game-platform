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
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    document.body.appendChild(script);

    window.onTelegramAuth = (user: any) => {
      setLoading(true);

      const userData = {
        telegram_id: user.id,
        username: user.username || "",
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        photo_url: user.photo_url || "",
      };

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("authToken", `tg_${user.id}`);

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
    const botUsername = "Torrtop_bot";
    const currentDomain = window.location.hostname;
    const width = 600;
    const height = 700;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    window.open(
      `https://oauth.telegram.org/auth?bot_id=8213964528&origin=${encodeURIComponent(window.location.origin)}&embed=1&request_access=write&return_to=${encodeURIComponent(window.location.origin)}`,
      "telegram-login",
      `width=${width},height=${height},left=${left},top=${top}`,
    );
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