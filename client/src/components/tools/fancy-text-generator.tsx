import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FontStyle {
  name: string;
  category: string;
  transform: (text: string) => string;
}

const FONT_STYLES: FontStyle[] = [
  // Simple Styles
  { name: "Uppercase", category: "simple", transform: (text) => text.toUpperCase() },
  { name: "Lowercase", category: "simple", transform: (text) => text.toLowerCase() },
  { name: "Title Case", category: "simple", transform: (text) => text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()) },
  { name: "Reverse", category: "simple", transform: (text) => text.split('').reverse().join('') },
  { name: "Alternating Case", category: "simple", transform: (text) => text.split('').map((char, i) => i % 2 === 0 ? char.toLowerCase() : char.toUpperCase()).join('') },

  // Decorative Frames - Royal Theme
  { name: "Royal Crown Frame", category: "decorative", transform: (text) => `♛ ${text} ♛` },
  { name: "Royal Scepter Frame", category: "decorative", transform: (text) => `♝ ${text} ♝` },
  { name: "Royal Castle Frame", category: "decorative", transform: (text) => `♜ ${text} ♜` },
  { name: "Royal Knight Frame", category: "decorative", transform: (text) => `♞ ${text} ♞` },
  { name: "Royal Queen Frame", category: "decorative", transform: (text) => `♕ ${text} ♕` },
  { name: "Royal King Frame", category: "decorative", transform: (text) => `♔ ${text} ♔` },
  { name: "Royal Bishop Frame", category: "decorative", transform: (text) => `♗ ${text} ♗` },
  { name: "Royal Rook Frame", category: "decorative", transform: (text) => `♖ ${text} ♖` },

  // Decorative Frames - Weapon Theme
  { name: "Sword Frame", category: "decorative", transform: (text) => `⚔ ${text} ⚔` },
  { name: "Shield Frame", category: "decorative", transform: (text) => `🛡 ${text} 🛡` },
  { name: "Bow Frame", category: "decorative", transform: (text) => `🏹 ${text} 🏹` },
  { name: "Dagger Frame", category: "decorative", transform: (text) => `🗡 ${text} 🗡` },
  { name: "Hammer Frame", category: "decorative", transform: (text) => `🔨 ${text} 🔨` },
  { name: "Axe Frame", category: "decorative", transform: (text) => `🪓 ${text} 🪓` },
  { name: "Spear Frame", category: "decorative", transform: (text) => `⚡ ${text} ⚡` },
  { name: "Crossbow Frame", category: "decorative", transform: (text) => `⚹ ${text} ⚹` },

  // Decorative Frames - Elemental Theme
  { name: "Fire Frame", category: "decorative", transform: (text) => `🔥 ${text} 🔥` },
  { name: "Water Frame", category: "decorative", transform: (text) => `💧 ${text} 💧` },
  { name: "Earth Frame", category: "decorative", transform: (text) => `🌍 ${text} 🌍` },
  { name: "Air Frame", category: "decorative", transform: (text) => `💨 ${text} 💨` },
  { name: "Lightning Frame", category: "decorative", transform: (text) => `⚡ ${text} ⚡` },
  { name: "Ice Frame", category: "decorative", transform: (text) => `❄️ ${text} ❄️` },
  { name: "Thunder Frame", category: "decorative", transform: (text) => `⛈️ ${text} ⛈️` },
  { name: "Storm Frame", category: "decorative", transform: (text) => `🌪️ ${text} 🌪️` },

  // Decorative Frames - Runic Theme
  { name: "Runic Frame 1", category: "decorative", transform: (text) => `ᚱ ${text} ᚱ` },
  { name: "Runic Frame 2", category: "decorative", transform: (text) => `ᚦ ${text} ᚦ` },
  { name: "Runic Frame 3", category: "decorative", transform: (text) => `ᚾ ${text} ᚾ` },
  { name: "Runic Frame 4", category: "decorative", transform: (text) => `ᚠ ${text} ᚠ` },
  { name: "Runic Frame 5", category: "decorative", transform: (text) => `ᚢ ${text} ᚢ` },
  { name: "Runic Frame 6", category: "decorative", transform: (text) => `ᚬ ${text} ᚬ` },
  { name: "Runic Frame 7", category: "decorative", transform: (text) => `ᚴ ${text} ᚴ` },
  { name: "Runic Frame 8", category: "decorative", transform: (text) => `ᚼ ${text} ᚼ` },

  // Decorative Frames - Cosmic Theme
  { name: "Star Frame", category: "decorative", transform: (text) => `✦ ${text} ✦` },
  { name: "Galaxy Frame", category: "decorative", transform: (text) => `🌌 ${text} 🌌` },
  { name: "Comet Frame", category: "decorative", transform: (text) => `☄️ ${text} ☄️` },
  { name: "Planet Frame", category: "decorative", transform: (text) => `🪐 ${text} 🪐` },
  { name: "Moon Frame", category: "decorative", transform: (text) => `🌙 ${text} 🌙` },
  { name: "Sun Frame", category: "decorative", transform: (text) => `☀️ ${text} ☀️` },
  { name: "Nebula Frame", category: "decorative", transform: (text) => `🌠 ${text} 🌠` },
  { name: "Constellation Frame", category: "decorative", transform: (text) => `✨ ${text} ✨` },

  // Mathematical Styles
  { name: "Mathematical Bold", category: "mathematical", transform: (text) => text.replace(/[a-zA-Z0-9]/g, (char) => {
    const map: Record<string, string> = {
      'a': '𝐚', 'b': '𝐛', 'c': '𝐜', 'd': '𝐝', 'e': '𝐞', 'f': '𝐟', 'g': '𝐠', 'h': '𝐡', 'i': '𝐢', 'j': '𝐣', 'k': '𝐤', 'l': '𝐥', 'm': '𝐦', 'n': '𝐧', 'o': '𝐨', 'p': '𝐩', 'q': '𝐪', 'r': '𝐫', 's': '𝐬', 't': '𝐭', 'u': '𝐮', 'v': '𝐯', 'w': '𝐰', 'x': '𝐱', 'y': '𝐲', 'z': '𝐳',
      'A': '𝐀', 'B': '𝐁', 'C': '𝐂', 'D': '𝐃', 'E': '𝐄', 'F': '𝐅', 'G': '𝐆', 'H': '𝐇', 'I': '𝐈', 'J': '𝐉', 'K': '𝐊', 'L': '𝐋', 'M': '𝐌', 'N': '𝐍', 'O': '𝐎', 'P': '𝐏', 'Q': '𝐐', 'R': '𝐑', 'S': '𝐒', 'T': '𝐓', 'U': '𝐔', 'V': '𝐕', 'W': '𝐖', 'X': '𝐗', 'Y': '𝐘', 'Z': '𝐙',
      '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒', '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗'
    };
    return map[char] || char;
  })},

  { name: "Mathematical Italic", category: "mathematical", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => {
    const map: Record<string, string> = {
      'a': '𝑎', 'b': '𝑏', 'c': '𝑐', 'd': '𝑑', 'e': '𝑒', 'f': '𝑓', 'g': '𝑔', 'h': 'ℎ', 'i': '𝑖', 'j': '𝑗', 'k': '𝑘', 'l': '𝑙', 'm': '𝑚', 'n': '𝑛', 'o': '𝑜', 'p': '𝑝', 'q': '𝑞', 'r': '𝑟', 's': '𝑠', 't': '𝑡', 'u': '𝑢', 'v': '𝑣', 'w': '𝑤', 'x': '𝑥', 'y': '𝑦', 'z': '𝑧',
      'A': '𝐴', 'B': '𝐵', 'C': '𝐶', 'D': '𝐷', 'E': '𝐸', 'F': '𝐹', 'G': '𝐺', 'H': '𝐻', 'I': '𝐼', 'J': '𝐽', 'K': '𝐾', 'L': '𝐿', 'M': '𝑀', 'N': '𝑁', 'O': '𝑂', 'P': '𝑃', 'Q': '𝑄', 'R': '𝑅', 'S': '𝑆', 'T': '𝑇', 'U': '𝑈', 'V': '𝑉', 'W': '𝑊', 'X': '𝑋', 'Y': '𝑌', 'Z': '𝑍'
    };
    return map[char] || char;
  })},

  { name: "Mathematical Script", category: "mathematical", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => {
    const map: Record<string, string> = {
      'a': '𝒶', 'b': '𝒷', 'c': '𝒸', 'd': '𝒹', 'e': 'ℯ', 'f': '𝒻', 'g': 'ℊ', 'h': '𝒽', 'i': '𝒾', 'j': '𝒿', 'k': '𝓀', 'l': '𝓁', 'm': '𝓂', 'n': '𝓃', 'o': 'ℴ', 'p': '𝓅', 'q': '𝓆', 'r': '𝓇', 's': '𝓈', 't': '𝓉', 'u': '𝓊', 'v': '𝓋', 'w': '𝓌', 'x': '𝓍', 'y': '𝓎', 'z': '𝓏',
      'A': '𝒜', 'B': 'ℬ', 'C': '𝒞', 'D': '𝒟', 'E': 'ℰ', 'F': 'ℱ', 'G': '𝒢', 'H': 'ℋ', 'I': 'ℐ', 'J': '𝒥', 'K': '𝒦', 'L': 'ℒ', 'M': 'ℳ', 'N': '𝒩', 'O': '𝒪', 'P': '𝒫', 'Q': '𝒬', 'R': 'ℛ', 'S': '𝒮', 'T': '𝒯', 'U': '𝒰', 'V': '𝒱', 'W': '𝒲', 'X': '𝒳', 'Y': '𝒴', 'Z': '𝒵'
    };
    return map[char] || char;
  })},

  // Circled and Squared
  { name: "Circled", category: "enclosed", transform: (text) => text.replace(/[a-zA-Z0-9]/g, (char) => {
    const map: Record<string, string> = {
      'a': 'ⓐ', 'b': 'ⓑ', 'c': 'ⓒ', 'd': 'ⓓ', 'e': 'ⓔ', 'f': 'ⓕ', 'g': 'ⓖ', 'h': 'ⓗ', 'i': 'ⓘ', 'j': 'ⓙ', 'k': 'ⓚ', 'l': 'ⓛ', 'm': 'ⓜ', 'n': 'ⓝ', 'o': 'ⓞ', 'p': 'ⓟ', 'q': 'ⓠ', 'r': 'ⓡ', 's': 'ⓢ', 't': 'ⓣ', 'u': 'ⓤ', 'v': 'ⓥ', 'w': 'ⓦ', 'x': 'ⓧ', 'y': 'ⓨ', 'z': 'ⓩ',
      'A': 'Ⓐ', 'B': 'Ⓑ', 'C': 'Ⓒ', 'D': 'Ⓓ', 'E': 'Ⓔ', 'F': 'Ⓕ', 'G': 'Ⓖ', 'H': 'Ⓗ', 'I': 'Ⓘ', 'J': 'Ⓙ', 'K': 'Ⓚ', 'L': 'Ⓛ', 'M': 'Ⓜ', 'N': 'Ⓝ', 'O': 'Ⓞ', 'P': 'Ⓟ', 'Q': 'Ⓠ', 'R': 'Ⓡ', 'S': 'Ⓢ', 'T': 'Ⓣ', 'U': 'Ⓤ', 'V': 'Ⓥ', 'W': 'Ⓦ', 'X': 'Ⓧ', 'Y': 'Ⓨ', 'Z': 'Ⓩ',
      '0': '⓪', '1': '①', '2': '②', '3': '③', '4': '④', '5': '⑤', '6': '⑥', '7': '⑦', '8': '⑧', '9': '⑨'
    };
    return map[char] || char;
  })},

  { name: "Squared", category: "enclosed", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => {
    const map: Record<string, string> = {
      'a': '🄰', 'b': '🄱', 'c': '🄲', 'd': '🄳', 'e': '🄴', 'f': '🄵', 'g': '🄶', 'h': '🄷', 'i': '🄸', 'j': '🄹', 'k': '🄺', 'l': '🄻', 'm': '🄼', 'n': '🄽', 'o': '🄾', 'p': '🄿', 'q': '🅀', 'r': '🅁', 's': '🅂', 't': '🅃', 'u': '🅄', 'v': '🅅', 'w': '🅆', 'x': '🅇', 'y': '🅈', 'z': '🅉',
      'A': '🄰', 'B': '🄱', 'C': '🄲', 'D': '🄳', 'E': '🄴', 'F': '🄵', 'G': '🄶', 'H': '🄷', 'I': '🄸', 'J': '🄹', 'K': '🄺', 'L': '🄻', 'M': '🄼', 'N': '🄽', 'O': '🄾', 'P': '🄿', 'Q': '🅀', 'R': '🅁', 'S': '🅂', 'T': '🅃', 'U': '🅄', 'V': '🅅', 'W': '🅆', 'X': '🅇', 'Y': '🅈', 'Z': '🅉'
    };
    return map[char] || char;
  })},

  // Brackets and Frames
  { name: "Parentheses", category: "brackets", transform: (text) => `（${text}）` },
  { name: "Square Brackets", category: "brackets", transform: (text) => `［${text}］` },
  { name: "Curly Brackets", category: "brackets", transform: (text) => `｛${text}｝` },
  { name: "Angle Brackets", category: "brackets", transform: (text) => `⟨${text}⟩` },
  { name: "Double Brackets", category: "brackets", transform: (text) => `【${text}】` },
  { name: "Corner Brackets", category: "brackets", transform: (text) => `「${text}」` },
  { name: "Tortoise Brackets", category: "brackets", transform: (text) => `〔${text}〕` },
  { name: "Lens Brackets", category: "brackets", transform: (text) => `〖${text}〗` },

  // Strikethrough and Underline
  { name: "Strikethrough", category: "text-style", transform: (text) => text.split('').map(char => char + '\u0336').join('') },
  { name: "Underline", category: "text-style", transform: (text) => text.split('').map(char => char + '\u0332').join('') },
  { name: "Double Strikethrough", category: "text-style", transform: (text) => text.split('').map(char => char + '\u0336\u0336').join('') },
  { name: "Overline", category: "text-style", transform: (text) => text.split('').map(char => char + '\u0305').join('') },

  // Fullwidth
  { name: "Fullwidth", category: "width", transform: (text) => text.replace(/[!-~]/g, (char) => String.fromCharCode(char.charCodeAt(0) + 65248)) },

  // Upside Down
  { name: "Upside Down", category: "flipped", transform: (text) => {
    const map: Record<string, string> = {
      'a': 'ɐ', 'b': 'q', 'c': 'ɔ', 'd': 'p', 'e': 'ǝ', 'f': 'ɟ', 'g': 'ƃ', 'h': 'ɥ', 'i': '!', 'j': 'ɾ', 'k': 'ʞ', 'l': 'l', 'm': 'ɯ', 'n': 'u', 'o': 'o', 'p': 'd', 'q': 'b', 'r': 'ɹ', 's': 's', 't': 'ʇ', 'u': 'n', 'v': 'ʌ', 'w': 'ʍ', 'x': 'x', 'y': 'ʎ', 'z': 'z',
      'A': '∀', 'B': 'ᗺ', 'C': 'Ɔ', 'D': 'ᗡ', 'E': 'Ǝ', 'F': 'ᖴ', 'G': 'פ', 'H': 'H', 'I': 'I', 'J': 'ſ', 'K': 'ʞ', 'L': '˥', 'M': 'W', 'N': 'N', 'O': 'O', 'P': 'Ԁ', 'Q': 'Q', 'R': 'ᴿ', 'S': 'S', 'T': '┴', 'U': '∩', 'V': 'Λ', 'W': 'M', 'X': 'X', 'Y': '⅄', 'Z': 'Z',
      '0': '0', '1': 'Ɩ', '2': 'ᄅ', '3': 'Ɛ', '4': 'ㄣ', '5': 'ϛ', '6': '9', '7': 'ㄥ', '8': '8', '9': '6'
    };
    return text.split('').map(char => map[char] || char).reverse().join('');
  }},

  // Emoji Styles
  { name: "Heart Style", category: "emoji", transform: (text) => `💖${text}💖` },
  { name: "Star Style", category: "emoji", transform: (text) => `⭐${text}⭐` },
  { name: "Fire Style", category: "emoji", transform: (text) => `🔥${text}🔥` },
  { name: "Lightning Style", category: "emoji", transform: (text) => `⚡${text}⚡` },
  { name: "Diamond Style", category: "emoji", transform: (text) => `💎${text}💎` },
  { name: "Unicorn Style", category: "emoji", transform: (text) => `🦄${text}🦄` },
  { name: "Rainbow Style", category: "emoji", transform: (text) => `🌈${text}🌈` }
];

export default function FancyTextGenerator() {
  const [inputText, setInputText] = useState("Hello World");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const copyToClipboard = async (text: string, styleName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${styleName} text copied to clipboard`,
        duration: 2000,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const categories = [...new Set(FONT_STYLES.map(style => style.category))];
  
  const filteredStyles = FONT_STYLES.filter(style => {
    const matchesCategory = selectedCategory === "all" || style.category === selectedCategory;
    const matchesSearch = style.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          style.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Fancy Text Generator
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Transform your text with 100+ Unicode styles, decorative frames, and font variations
        </p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Enter your text
            </label>
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your text here..."
              className="text-base"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search styles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {inputText && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Generated Styles
            </h2>
            <Badge variant="secondary" className="text-sm">
              {filteredStyles.length} styles
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
            {filteredStyles.map((style, index) => {
              const convertedText = style.transform(inputText);
              return (
                <Card 
                  key={`${style.name}-${style.category}-${index}`} 
                  className="group hover:shadow-md transition-all duration-200 border-l-2 border-l-blue-500 hover:border-l-purple-500"
                >
                  <CardContent className="p-3 sm:p-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-1">
                          <Badge variant="outline" className="text-xs font-medium">
                            {style.name}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {style.category}
                          </Badge>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(convertedText, style.name)}
                          className="flex-shrink-0 group-hover:bg-blue-50 group-hover:border-blue-300 dark:group-hover:bg-blue-900/20 transition-colors"
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                      <div className="text-sm sm:text-base font-mono break-all leading-relaxed p-2 bg-gray-50 dark:bg-gray-800 rounded-md border">
                        {convertedText}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {!inputText && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              Enter some text above to see all the fancy styles!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}