import { useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

interface TelegramAuthProps {
  onAuth: (user: any) => void;
}

declare global {
  interface Window {
    onTelegramAuth?: (user: any) => void;
  }
}

const TelegramAuth = ({ onAuth }: TelegramAuthProps) => {
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.onTelegramAuth = (user: any) => {
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
    };

    if (containerRef.current && !containerRef.current.hasChildNodes()) {
      const script = document.createElement("script");
      script.src = "https://telegram.org/js/telegram-widget.js?22";
      script.async = true;
      script.setAttribute("data-telegram-login", "Torrtop_bot");
      script.setAttribute("data-size", "large");
      script.setAttribute("data-onauth", "onTelegramAuth(user)");
      script.setAttribute("data-request-access", "write");
      containerRef.current.appendChild(script);
    }
  }, [onAuth, toast]);

  return <div ref={containerRef}></div>;
};

export default TelegramAuth;