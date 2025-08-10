import React from "react";
import html2canvas from "html2canvas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Wand2, Copy, Image as ImageIcon, Download } from "lucide-react";

const LOW = [
  "I have a mild fever and don’t want to risk it.",
  "Power outage here, can’t join.",
  "My WiFi is unstable today.",
  "Family emergency came up.",
  "I’m waiting for a repair person.",
];

const MEDIUM = [
  "Laptop is updating for the next 3 hours.",
  "WiFi is acting like it’s on vacation.",
  "Phone battery is dead and charger broke.",
  "My Zoom isn’t working for some reason.",
  "I have unexpected guests at home.",
];

const HIGH = [
  "Neighbour’s cow escaped, I’m helping catch it.",
  "Accidentally joined a yoga retreat over Zoom.",
  "My cat scheduled a nap for me.",
  "I’m beta testing a new mattress.",
  "Trying to teach my plants how to photosynthesize faster.",
];

const pools = { 1: LOW, 2: MEDIUM, 3: HIGH } as const;
const levelLabel: Record<1 | 2 | 3, string> = { 1: "Low", 2: "Medium", 3: "High" };

const Index: React.FC = () => {
  const [level, setLevel] = React.useState<1 | 2 | 3>(2);
  const [excuse, setExcuse] = React.useState<string>("");
  const [excuseKey, setExcuseKey] = React.useState<number>(0);
  const [memeEnabled, setMemeEnabled] = React.useState<boolean>(false);
  const [memeUrl, setMemeUrl] = React.useState<string | null>(null);
  const memeRef = React.useRef<HTMLDivElement>(null);

  const generateExcuse = async () => {
    const list = pools[level];
    const next = list[Math.floor(Math.random() * list.length)];
    setExcuse(next);
    setExcuseKey((k) => k + 1);

    if (memeEnabled) {
      // Wait a tick for DOM to update hidden template, then capture
      setTimeout(async () => {
        if (!memeRef.current) return;
        const canvas = await html2canvas(memeRef.current, {
          backgroundColor: "#ffffff",
          scale: 2,
        });
        const data = canvas.toDataURL("image/png");
        setMemeUrl(data);
      }, 50);
    } else {
      setMemeUrl(null);
    }
  };

  const copyExcuse = async () => {
    if (!excuse) {
      toast({ title: "Nothing to copy", description: "Generate an excuse first." });
      return;
    }
    await navigator.clipboard.writeText(excuse);
    toast({ title: "Copied!", description: "Excuse copied to clipboard." });
  };

  return (
    <div className="min-h-screen bg-hero">
      <header className="container py-10">
        <div className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Auto-Excuse Generator
          </h1>
          <p className="max-w-2xl mx-auto text-muted-foreground">
            Instantly cook up a perfect excuse. Choose your laziness level, generate, copy, and even get a funny meme screenshot.
          </p>
        </div>
      </header>

      <main className="container pb-16">
        <section className="grid gap-6 sm:gap-8 max-w-3xl mx-auto">
          <Card>
            <CardHeader className="flex flex-col gap-4">
              <CardTitle className="text-xl">Laziness level</CardTitle>
              <div className="px-2">
                <Slider
                  value={[level]}
                  onValueChange={(v) => setLevel((v[0] as 1 | 2 | 3) ?? 2)}
                  min={1}
                  max={3}
                  step={1}
                  aria-label="Laziness level"
                />
                <div className="mt-3 grid grid-cols-3 text-sm">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="text-center">
                      <span className={n === level ? "text-primary font-semibold" : "text-muted-foreground"}>
                        {levelLabel[n as 1 | 2 | 3]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-4 p-6 pt-0">
              <Button onClick={generateExcuse} variant="hero" size="lg" className="flex-1">
                <Wand2 /> Generate Excuse
              </Button>
              <Button onClick={copyExcuse} variant="secondary" size="lg">
                <Copy /> Copy
              </Button>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Your excuse</CardTitle>
                <Badge variant="secondary">{levelLabel[level]}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {excuse ? (
                <p key={excuseKey} className="text-lg leading-relaxed animate-enter">
                  “{excuse}”
                </p>
              ) : (
                <p className="text-muted-foreground">Click Generate to get an excuse.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <Switch id="meme" checked={memeEnabled} onCheckedChange={setMemeEnabled} />
                <Label htmlFor="meme">Also create a funny meme screenshot</Label>
              </div>
              {memeEnabled && (
                <div className="text-sm text-muted-foreground">A preview will appear after you generate.</div>
              )}
            </CardHeader>
            {memeEnabled && (
              <CardContent className="space-y-4">
                {memeUrl ? (
                  <div className="space-y-3">
                    <img
                      src={memeUrl}
                      alt="Funny excuse meme screenshot"
                      className="w-full max-w-md mx-auto rounded-lg shadow-md animate-fade-in"
                      loading="lazy"
                    />
                    <div className="flex justify-center">
                      <Button asChild variant="outline">
                        <a href={memeUrl} download="excuse-meme.png">
                          <Download className="mr-2" /> Download Meme
                        </a>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <ImageIcon /> Generate an excuse to see the meme.
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        </section>
      </main>

      {/* Off-screen meme template captured by html2canvas */}
      <div className="absolute -left-[9999px] top-0" aria-hidden>
        <div ref={memeRef} className="w-[360px] rounded-xl border bg-background text-foreground shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-4 py-3 flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary-foreground/20 inline-flex items-center justify-center font-semibold">
              B
            </div>
            <div>
              <div className="text-sm font-semibold">Boss</div>
              <div className="text-xs opacity-90">Today 9:12 AM</div>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <div className="max-w-[80%] rounded-2xl px-3 py-2 bg-secondary">
              <div className="text-xs opacity-70 mb-1">You</div>
              <div className="text-sm leading-relaxed">{excuse || "I’ll be a bit late!"}</div>
            </div>
            <div className="max-w-[80%] ml-auto rounded-2xl px-3 py-2 border">
              <div className="text-xs opacity-70 mb-1">Boss</div>
              <div className="text-sm leading-relaxed">No worries. Keep me posted!</div>
            </div>
          </div>
        </div>
      </div>

      <footer className="container py-10 text-center text-sm text-muted-foreground">
        Built with love and a pinch of mischief.
      </footer>
    </div>
  );
};

export default Index;
