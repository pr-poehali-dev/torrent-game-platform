import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Icon from "@/components/ui/icon";
import { useToast } from "@/hooks/use-toast";

const WarningEditor = () => {
  const [warning, setWarning] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedWarning = localStorage.getItem('siteWarning');
    if (savedWarning) {
      setWarning(savedWarning);
    }
  }, []);

  const handleSave = () => {
    setLoading(true);
    try {
      localStorage.setItem('siteWarning', warning);
      window.dispatchEvent(new Event('warningUpdated'));
      
      toast({
        title: "Предупреждение обновлено",
        description: "Сообщение успешно сохранено",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить предупреждение",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="AlertTriangle" className="text-yellow-500" size={24} />
          Предупреждение на главной
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="warning">Текст предупреждения</Label>
            <Textarea
              id="warning"
              placeholder="Введите текст предупреждения, который будет отображаться на главной странице..."
              value={warning}
              onChange={(e) => setWarning(e.target.value)}
              className="bg-secondary border-border min-h-[100px]"
            />
            <p className="text-xs text-muted-foreground">
              Оставьте пустым, чтобы скрыть предупреждение
            </p>
          </div>

          <Button onClick={handleSave} disabled={loading} className="w-full">
            <Icon name={loading ? "Loader2" : "Save"} size={18} className={loading ? "mr-2 animate-spin" : "mr-2"} />
            {loading ? "Сохранение..." : "Сохранить"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WarningEditor;