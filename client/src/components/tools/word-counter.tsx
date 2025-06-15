import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FileText, Eye, Hash, List } from "lucide-react";

export default function WordCounter() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const sentences = text.trim() ? (text.match(/[.!?]+/g) || []).length : 0;
    const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter(p => p.trim()).length : 0;
    const readingTime = Math.ceil(words / 200);

    return {
      words,
      characters,
      charactersNoSpaces,
      sentences,
      paragraphs,
      readingTime
    };
  }, [text]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Text Input */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Enter Your Text
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type or paste your text here..."
              className="min-h-[300px] resize-none"
            />
          </CardContent>
        </Card>
      </div>

      {/* Statistics Panel */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-5 w-5" />
              Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Words:</span>
              <Badge variant="default" className="text-lg px-3 py-1">
                {stats.words}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Characters:</span>
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {stats.characters}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Characters (no spaces):</span>
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {stats.charactersNoSpaces}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Sentences:</span>
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {stats.sentences}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Paragraphs:</span>
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {stats.paragraphs}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Reading time:</span>
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {stats.readingTime} min
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Eye className="h-5 w-5" />
              Pro Tip
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-primary/80">
              The average reading speed is 200-250 words per minute for adults.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
