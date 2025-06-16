import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FontStyle {
  name: string;
  category: string;
  transform: (text: string) => string;
}

const SPECIAL_SYMBOLS = [
  "ツ", "么", "〆", "®", "彡", "×", "ॐ", "Ł", "٭", "私", "刁", "Ø", "ジ", "・", "「」", "卍", "文", "《", "气", "Ð", "シ", "『』", "丨", "廴", "一", "父", "神", "人", "ｱ", "ロ", "〖〗", "요", "۝", "๔", "๏", "卄", "米", "īlī", "女", "ゞ", "⦇⦈", "冬", "れ", "【】", "多", "々", "乛", "乄", "乡", "の", "乇", "ɧ", "く", "》", "爪", "失", "亥", "王", "乙", "๖", "ム", "'", "厄", "ภ", "丶", "ズ", "个", "연", "帝", "レ", "〘〙", "≋", "亗", "ฬ", "ʚ", "๛", "义", "サ"
];

const EMOJI_SYMBOLS = [
  "😘", "🥰", "😍", "😊", "✨", "🥺", "💀", "💅", "🔥", "🐐", "😂", "❤️", "🤣", "👍", "😭", "🙏", "🧢", "👀", "🕹️", "🎮", "🧠", "🦋", "🤌", "🫡", "🫢", "🤭", "🫠", "🫤", "🤨", "🙃"
];

const FONT_STYLES: FontStyle[] = [
  // === COMPLEX DECORATIVE FRAMES (TOP PRIORITY) ===
  // Ultimate Gaming Legends
  { name: "Joker Style", category: "decorative-premium", transform: (text) => `꧁༒☬☠${text}☠︎☬༒꧂` },
  { name: "Lucky Style", category: "decorative-premium", transform: (text) => `꧁༺${text}༻꧂` },
  { name: "Death Knight", category: "decorative-premium", transform: (text) => `꧁༒☠︎${text}☠︎༒꧂` },
  { name: "Crown Royal", category: "decorative-premium", transform: (text) => `꧁♛◊${text}◊♛꧂` },
  { name: "Shadow Warrior", category: "decorative-premium", transform: (text) => `꧁◈⚔${text}⚔◈꧂` },
  { name: "Fire Dragon", category: "decorative-premium", transform: (text) => `꧁☬⚔${text}⚔☬꧂` },
  { name: "Lightning Storm", category: "decorative-premium", transform: (text) => `꧁⚡☬${text}☬⚡꧂` },
  { name: "Mystical Frame", category: "decorative-premium", transform: (text) => `꧁☬⚡︎${text}⚡︎☬꧂` },
  { name: "Dark Magic", category: "decorative-premium", transform: (text) => `꧁◈☬༒${text}༒☬◈꧂` },
  { name: "Ancient Runes", category: "decorative-premium", transform: (text) => `꧁ᚱᚢᚾᛖ${text}ᚱᚢᚾᛖ꧂` },
  
  // Royal Collection
  { name: "Demon Lord", category: "decorative-premium", transform: (text) => `꧁༺☠︎⚡${text}⚡☠︎༻꧂` },
  { name: "Angel Wings", category: "decorative-premium", transform: (text) => `꧁༒☪☬${text}☬☪༒꧂` },
  { name: "Skull Crown", category: "decorative-premium", transform: (text) => `꧁☠︎♛⚔${text}⚔♛☠︎꧂` },
  { name: "Gothic Cross", category: "decorative-premium", transform: (text) => `꧁✠☬†${text}†☬✠꧂` },
  { name: "Vampire Lord", category: "decorative-premium", transform: (text) => `꧁༒☬☠${text}☠☬༒꧂` },
  { name: "Phoenix Fire", category: "decorative-premium", transform: (text) => `꧁⚡☬✨${text}✨☬⚡꧂` },
  { name: "Thunder God", category: "decorative-premium", transform: (text) => `꧁⚡♛⚡${text}⚡♛⚡꧂` },
  { name: "Blood Moon", category: "decorative-premium", transform: (text) => `꧁☾☬☠︎${text}☠︎☬☾꧂` },
  { name: "Crystal Sword", category: "decorative-premium", transform: (text) => `꧁◆⚔◆${text}◆⚔◆꧂` },
  { name: "Frost King", category: "decorative-premium", transform: (text) => `꧁❅♛❅${text}❅♛❅꧂` },
  
  // Ultimate Warriors
  { name: "Shadow Blade", category: "decorative-premium", transform: (text) => `꧁◈⚔︎⚡${text}⚡⚔︎◈꧂` },
  { name: "Divine Light", category: "decorative-premium", transform: (text) => `꧁✨☪✨${text}✨☪✨꧂` },
  { name: "War Chief", category: "decorative-premium", transform: (text) => `꧁⚔♛⚔${text}⚔♛⚔꧂` },
  { name: "Mystic Portal", category: "decorative-premium", transform: (text) => `꧁◈✨◈${text}◈✨◈꧂` },
  { name: "Dragon Slayer", category: "decorative-premium", transform: (text) => `꧁⚔☬⚡${text}⚡☬⚔꧂` },
  { name: "Void Walker", category: "decorative-premium", transform: (text) => `꧁◉☬◉${text}◉☬◉꧂` },
  { name: "Star Guardian", category: "decorative-premium", transform: (text) => `꧁✦✨✦${text}✦✨✦꧂` },
  { name: "Shadow Emperor", category: "decorative-premium", transform: (text) => `꧁♛◈♛${text}♛◈♛꧂` },
  { name: "Fire Serpent", category: "decorative-premium", transform: (text) => `꧁☬⚡☬${text}☬⚡☬꧂` },
  { name: "Ice Phoenix", category: "decorative-premium", transform: (text) => `꧁❅◆❅${text}❅◆❅꧂` },
  
  // NEW COMPLEX FRAMES
  { name: "Chaos Master", category: "decorative-premium", transform: (text) => `꧁☬⚡༒${text}༒⚡☬꧂` },
  { name: "Eternal Flame", category: "decorative-premium", transform: (text) => `꧁⚡☬♛${text}♛☬⚡꧂` },
  { name: "Soul Reaper", category: "decorative-premium", transform: (text) => `꧁☠☬☠︎${text}☠︎☬☠꧂` },
  { name: "Cosmic Emperor", category: "decorative-premium", transform: (text) => `꧁✦♛✦${text}✦♛✦꧂` },
  { name: "Storm Bringer", category: "decorative-premium", transform: (text) => `꧁⚡☬⚡${text}⚡☬⚡꧂` },
  { name: "Ice Emperor", category: "decorative-premium", transform: (text) => `꧁❅♛◆${text}◆♛❅꧂` },
  { name: "Fire Demon", category: "decorative-premium", transform: (text) => `꧁☬༒⚡${text}⚡༒☬꧂` },
  { name: "Galaxy Lord", category: "decorative-premium", transform: (text) => `꧁✦✨✦${text}✦✨✦꧂` },
  { name: "Blood Warrior", category: "decorative-premium", transform: (text) => `꧁⚔☬⚡${text}⚡☬⚔꧂` },
  { name: "Cosmic Mage", category: "decorative-premium", transform: (text) => `꧁✦✨◈${text}◈✨✦꧂` },
  { name: "Thunder Warrior", category: "decorative-premium", transform: (text) => `꧁⚡⚔☬${text}☬⚔⚡꧂` },
  { name: "Dark Sorcerer", category: "decorative-premium", transform: (text) => `꧁☾☬◈${text}◈☬☾꧂` },
  { name: "Flame Guardian", category: "decorative-premium", transform: (text) => `꧁☬♛⚔${text}⚔♛☬꧂` },
  { name: "Night Hunter", category: "decorative-premium", transform: (text) => `꧁☾⚡☬${text}☬⚡☾꧂` },
  { name: "Crystal Mage", category: "decorative-premium", transform: (text) => `꧁◆✨◆${text}◆✨◆꧂` },
  { name: "Storm King", category: "decorative-premium", transform: (text) => `꧁♛⚡♛${text}♛⚡♛꧂` },
  { name: "Shadow Hunter", category: "decorative-premium", transform: (text) => `꧁☾☬◈${text}◈☬☾꧂` },
  { name: "Inferno Master", category: "decorative-premium", transform: (text) => `꧁☬༒☠${text}☠༒☬꧂` },
  { name: "Arctic Wolf", category: "decorative-premium", transform: (text) => `꧁❅⚡❅${text}❅⚡❅꧂` },
  { name: "Phantom Knight", category: "decorative-premium", transform: (text) => `꧁◈⚔♛${text}♛⚔◈꧂` },
  { name: "Celestial Guard", category: "decorative-premium", transform: (text) => `꧁✦◈✨${text}✨◈✦꧂` },

  // === ADDITIONAL COMPLEX DECORATIVE FRAMES ===
  { name: "Eternal Crown", category: "decorative-premium", transform: (text) => `꧁◆♛◇${text}◇♛◆꧂` },
  { name: "Sacred Runes", category: "decorative-premium", transform: (text) => `꧁ᚦᚱᚢᚾ${text}ᚾᚢᚱᚦ꧂` },
  { name: "Mystic Shield", category: "decorative-premium", transform: (text) => `꧁◈⚔◈${text}◈⚔◈꧂` },
  { name: "Ancient Blade", category: "decorative-premium", transform: (text) => `꧁⚔☬⚔${text}⚔☬⚔꧂` },
  { name: "Royal Crown", category: "decorative-premium", transform: (text) => `꧁♛◆♛${text}♛◆♛꧂` },
  { name: "Dark Portal", category: "decorative-premium", transform: (text) => `꧁◉☾◉${text}◉☾◉꧂` },
  { name: "Storm Crown", category: "decorative-premium", transform: (text) => `꧁⚡♛⚡${text}⚡♛⚡꧂` },
  { name: "Crystal Frame", category: "decorative-premium", transform: (text) => `꧁◇✧◇${text}◇✧◇꧂` },
  { name: "Shadow Cross", category: "decorative-premium", transform: (text) => `꧁✠☬✠${text}✠☬✠꧂` },
  { name: "Divine Wings", category: "decorative-premium", transform: (text) => `꧁✧☪✧${text}✧☪✧꧂` },
  { name: "Frost Crown", category: "decorative-premium", transform: (text) => `꧁❅♛❅${text}❅♛❅꧂` },
  { name: "Thunder Blade", category: "decorative-premium", transform: (text) => `꧁⚡⚔⚡${text}⚡⚔⚡꧂` },
  { name: "Mystic Crown", category: "decorative-premium", transform: (text) => `꧁◈♛◈${text}◈♛◈꧂` },
  { name: "Sacred Cross", category: "decorative-premium", transform: (text) => `꧁†☬†${text}†☬†꧂` },
  { name: "Royal Sword", category: "decorative-premium", transform: (text) => `꧁♛⚔♛${text}♛⚔♛꧂` },
  { name: "Dark Crown", category: "decorative-premium", transform: (text) => `꧁☾♛☾${text}☾♛☾꧂` },
  { name: "Crystal Blade", category: "decorative-premium", transform: (text) => `꧁◇⚔◇${text}◇⚔◇꧂` },
  { name: "Storm Shield", category: "decorative-premium", transform: (text) => `꧁⚡◈⚡${text}⚡◈⚡꧂` },
  { name: "Ancient Crown", category: "decorative-premium", transform: (text) => `꧁ᚱ♛ᚱ${text}ᚱ♛ᚱ꧂` },
  { name: "Void Crown", category: "decorative-premium", transform: (text) => `꧁◉♛◉${text}◉♛◉꧂` },
  { name: "Sacred Shield", category: "decorative-premium", transform: (text) => `꧁☬◈☬${text}☬◈☬꧂` },
  { name: "Thunder Crown", category: "decorative-premium", transform: (text) => `꧁⚡♛⚡${text}⚡♛⚡꧂` },
  { name: "Mystic Blade", category: "decorative-premium", transform: (text) => `꧁◈⚔◈${text}◈⚔◈꧂` },
  { name: "Divine Crown", category: "decorative-premium", transform: (text) => `꧁✧♛✧${text}✧♛✧꧂` },
  { name: "Shadow Shield", category: "decorative-premium", transform: (text) => `꧁☾◈☾${text}☾◈☾꧂` },
  { name: "Crystal Crown", category: "decorative-premium", transform: (text) => `꧁◇♛◇${text}◇♛◇꧂` },
  { name: "Royal Shield", category: "decorative-premium", transform: (text) => `꧁♛◈♛${text}♛◈♛꧂` },
  { name: "Storm Blade", category: "decorative-premium", transform: (text) => `꧁⚡⚔⚡${text}⚡⚔⚡꧂` },
  { name: "Ancient Shield", category: "decorative-premium", transform: (text) => `꧁ᚱ◈ᚱ${text}ᚱ◈ᚱ꧂` },
  { name: "Void Shield", category: "decorative-premium", transform: (text) => `꧁◉◈◉${text}◉◈◉꧂` },
  { name: "Sacred Blade", category: "decorative-premium", transform: (text) => `꧁☬⚔☬${text}☬⚔☬꧂` },
  { name: "Thunder Shield", category: "decorative-premium", transform: (text) => `꧁⚡◈⚡${text}⚡◈⚡꧂` },
  { name: "Mystic Crown Alt", category: "decorative-premium", transform: (text) => `꧁◈♛◈${text}◈♛◈꧂` },
  { name: "Divine Shield", category: "decorative-premium", transform: (text) => `꧁✧◈✧${text}✧◈✧꧂` },
  { name: "Shadow Blade", category: "decorative-premium", transform: (text) => `꧁☾⚔☾${text}☾⚔☾꧂` },
  { name: "Crystal Shield", category: "decorative-premium", transform: (text) => `꧁◇◈◇${text}◇◈◇꧂` },
  { name: "Royal Blade", category: "decorative-premium", transform: (text) => `꧁♛⚔♛${text}♛⚔♛꧂` },
  { name: "Storm Crown Alt", category: "decorative-premium", transform: (text) => `꧁⚡♛⚡${text}⚡♛⚡꧂` },
  { name: "Ancient Blade Alt", category: "decorative-premium", transform: (text) => `꧁ᚱ⚔ᚱ${text}ᚱ⚔ᚱ꧂` },
  { name: "Void Blade", category: "decorative-premium", transform: (text) => `꧁◉⚔◉${text}◉⚔◉꧂` },
  { name: "Runic Frame", category: "decorative-premium", transform: (text) => `꧁ᚾᚱᚢᚦ${text}ᚦᚢᚱᚾ꧂` },
  { name: "Gothic Frame", category: "decorative-premium", transform: (text) => `꧁☬†☬${text}☬†☬꧂` },
  { name: "Celtic Frame", category: "decorative-premium", transform: (text) => `꧁◈⚔◈${text}◈⚔◈꧂` },
  { name: "Nordic Frame", category: "decorative-premium", transform: (text) => `꧁ᚱᚦᚱ${text}ᚱᚦᚱ꧂` },
  { name: "Imperial Frame", category: "decorative-premium", transform: (text) => `꧁♛◆♛${text}♛◆♛꧂` },
  { name: "Astral Frame", category: "decorative-premium", transform: (text) => `꧁✦◈✦${text}✦◈✦꧂` },
  { name: "Lunar Frame", category: "decorative-premium", transform: (text) => `꧁☾◇☾${text}☾◇☾꧂` },
  { name: "Solar Frame", category: "decorative-premium", transform: (text) => `꧁☬✧☬${text}☬✧☬꧂` },
  { name: "Stellar Frame", category: "decorative-premium", transform: (text) => `꧁✦☬✦${text}✦☬✦꧂` },
  { name: "Cosmic Frame", category: "decorative-premium", transform: (text) => `꧁◈✦◈${text}◈✦◈꧂` },
  { name: "Ethereal Frame", category: "decorative-premium", transform: (text) => `꧁✧☾✧${text}✧☾✧꧂` },
  { name: "Celestial Frame", category: "decorative-premium", transform: (text) => `꧁✦◇✦${text}✦◇✦꧂` },

  // === REGULAR UNICODE FONTS (LOWER PRIORITY) ===
  // Mathematical Bold
  { name: "Mathematical Bold", category: "bold", transform: (text) => text.replace(/[a-zA-Z0-9]/g, (char) => {
    const map: Record<string, string> = {
      'a': '𝐚', 'b': '𝐛', 'c': '𝐜', 'd': '𝐝', 'e': '𝐞', 'f': '𝐟', 'g': '𝐠', 'h': '𝐡', 'i': '𝐢', 'j': '𝐣', 'k': '𝐤', 'l': '𝐥', 'm': '𝐦', 'n': '𝐧', 'o': '𝐨', 'p': '𝐩', 'q': '𝐪', 'r': '𝐫', 's': '𝐬', 't': '𝐭', 'u': '𝐮', 'v': '𝐯', 'w': '𝐰', 'x': '𝐱', 'y': '𝐲', 'z': '𝐳',
      'A': '𝐀', 'B': '𝐁', 'C': '𝐂', 'D': '𝐃', 'E': '𝐄', 'F': '𝐅', 'G': '𝐆', 'H': '𝐇', 'I': '𝐈', 'J': '𝐉', 'K': '𝐊', 'L': '𝐋', 'M': '𝐌', 'N': '𝐍', 'O': '𝐎', 'P': '𝐏', 'Q': '𝐐', 'R': '𝐑', 'S': '𝐒', 'T': '𝐓', 'U': '𝐔', 'V': '𝐕', 'W': '𝐖', 'X': '𝐗', 'Y': '𝐘', 'Z': '𝐙',
      '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒', '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗'
    };
    return map[char] || char;
  })},

  // Mathematical Italic
  { name: "Mathematical Italic", category: "italic", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => {
    const map: Record<string, string> = {
      'a': '𝑎', 'b': '𝑏', 'c': '𝑐', 'd': '𝑑', 'e': '𝑒', 'f': '𝑓', 'g': '𝑔', 'h': 'ℎ', 'i': '𝑖', 'j': '𝑗', 'k': '𝑘', 'l': '𝑙', 'm': '𝑚', 'n': '𝑛', 'o': '𝑜', 'p': '𝑝', 'q': '𝑞', 'r': '𝑟', 's': '𝑠', 't': '𝑡', 'u': '𝑢', 'v': '𝑣', 'w': '𝑤', 'x': '𝑥', 'y': '𝑦', 'z': '𝑧',
      'A': '𝐴', 'B': '𝐵', 'C': '𝐶', 'D': '𝐷', 'E': '𝐸', 'F': '𝐹', 'G': '𝐺', 'H': '𝐻', 'I': '𝐼', 'J': '𝐽', 'K': '𝐾', 'L': '𝐿', 'M': '𝑀', 'N': '𝑁', 'O': '𝑂', 'P': '𝑃', 'Q': '𝑄', 'R': '𝑅', 'S': '𝑆', 'T': '𝑇', 'U': '𝑈', 'V': '𝑉', 'W': '𝑊', 'X': '𝑋', 'Y': '𝑌', 'Z': '𝑍'
    };
    return map[char] || char;
  })},

  // Mathematical Bold Italic
  { name: "Mathematical Bold Italic", category: "bold", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => {
    const map: Record<string, string> = {
      'a': '𝒂', 'b': '𝒃', 'c': '𝒄', 'd': '𝒅', 'e': '𝒆', 'f': '𝒇', 'g': '𝒈', 'h': '𝒉', 'i': '𝒊', 'j': '𝒋', 'k': '𝒌', 'l': '𝒍', 'm': '𝒎', 'n': '𝒏', 'o': '𝒐', 'p': '𝒑', 'q': '𝒒', 'r': '𝒓', 's': '𝒔', 't': '𝒕', 'u': '𝒖', 'v': '𝒗', 'w': '𝒘', 'x': '𝒙', 'y': '𝒚', 'z': '𝒛',
      'A': '𝑨', 'B': '𝑩', 'C': '𝑪', 'D': '𝑫', 'E': '𝑬', 'F': '𝑭', 'G': '𝑮', 'H': '𝑯', 'I': '𝑰', 'J': '𝑱', 'K': '𝑲', 'L': '𝑳', 'M': '𝑴', 'N': '𝑵', 'O': '𝑶', 'P': '𝑷', 'Q': '𝑸', 'R': '𝑹', 'S': '𝑺', 'T': '𝑻', 'U': '𝑼', 'V': '𝑽', 'W': '𝑾', 'X': '𝑿', 'Y': '𝒀', 'Z': '𝒁'
    };
    return map[char] || char;
  })},

  // Mathematical Script
  { name: "Mathematical Script", category: "cursive", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => {
    const map: Record<string, string> = {
      'a': '𝒶', 'b': '𝒷', 'c': '𝒸', 'd': '𝒹', 'e': 'ℯ', 'f': '𝒻', 'g': 'ℊ', 'h': '𝒽', 'i': '𝒾', 'j': '𝒿', 'k': '𝓀', 'l': '𝓁', 'm': '𝓂', 'n': '𝓃', 'o': 'ℴ', 'p': '𝓅', 'q': '𝓆', 'r': '𝓇', 's': '𝓈', 't': '𝓉', 'u': '𝓊', 'v': '𝓋', 'w': '𝓌', 'x': '𝓍', 'y': '𝓎', 'z': '𝓏',
      'A': '𝒜', 'B': 'ℬ', 'C': '𝒞', 'D': '𝒟', 'E': 'ℰ', 'F': 'ℱ', 'G': '𝒢', 'H': 'ℋ', 'I': 'ℐ', 'J': '𝒥', 'K': '𝒦', 'L': 'ℒ', 'M': 'ℳ', 'N': '𝒩', 'O': '𝒪', 'P': '𝒫', 'Q': '𝒬', 'R': 'ℛ', 'S': '𝒮', 'T': '𝒯', 'U': '𝒰', 'V': '𝒱', 'W': '𝒲', 'X': '𝒳', 'Y': '𝒴', 'Z': '𝒵'
    };
    return map[char] || char;
  })},

  // Mathematical Script Bold
  { name: "Mathematical Script Bold", category: "cursive", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => {
    const map: Record<string, string> = {
      'a': '𝓪', 'b': '𝓫', 'c': '𝓬', 'd': '𝓭', 'e': '𝓮', 'f': '𝓯', 'g': '𝓰', 'h': '𝓱', 'i': '𝓲', 'j': '𝓳', 'k': '𝓴', 'l': '𝓵', 'm': '𝓶', 'n': '𝓷', 'o': '𝓸', 'p': '𝓹', 'q': '𝓺', 'r': '𝓻', 's': '𝓼', 't': '𝓽', 'u': '𝓾', 'v': '𝓿', 'w': '𝔀', 'x': '𝔁', 'y': '𝔂', 'z': '𝔃',
      'A': '𝓐', 'B': '𝓑', 'C': '𝓒', 'D': '𝓓', 'E': '𝓔', 'F': '𝓕', 'G': '𝓖', 'H': '𝓗', 'I': '𝓘', 'J': '𝓙', 'K': '𝓚', 'L': '𝓛', 'M': '𝓜', 'N': '𝓝', 'O': '𝓞', 'P': '𝓟', 'Q': '𝓠', 'R': '𝓡', 'S': '𝓢', 'T': '𝓣', 'U': '𝓤', 'V': '𝓥', 'W': '𝓦', 'X': '𝓧', 'Y': '𝓨', 'Z': '𝓩'
    };
    return map[char] || char;
  })},

  // Mathematical Fraktur
  { name: "Mathematical Fraktur", category: "gothic", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => {
    const map: Record<string, string> = {
      'a': '𝔞', 'b': '𝔟', 'c': '𝔠', 'd': '𝔡', 'e': '𝔢', 'f': '𝔣', 'g': '𝔤', 'h': '𝔥', 'i': '𝔦', 'j': '𝔧', 'k': '𝔨', 'l': '𝔩', 'm': '𝔪', 'n': '𝔫', 'o': '𝔬', 'p': '𝔭', 'q': '𝔮', 'r': '𝔯', 's': '𝔰', 't': '𝔱', 'u': '𝔲', 'v': '𝔳', 'w': '𝔴', 'x': '𝔵', 'y': '𝔶', 'z': '𝔷',
      'A': '𝔄', 'B': '𝔅', 'C': 'ℭ', 'D': '𝔇', 'E': '𝔈', 'F': '𝔉', 'G': '𝔊', 'H': 'ℌ', 'I': 'ℑ', 'J': '𝔍', 'K': '𝔎', 'L': '𝔏', 'M': '𝔐', 'N': '𝔑', 'O': '𝔒', 'P': '𝔓', 'Q': '𝔔', 'R': 'ℜ', 'S': '𝔖', 'T': '𝔗', 'U': '𝔘', 'V': '𝔙', 'W': '𝔚', 'X': '𝔛', 'Y': '𝔜', 'Z': 'ℨ'
    };
    return map[char] || char;
  })},

  // Mathematical Fraktur Bold
  { name: "Mathematical Fraktur Bold", category: "gothic", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => {
    const map: Record<string, string> = {
      'a': '𝖆', 'b': '𝖇', 'c': '𝖈', 'd': '𝖉', 'e': '𝖊', 'f': '𝖋', 'g': '𝖌', 'h': '𝖍', 'i': '𝖎', 'j': '𝖏', 'k': '𝖐', 'l': '𝖑', 'm': '𝖒', 'n': '𝖓', 'o': '𝖔', 'p': '𝖕', 'q': '𝖖', 'r': '𝖗', 's': '𝖘', 't': '𝖙', 'u': '𝖚', 'v': '𝖛', 'w': '𝖜', 'x': '𝖝', 'y': '𝖞', 'z': '𝖟',
      'A': '𝕬', 'B': '𝕭', 'C': '𝕮', 'D': '𝕯', 'E': '𝕰', 'F': '𝕱', 'G': '𝕲', 'H': '𝕳', 'I': '𝕴', 'J': '𝕵', 'K': '𝕶', 'L': '𝕷', 'M': '𝕸', 'N': '𝕹', 'O': '𝕺', 'P': '𝕻', 'Q': '𝕼', 'R': '𝕽', 'S': '𝕾', 'T': '𝕿', 'U': '𝖀', 'V': '𝖁', 'W': '𝖂', 'X': '𝖃', 'Y': '𝖄', 'Z': '𝖅'
    };
    return map[char] || char;
  })},

  // Mathematical Double-struck
  { name: "Mathematical Double-struck", category: "special", transform: (text) => text.replace(/[a-zA-Z0-9]/g, (char) => {
    const map: Record<string, string> = {
      'a': '𝕒', 'b': '𝕓', 'c': '𝕔', 'd': '𝕕', 'e': '𝕖', 'f': '𝕗', 'g': '𝕘', 'h': '𝕙', 'i': '𝕚', 'j': '𝕛', 'k': '𝕜', 'l': '𝕝', 'm': '𝕞', 'n': '𝕟', 'o': '𝕠', 'p': '𝕡', 'q': '𝕢', 'r': '𝕣', 's': '𝕤', 't': '𝕥', 'u': '𝕦', 'v': '𝕧', 'w': '𝕨', 'x': '𝕩', 'y': '𝕪', 'z': '𝕫',
      'A': '𝔸', 'B': '𝔹', 'C': 'ℂ', 'D': '𝔻', 'E': '𝔼', 'F': '𝔽', 'G': '𝔾', 'H': 'ℍ', 'I': '𝕀', 'J': '𝕁', 'K': '𝕂', 'L': '𝕃', 'M': '𝕄', 'N': 'ℕ', 'O': '𝕆', 'P': 'ℙ', 'Q': 'ℚ', 'R': 'ℝ', 'S': '𝕊', 'T': '𝕋', 'U': '𝕌', 'V': '𝕍', 'W': '𝕎', 'X': '𝕏', 'Y': '𝕐', 'Z': 'ℤ',
      '0': '𝟘', '1': '𝟙', '2': '𝟚', '3': '𝟛', '4': '𝟜', '5': '𝟝', '6': '𝟞', '7': '𝟟', '8': '𝟠', '9': '𝟡'
    };
    return map[char] || char;
  })},

  // Mathematical Sans-serif
  { name: "Mathematical Sans-serif", category: "sans", transform: (text) => text.replace(/[a-zA-Z0-9]/g, (char) => {
    const map: Record<string, string> = {
      'a': '𝖺', 'b': '𝖻', 'c': '𝖼', 'd': '𝖽', 'e': '𝖾', 'f': '𝖿', 'g': '𝗀', 'h': '𝗁', 'i': '𝗂', 'j': '𝗃', 'k': '𝗄', 'l': '𝗅', 'm': '𝗆', 'n': '𝗇', 'o': '𝗈', 'p': '𝗉', 'q': '𝗊', 'r': '𝗋', 's': '𝗌', 't': '𝗍', 'u': '𝗎', 'v': '𝗏', 'w': '𝗐', 'x': '𝗑', 'y': '𝗒', 'z': '𝗓',
      'A': '𝖠', 'B': '𝖡', 'C': '𝖢', 'D': '𝖣', 'E': '𝖤', 'F': '𝖥', 'G': '𝖦', 'H': '𝖧', 'I': '𝖨', 'J': '𝖩', 'K': '𝖪', 'L': '𝖫', 'M': '𝖬', 'N': '𝖭', 'O': '𝖮', 'P': '𝖯', 'Q': '𝖰', 'R': '𝖱', 'S': '𝖲', 'T': '𝖳', 'U': '𝖴', 'V': '𝖵', 'W': '𝖶', 'X': '𝖷', 'Y': '𝖸', 'Z': '𝖹',
      '0': '𝟢', '1': '𝟣', '2': '𝟤', '3': '𝟥', '4': '𝟦', '5': '𝟧', '6': '𝟨', '7': '𝟩', '8': '𝟪', '9': '𝟫'
    };
    return map[char] || char;
  })},

  // Mathematical Sans-serif Bold
  { name: "Mathematical Sans-serif Bold", category: "sans", transform: (text) => text.replace(/[a-zA-Z0-9]/g, (char) => {
    const map: Record<string, string> = {
      'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵', 'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',
      'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛', 'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',
      '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵'
    };
    return map[char] || char;
  })},

  // Mathematical Sans-serif Italic
  { name: "Mathematical Sans-serif Italic", category: "sans", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => {
    const map: Record<string, string> = {
      'a': '𝘢', 'b': '𝘣', 'c': '𝘤', 'd': '𝘥', 'e': '𝘦', 'f': '𝘧', 'g': '𝘨', 'h': '𝘩', 'i': '𝘪', 'j': '𝘫', 'k': '𝘬', 'l': '𝘭', 'm': '𝘮', 'n': '𝘯', 'o': '𝘰', 'p': '𝘱', 'q': '𝘲', 'r': '𝘳', 's': '𝘴', 't': '𝘵', 'u': '𝘶', 'v': '𝘷', 'w': '𝘸', 'x': '𝘹', 'y': '𝘺', 'z': '𝘻',
      'A': '𝘈', 'B': '𝘉', 'C': '𝘊', 'D': '𝘋', 'E': '𝘌', 'F': '𝘍', 'G': '𝘎', 'H': '𝘏', 'I': '𝘐', 'J': '𝘑', 'K': '𝘒', 'L': '𝘓', 'M': '𝘔', 'N': '𝘕', 'O': '𝘖', 'P': '𝘗', 'Q': '𝘘', 'R': '𝘙', 'S': '𝘚', 'T': '𝘛', 'U': '𝘜', 'V': '𝘝', 'W': '𝘞', 'X': '𝘟', 'Y': '𝘠', 'Z': '𝘡'
    };
    return map[char] || char;
  })},

  // Mathematical Sans-serif Bold Italic
  { name: "Mathematical Sans-serif Bold Italic", category: "sans", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => {
    const map: Record<string, string> = {
      'a': '𝙖', 'b': '𝙗', 'c': '𝙘', 'd': '𝙙', 'e': '𝙚', 'f': '𝙛', 'g': '𝙜', 'h': '𝙝', 'i': '𝙞', 'j': '𝙟', 'k': '𝙠', 'l': '𝙡', 'm': '𝙢', 'n': '𝙣', 'o': '𝙤', 'p': '𝙥', 'q': '𝙦', 'r': '𝙧', 's': '𝙨', 't': '𝙩', 'u': '𝙪', 'v': '𝙫', 'w': '𝙬', 'x': '𝙭', 'y': '𝙮', 'z': '𝙯',
      'A': '𝘼', 'B': '𝘽', 'C': '𝘾', 'D': '𝘿', 'E': '𝙀', 'F': '𝙁', 'G': '𝙂', 'H': '𝙃', 'I': '𝙄', 'J': '𝙅', 'K': '𝙆', 'L': '𝙇', 'M': '𝙈', 'N': '𝙉', 'O': '𝙊', 'P': '𝙋', 'Q': '𝙌', 'R': '𝙍', 'S': '𝙎', 'T': '𝙏', 'U': '𝙐', 'V': '𝙑', 'W': '𝙒', 'X': '𝙓', 'Y': '𝙔', 'Z': '𝙕'
    };
    return map[char] || char;
  })},

  // Mathematical Monospace
  { name: "Mathematical Monospace", category: "monospace", transform: (text) => text.replace(/[a-zA-Z0-9]/g, (char) => {
    const map: Record<string, string> = {
      'a': '𝚊', 'b': '𝚋', 'c': '𝚌', 'd': '𝚍', 'e': '𝚎', 'f': '𝚏', 'g': '𝚐', 'h': '𝚑', 'i': '𝚒', 'j': '𝚓', 'k': '𝚔', 'l': '𝚕', 'm': '𝚖', 'n': '𝚗', 'o': '𝚘', 'p': '𝚙', 'q': '𝚚', 'r': '𝚛', 's': '𝚜', 't': '𝚝', 'u': '𝚞', 'v': '𝚟', 'w': '𝚠', 'x': '𝚡', 'y': '𝚢', 'z': '𝚣',
      'A': '𝙰', 'B': '𝙱', 'C': '𝙲', 'D': '𝙳', 'E': '𝙴', 'F': '𝙵', 'G': '𝙶', 'H': '𝙷', 'I': '𝙸', 'J': '𝙹', 'K': '𝙺', 'L': '𝙻', 'M': '𝙼', 'N': '𝙽', 'O': '𝙾', 'P': '𝙿', 'Q': '𝚀', 'R': '𝚁', 'S': '𝚂', 'T': '𝚃', 'U': '𝚄', 'V': '𝚅', 'W': '𝚆', 'X': '𝚇', 'Y': '𝚈', 'Z': '𝚉',
      '0': '𝟶', '1': '𝟷', '2': '𝟸', '3': '𝟹', '4': '𝟺', '5': '𝟻', '6': '𝟼', '7': '𝟽', '8': '𝟾', '9': '𝟿'
    };
    return map[char] || char;
  })},

  // Fullwidth
  { name: "Fullwidth", category: "wide", transform: (text) => text.replace(/[a-zA-Z0-9 ]/g, (char) => {
    const map: Record<string, string> = {
      'a': 'ａ', 'b': 'ｂ', 'c': 'ｃ', 'd': 'ｄ', 'e': 'ｅ', 'f': 'ｆ', 'g': 'ｇ', 'h': 'ｈ', 'i': 'ｉ', 'j': 'ｊ', 'k': 'ｋ', 'l': 'ｌ', 'm': 'ｍ', 'n': 'ｎ', 'o': 'ｏ', 'p': 'ｐ', 'q': 'ｑ', 'r': 'ｒ', 's': 'ｓ', 't': 'ｔ', 'u': 'ｕ', 'v': 'ｖ', 'w': 'ｗ', 'x': 'ｘ', 'y': 'ｙ', 'z': 'ｚ',
      'A': 'Ａ', 'B': 'Ｂ', 'C': 'Ｃ', 'D': 'Ｄ', 'E': 'Ｅ', 'F': 'Ｆ', 'G': 'Ｇ', 'H': 'Ｈ', 'I': 'Ｉ', 'J': 'Ｊ', 'K': 'Ｋ', 'L': 'Ｌ', 'M': 'Ｍ', 'N': 'Ｎ', 'O': 'Ｏ', 'P': 'Ｐ', 'Q': 'Ｑ', 'R': 'Ｒ', 'S': 'Ｓ', 'T': 'Ｔ', 'U': 'Ｕ', 'V': 'Ｖ', 'W': 'Ｗ', 'X': 'Ｘ', 'Y': 'Ｙ', 'Z': 'Ｚ',
      '0': '０', '1': '１', '2': '２', '3': '３', '4': '４', '5': '５', '6': '６', '7': '７', '8': '８', '9': '９',
      ' ': '　'
    };
    return map[char] || char;
  })},

  // Circled
  { name: "Circled", category: "circles", transform: (text) => text.replace(/[a-zA-Z0-9]/g, (char) => {
    const map: Record<string, string> = {
      'a': 'ⓐ', 'b': 'ⓑ', 'c': 'ⓒ', 'd': 'ⓓ', 'e': 'ⓔ', 'f': 'ⓕ', 'g': 'ⓖ', 'h': 'ⓗ', 'i': 'ⓘ', 'j': 'ⓙ', 'k': 'ⓚ', 'l': 'ⓛ', 'm': 'ⓜ', 'n': 'ⓝ', 'o': 'ⓞ', 'p': 'ⓟ', 'q': 'ⓠ', 'r': 'ⓡ', 's': 'ⓢ', 't': 'ⓣ', 'u': 'ⓤ', 'v': 'ⓥ', 'w': 'ⓦ', 'x': 'ⓧ', 'y': 'ⓨ', 'z': 'ⓩ',
      'A': 'Ⓐ', 'B': 'Ⓑ', 'C': 'Ⓒ', 'D': 'Ⓓ', 'E': 'Ⓔ', 'F': 'Ⓕ', 'G': 'Ⓖ', 'H': 'Ⓗ', 'I': 'Ⓘ', 'J': 'Ⓙ', 'K': 'Ⓚ', 'L': 'Ⓛ', 'M': 'Ⓜ', 'N': 'Ⓝ', 'O': 'Ⓞ', 'P': 'Ⓟ', 'Q': 'Ⓠ', 'R': 'Ⓡ', 'S': 'Ⓢ', 'T': 'Ⓣ', 'U': 'Ⓤ', 'V': 'Ⓥ', 'W': 'Ⓦ', 'X': 'Ⓧ', 'Y': 'Ⓨ', 'Z': 'Ⓩ',
      '0': '⓪', '1': '①', '2': '②', '3': '③', '4': '④', '5': '⑤', '6': '⑥', '7': '⑦', '8': '⑧', '9': '⑨'
    };
    return map[char] || char;
  })},

  // Negative Circled
  { name: "Negative Circled", category: "circles", transform: (text) => text.replace(/[a-zA-Z0-9]/g, (char) => {
    const map: Record<string, string> = {
      'a': '🅐', 'b': '🅑', 'c': '🅒', 'd': '🅓', 'e': '🅔', 'f': '🅕', 'g': '🅖', 'h': '🅗', 'i': '🅘', 'j': '🅙', 'k': '🅚', 'l': '🅛', 'm': '🅜', 'n': '🅝', 'o': '🅞', 'p': '🅟', 'q': '🅠', 'r': '🅡', 's': '🅢', 't': '🅣', 'u': '🅤', 'v': '🅥', 'w': '🅦', 'x': '🅧', 'y': '🅨', 'z': '🅩',
      'A': '🅐', 'B': '🅑', 'C': '🅒', 'D': '🅓', 'E': '🅔', 'F': '🅕', 'G': '🅖', 'H': '🅗', 'I': '🅘', 'J': '🅙', 'K': '🅚', 'L': '🅛', 'M': '🅜', 'N': '🅝', 'O': '🅞', 'P': '🅟', 'Q': '🅠', 'R': '🅡', 'S': '🅢', 'T': '🅣', 'U': '🅤', 'V': '🅥', 'W': '🅦', 'X': '🅧', 'Y': '🅨', 'Z': '🅩',
      '0': '⓿', '1': '❶', '2': '❷', '3': '❸', '4': '❹', '5': '❺', '6': '❻', '7': '❼', '8': '❽', '9': '❾'
    };
    return map[char] || char;
  })},

  // Squared
  { name: "Squared", category: "squares", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => {
    const map: Record<string, string> = {
      'a': '🅰', 'b': '🅱', 'c': '🅲', 'd': '🅳', 'e': '🅴', 'f': '🅵', 'g': '🅶', 'h': '🅷', 'i': '🅸', 'j': '🅹', 'k': '🅺', 'l': '🅻', 'm': '🅼', 'n': '🅽', 'o': '🅾', 'p': '🅿', 'q': '🆀', 'r': '🆁', 's': '🆂', 't': '🆃', 'u': '🆄', 'v': '🆅', 'w': '🆆', 'x': '🆇', 'y': '🆈', 'z': '🆉',
      'A': '🅰', 'B': '🅱', 'C': '🅲', 'D': '🅳', 'E': '🅴', 'F': '🅵', 'G': '🅶', 'H': '🅷', 'I': '🅸', 'J': '🅹', 'K': '🅺', 'L': '🅻', 'M': '🅼', 'N': '🅽', 'O': '🅾', 'P': '🅿', 'Q': '🆀', 'R': '🆁', 'S': '🆂', 'T': '🆃', 'U': '🆄', 'V': '🆅', 'W': '🆆', 'X': '🆇', 'Y': '🆈', 'Z': '🆉'
    };
    return map[char] || char;
  })},

  // Parenthesized
  { name: "Parenthesized", category: "parentheses", transform: (text) => text.replace(/[a-zA-Z0-9]/g, (char) => {
    const map: Record<string, string> = {
      'a': '⒜', 'b': '⒝', 'c': '⒞', 'd': '⒟', 'e': '⒠', 'f': '⒡', 'g': '⒢', 'h': '⒣', 'i': '⒤', 'j': '⒥', 'k': '⒦', 'l': '⒧', 'm': '⒨', 'n': '⒩', 'o': '⒪', 'p': '⒫', 'q': '⒬', 'r': '⒭', 's': '⒮', 't': '⒯', 'u': '⒰', 'v': '⒱', 'w': '⒲', 'x': '⒳', 'y': '⒴', 'z': '⒵',
      'A': '⒜', 'B': '⒝', 'C': '⒞', 'D': '⒟', 'E': '⒠', 'F': '⒡', 'G': '⒢', 'H': '⒣', 'I': '⒤', 'J': '⒥', 'K': '⒦', 'L': '⒧', 'M': '⒨', 'N': '⒩', 'O': '⒪', 'P': '⒫', 'Q': '⒬', 'R': '⒭', 'S': '⒮', 'T': '⒯', 'U': '⒰', 'V': '⒱', 'W': '⒲', 'X': '⒳', 'Y': '⒴', 'Z': '⒵',
      '1': '⑴', '2': '⑵', '3': '⑶', '4': '⑷', '5': '⑸', '6': '⑹', '7': '⑺', '8': '⑻', '9': '⑼', '0': '⑽'
    };
    return map[char] || char;
  })},

  // Superscript
  { name: "Superscript", category: "script", transform: (text) => text.replace(/[a-zA-Z0-9]/g, (char) => {
    const map: Record<string, string> = {
      'a': 'ᵃ', 'b': 'ᵇ', 'c': 'ᶜ', 'd': 'ᵈ', 'e': 'ᵉ', 'f': 'ᶠ', 'g': 'ᵍ', 'h': 'ʰ', 'i': 'ⁱ', 'j': 'ʲ', 'k': 'ᵏ', 'l': 'ˡ', 'm': 'ᵐ', 'n': 'ⁿ', 'o': 'ᵒ', 'p': 'ᵖ', 'q': 'q', 'r': 'ʳ', 's': 'ˢ', 't': 'ᵗ', 'u': 'ᵘ', 'v': 'ᵛ', 'w': 'ʷ', 'x': 'ˣ', 'y': 'ʸ', 'z': 'ᶻ',
      'A': 'ᴬ', 'B': 'ᴮ', 'C': 'ᶜ', 'D': 'ᴰ', 'E': 'ᴱ', 'F': 'ᶠ', 'G': 'ᴳ', 'H': 'ᴴ', 'I': 'ᴵ', 'J': 'ᴶ', 'K': 'ᴷ', 'L': 'ᴸ', 'M': 'ᴹ', 'N': 'ᴺ', 'O': 'ᴼ', 'P': 'ᴾ', 'Q': 'ᵠ', 'R': 'ᴿ', 'S': 'ˢ', 'T': 'ᵀ', 'U': 'ᵁ', 'V': 'ⱽ', 'W': 'ᵂ', 'X': 'ˣ', 'Y': 'ʸ', 'Z': 'ᶻ',
      '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹'
    };
    return map[char] || char;
  })},

  // Subscript
  { name: "Subscript", category: "script", transform: (text) => text.replace(/[a-zA-Z0-9]/g, (char) => {
    const map: Record<string, string> = {
      'a': 'ₐ', 'e': 'ₑ', 'h': 'ₕ', 'i': 'ᵢ', 'j': 'ⱼ', 'k': 'ₖ', 'l': 'ₗ', 'm': 'ₘ', 'n': 'ₙ', 'o': 'ₒ', 'p': 'ₚ', 'r': 'ᵣ', 's': 'ₛ', 't': 'ₜ', 'u': 'ᵤ', 'v': 'ᵥ', 'x': 'ₓ',
      '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉'
    };
    return map[char] || char;
  })},

  // Underlined
  { name: "Underlined", category: "decorative", transform: (text) => text.split('').map(char => char + '\u0332').join('') },

  // Strikethrough
  { name: "Strikethrough", category: "decorative", transform: (text) => text.split('').map(char => char + '\u0336').join('') },

  // Overlined
  { name: "Overlined", category: "decorative", transform: (text) => text.split('').map(char => char + '\u0305').join('') },

  // Dotted
  { name: "Dotted", category: "decorative", transform: (text) => text.split('').map(char => char + '\u0307').join('') },

  // Small Caps
  { name: "Small Caps", category: "special", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => {
    const map: Record<string, string> = {
      'a': 'ᴀ', 'b': 'ʙ', 'c': 'ᴄ', 'd': 'ᴅ', 'e': 'ᴇ', 'f': 'ꜰ', 'g': 'ɢ', 'h': 'ʜ', 'i': 'ɪ', 'j': 'ᴊ', 'k': 'ᴋ', 'l': 'ʟ', 'm': 'ᴍ', 'n': 'ɴ', 'o': 'ᴏ', 'p': 'ᴘ', 'q': 'ǫ', 'r': 'ʀ', 's': 's', 't': 'ᴛ', 'u': 'ᴜ', 'v': 'ᴠ', 'w': 'ᴡ', 'x': 'x', 'y': 'ʏ', 'z': 'ᴢ',
      'A': 'ᴀ', 'B': 'ʙ', 'C': 'ᴄ', 'D': 'ᴅ', 'E': 'ᴇ', 'F': 'ꜰ', 'G': 'ɢ', 'H': 'ʜ', 'I': 'ɪ', 'J': 'ᴊ', 'K': 'ᴋ', 'L': 'ʟ', 'M': 'ᴍ', 'N': 'ɴ', 'O': 'ᴏ', 'P': 'ᴘ', 'Q': 'ǫ', 'R': 'ʀ', 'S': 's', 'T': 'ᴛ', 'U': 'ᴜ', 'V': 'ᴠ', 'W': 'ᴡ', 'X': 'x', 'Y': 'ʏ', 'Z': 'ᴢ'
    };
    return map[char] || char;
  })},

  // Wide Text
  { name: "Wide Text", category: "wide", transform: (text) => text.split('').join(' ').toUpperCase() },

  // Regional Indicator (Flags)
  { name: "Regional Indicator", category: "flags", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => {
    const map: Record<string, string> = {
      'a': '🇦', 'b': '🇧', 'c': '🇨', 'd': '🇩', 'e': '🇪', 'f': '🇫', 'g': '🇬', 'h': '🇭', 'i': '🇮', 'j': '🇯', 'k': '🇰', 'l': '🇱', 'm': '🇲', 'n': '🇳', 'o': '🇴', 'p': '🇵', 'q': '🇶', 'r': '🇷', 's': '🇸', 't': '🇹', 'u': '🇺', 'v': '🇻', 'w': '🇼', 'x': '🇽', 'y': '🇾', 'z': '🇿',
      'A': '🇦', 'B': '🇧', 'C': '🇨', 'D': '🇩', 'E': '🇪', 'F': '🇫', 'G': '🇬', 'H': '🇭', 'I': '🇮', 'J': '🇯', 'K': '🇰', 'L': '🇱', 'M': '🇲', 'N': '🇳', 'O': '🇴', 'P': '🇵', 'Q': '🇶', 'R': '🇷', 'S': '🇸', 'T': '🇹', 'U': '🇺', 'V': '🇻', 'W': '🇼', 'X': '🇽', 'Y': '🇾', 'Z': '🇿'
    };
    return map[char] || char;
  })},

  // Asian Style
  { name: "Asian Style", category: "asian", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => {
    const map: Record<string, string> = {
      'a': '卂', 'b': '乃', 'c': '匚', 'd': 'ᗪ', 'e': '乇', 'f': '千', 'g': 'Ꮆ', 'h': '卄', 'i': '丨', 'j': 'ﾌ', 'k': 'Ҝ', 'l': 'ㄥ', 'm': '爪', 'n': '几', 'o': 'ㄖ', 'p': '卩', 'q': 'Ɋ', 'r': '尺', 's': '丂', 't': 'ㄒ', 'u': 'ㄩ', 'v': 'ᐯ', 'w': '山', 'x': '乂', 'y': 'ㄚ', 'z': '乙',
      'A': '卂', 'B': '乃', 'C': '匚', 'D': 'ᗪ', 'E': '乇', 'F': '千', 'G': 'Ꮆ', 'H': '卄', 'I': '丨', 'J': 'ﾌ', 'K': 'Ҝ', 'L': 'ㄥ', 'M': '爪', 'N': '几', 'O': 'ㄖ', 'P': '卩', 'Q': 'Ɋ', 'R': '尺', 'S': '丂', 'T': 'ㄒ', 'U': 'ㄩ', 'V': 'ᐯ', 'W': '山', 'X': '乂', 'Y': 'ㄚ', 'Z': '乙'
    };
    return map[char] || char;
  })},

  // Currency Style
  { name: "Currency Style", category: "special", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => {
    const map: Record<string, string> = {
      'a': '₳', 'b': '฿', 'c': '₵', 'd': 'Đ', 'e': '€', 'f': '₣', 'g': '₲', 'h': 'Ⱨ', 'i': 'ł', 'j': 'J', 'k': '₭', 'l': 'Ł', 'm': '₥', 'n': '₦', 'o': 'Ø', 'p': '₱', 'q': 'Q', 'r': '₹', 's': '$', 't': '₮', 'u': 'Ʉ', 'v': 'V', 'w': '₩', 'x': 'Ӿ', 'y': '¥', 'z': 'Ⱬ',
      'A': '₳', 'B': '฿', 'C': '₵', 'D': 'Đ', 'E': '€', 'F': '₣', 'G': '₲', 'H': 'Ⱨ', 'I': 'ł', 'J': 'J', 'K': '₭', 'L': 'Ł', 'M': '₥', 'N': '₦', 'O': 'Ø', 'P': '₱', 'Q': 'Q', 'R': '₹', 'S': '$', 'T': '₮', 'U': 'Ʉ', 'V': 'V', 'W': '₩', 'X': 'Ӿ', 'Y': '¥', 'Z': 'Ⱬ'
    };
    return map[char] || char;
  })},

  // Inverted
  { name: "Inverted", category: "flip", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => {
    const map: Record<string, string> = {
      'a': 'ɐ', 'b': 'q', 'c': 'ɔ', 'd': 'p', 'e': 'ǝ', 'f': 'ɟ', 'g': 'ƃ', 'h': 'ɥ', 'i': 'ᴉ', 'j': 'ɾ', 'k': 'ʞ', 'l': 'l', 'm': 'ɯ', 'n': 'u', 'o': 'o', 'p': 'd', 'q': 'b', 'r': 'ɹ', 's': 's', 't': 'ʇ', 'u': 'n', 'v': 'ʌ', 'w': 'ʍ', 'x': 'x', 'y': 'ʎ', 'z': 'z',
      'A': '∀', 'B': 'ᗺ', 'C': 'Ɔ', 'D': 'ᗡ', 'E': 'Ǝ', 'F': 'ᖴ', 'G': 'פ', 'H': 'H', 'I': 'I', 'J': 'ſ', 'K': 'ʞ', 'L': '˥', 'M': 'W', 'N': 'N', 'O': 'O', 'P': 'Ԁ', 'Q': 'Q', 'R': 'ᴿ', 'S': 'S', 'T': '┴', 'U': '∩', 'V': 'Λ', 'W': 'M', 'X': 'X', 'Y': '⅄', 'Z': 'Z'
    };
    return map[char] || char;
  }).split('').reverse().join('') },

  // Mirror
  { name: "Mirror", category: "flip", transform: (text) => text.split('').reverse().join('') },

  // Zalgo Text
  { name: "Zalgo Text", category: "crazy", transform: (text) => {
    const zalgoChars = ['̖', '̗', '̘', '̙', '̜', '̝', '̞', '̟', '̠', '̤', '̥', '̦', '̩', '̪', '̫', '̬', '̭', '̮', '̯', '̰', '̱', '̲', '̳', '̹', '̺', '̻', '̼', '́', '̂', '̃', '̄', '̅', '̆', '̇', '̈', '̉', '̊', '̋', '̌', '̍', '̎', '̏', '̐', '̑', '̒', '̓', '̔', '̕'];
    return text.split('').map(char => {
      if (char.match(/[a-zA-Z]/)) {
        let result = char;
        for (let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) {
          result += zalgoChars[Math.floor(Math.random() * zalgoChars.length)];
        }
        return result;
      }
      return char;
    }).join('');
  }},

  // Crossed Out
  { name: "Crossed Out", category: "decorative", transform: (text) => text.split('').map(char => char + '̶').join('') },

  // Latin Extended Characters
  { name: "Latin Extended A", category: "latin", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => {
    const map: Record<string, string> = {
      'a': 'ā', 'b': 'ḃ', 'c': 'ċ', 'd': 'ḋ', 'e': 'ē', 'f': 'ḟ', 'g': 'ḡ', 'h': 'ḣ', 'i': 'ī', 'j': 'ĵ', 'k': 'ḳ', 'l': 'ḷ', 'm': 'ṁ', 'n': 'ṅ', 'o': 'ō', 'p': 'ṗ', 'q': 'q̄', 'r': 'ṙ', 's': 'ṡ', 't': 'ṫ', 'u': 'ū', 'v': 'ṽ', 'w': 'ẇ', 'x': 'ẋ', 'y': 'ȳ', 'z': 'ż',
      'A': 'Ā', 'B': 'Ḃ', 'C': 'Ċ', 'D': 'Ḋ', 'E': 'Ē', 'F': 'Ḟ', 'G': 'Ḡ', 'H': 'Ḣ', 'I': 'Ī', 'J': 'Ĵ', 'K': 'Ḳ', 'L': 'Ḷ', 'M': 'Ṁ', 'N': 'Ṅ', 'O': 'Ō', 'P': 'Ṗ', 'Q': 'Q̄', 'R': 'Ṙ', 'S': 'Ṡ', 'T': 'Ṫ', 'U': 'Ū', 'V': 'Ṽ', 'W': 'Ẇ', 'X': 'Ẋ', 'Y': 'Ȳ', 'Z': 'Ż'
    };
    return map[char] || char;
  })},

  // Latin Extended B
  { name: "Latin Extended B", category: "latin", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => {
    const map: Record<string, string> = {
      'a': 'ă', 'b': 'ḅ', 'c': 'ç', 'd': 'ḑ', 'e': 'ĕ', 'f': 'f̧', 'g': 'ģ', 'h': 'ḩ', 'i': 'ĭ', 'j': 'ǰ', 'k': 'ķ', 'l': 'ļ', 'm': 'ḿ', 'n': 'ņ', 'o': 'ŏ', 'p': 'p̧', 'q': 'q̧', 'r': 'ŗ', 's': 'ş', 't': 'ţ', 'u': 'ŭ', 'v': 'v̧', 'w': 'ŵ', 'x': 'x̧', 'y': 'ŷ', 'z': 'ž',
      'A': 'Ă', 'B': 'Ḅ', 'C': 'Ç', 'D': 'Ḑ', 'E': 'Ĕ', 'F': 'F̧', 'G': 'Ģ', 'H': 'Ḩ', 'I': 'Ĭ', 'J': 'J̌', 'K': 'Ķ', 'L': 'Ļ', 'M': 'Ḿ', 'N': 'Ņ', 'O': 'Ŏ', 'P': 'P̧', 'Q': 'Q̧', 'R': 'Ŗ', 'S': 'Ş', 'T': 'Ţ', 'U': 'Ŭ', 'V': 'V̧', 'W': 'Ŵ', 'X': 'X̧', 'Y': 'Ŷ', 'Z': 'Ž'
    };
    return map[char] || char;
  })},

  // Cyrillic Style
  { name: "Cyrillic Style", category: "cyrillic", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => {
    const map: Record<string, string> = {
      'a': 'а', 'b': 'в', 'c': 'с', 'd': 'ḑ', 'e': 'е', 'f': 'f', 'g': 'g', 'h': 'н', 'i': 'і', 'j': 'ј', 'k': 'к', 'l': 'l', 'm': 'м', 'n': 'п', 'o': 'о', 'p': 'р', 'q': 'q', 'r': 'г', 's': 'ѕ', 't': 'т', 'u': 'u', 'v': 'v', 'w': 'w', 'x': 'х', 'y': 'у', 'z': 'z',
      'A': 'А', 'B': 'В', 'C': 'С', 'D': 'Ḑ', 'E': 'Е', 'F': 'F', 'G': 'G', 'H': 'Н', 'I': 'І', 'J': 'Ј', 'K': 'К', 'L': 'L', 'M': 'М', 'N': 'П', 'O': 'О', 'P': 'Р', 'Q': 'Q', 'R': 'Г', 'S': 'Ѕ', 'T': 'Т', 'U': 'U', 'V': 'V', 'W': 'W', 'X': 'Х', 'Y': 'У', 'Z': 'Z'
    };
    return map[char] || char;
  })},

  // Greek Style
  { name: "Greek Style", category: "greek", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => {
    const map: Record<string, string> = {
      'a': 'α', 'b': 'β', 'c': 'ς', 'd': 'δ', 'e': 'ε', 'f': 'φ', 'g': 'γ', 'h': 'η', 'i': 'ι', 'j': 'ϳ', 'k': 'κ', 'l': 'λ', 'm': 'μ', 'n': 'ν', 'o': 'ο', 'p': 'π', 'q': 'q', 'r': 'ρ', 's': 'σ', 't': 'τ', 'u': 'υ', 'v': 'ν', 'w': 'ω', 'x': 'χ', 'y': 'ψ', 'z': 'ζ',
      'A': 'Α', 'B': 'Β', 'C': 'Σ', 'D': 'Δ', 'E': 'Ε', 'F': 'Φ', 'G': 'Γ', 'H': 'Η', 'I': 'Ι', 'J': 'Ϳ', 'K': 'Κ', 'L': 'Λ', 'M': 'Μ', 'N': 'Ν', 'O': 'Ο', 'P': 'Π', 'Q': 'Q', 'R': 'Ρ', 'S': 'Σ', 'T': 'Τ', 'U': 'Υ', 'V': 'Ν', 'W': 'Ω', 'X': 'Χ', 'Y': 'Ψ', 'Z': 'Ζ'
    };
    return map[char] || char;
  })},

  // Bubble Text Negative
  { name: "Bubble Text Negative", category: "circles", transform: (text) => text.replace(/[a-zA-Z0-9]/g, (char) => {
    const map: Record<string, string> = {
      'a': '🅐', 'b': '🅑', 'c': '🅒', 'd': '🅓', 'e': '🅔', 'f': '🅕', 'g': '🅖', 'h': '🅗', 'i': '🅘', 'j': '🅙', 'k': '🅚', 'l': '🅛', 'm': '🅜', 'n': '🅝', 'o': '🅞', 'p': '🅟', 'q': '🅠', 'r': '🅡', 's': '🅢', 't': '🅣', 'u': '🅤', 'v': '🅥', 'w': '🅦', 'x': '🅧', 'y': '🅨', 'z': '🅩',
      'A': '🅐', 'B': '🅑', 'C': '🅒', 'D': '🅓', 'E': '🅔', 'F': '🅕', 'G': '🅖', 'H': '🅗', 'I': '🅘', 'J': '🅙', 'K': '🅚', 'L': '🅛', 'M': '🅜', 'N': '🅝', 'O': '🅞', 'P': '🅟', 'Q': '🅠', 'R': '🅡', 'S': '🅢', 'T': '🅣', 'U': '🅤', 'V': '🅥', 'W': '🅦', 'X': '🅧', 'Y': '🅨', 'Z': '🅩',
      '0': '⓿', '1': '❶', '2': '❷', '3': '❸', '4': '❹', '5': '❺', '6': '❻', '7': '❼', '8': '❽', '9': '❾'
    };
    return map[char] || char;
  })},

  // Double Struck Outline
  { name: "Double Struck Outline", category: "outline", transform: (text) => text.replace(/[a-zA-Z0-9]/g, (char) => {
    const map: Record<string, string> = {
      'a': '𝕒', 'b': '𝕓', 'c': '𝕔', 'd': '𝕕', 'e': '𝕖', 'f': '𝕗', 'g': '𝕘', 'h': '𝕙', 'i': '𝕚', 'j': '𝕛', 'k': '𝕜', 'l': '𝕝', 'm': '𝕞', 'n': '𝕟', 'o': '𝕠', 'p': '𝕡', 'q': '𝕢', 'r': '𝕣', 's': '𝕤', 't': '𝕥', 'u': '𝕦', 'v': '𝕧', 'w': '𝕨', 'x': '𝕩', 'y': '𝕪', 'z': '𝕫',
      'A': '𝔸', 'B': '𝔹', 'C': 'ℂ', 'D': '𝔻', 'E': '𝔼', 'F': '𝔽', 'G': '𝔾', 'H': 'ℍ', 'I': '𝕀', 'J': '𝕁', 'K': '𝕂', 'L': '𝕃', 'M': '𝕄', 'N': 'ℕ', 'O': '𝕆', 'P': 'ℙ', 'Q': 'ℚ', 'R': 'ℝ', 'S': '𝕊', 'T': '𝕋', 'U': '𝕌', 'V': '𝕍', 'W': '𝕎', 'X': '𝕏', 'Y': '𝕐', 'Z': 'ℤ',
      '0': '𝟘', '1': '𝟙', '2': '𝟚', '3': '𝟛', '4': '𝟜', '5': '𝟝', '6': '𝟞', '7': '𝟟', '8': '𝟠', '9': '𝟡'
    };
    return map[char] || char;
  })},

  // Blackboard Bold
  { name: "Blackboard Bold", category: "blackboard", transform: (text) => text.replace(/[a-zA-Z0-9]/g, (char) => {
    const map: Record<string, string> = {
      'a': '𝒂', 'b': '𝒃', 'c': '𝒄', 'd': '𝒅', 'e': '𝒆', 'f': '𝒇', 'g': '𝒈', 'h': '𝒉', 'i': '𝒊', 'j': '𝒋', 'k': '𝒌', 'l': '𝒍', 'm': '𝒎', 'n': '𝒏', 'o': '𝒐', 'p': '𝒑', 'q': '𝒒', 'r': '𝒓', 's': '𝒔', 't': '𝒕', 'u': '𝒖', 'v': '𝒗', 'w': '𝒘', 'x': '𝒙', 'y': '𝒚', 'z': '𝒛',
      'A': '𝑨', 'B': '𝑩', 'C': '𝑪', 'D': '𝑫', 'E': '𝑬', 'F': '𝑭', 'G': '𝑮', 'H': '𝑯', 'I': '𝑰', 'J': '𝑱', 'K': '𝑲', 'L': '𝑳', 'M': '𝑴', 'N': '𝑵', 'O': '𝑶', 'P': '𝑷', 'Q': '𝑸', 'R': '𝑹', 'S': '𝑺', 'T': '𝑻', 'U': '𝑼', 'V': '𝑽', 'W': '𝑾', 'X': '𝑿', 'Y': '𝒀', 'Z': '𝒁',
      '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒', '5': '𝟓', '6': '𝟔', '7': '𝟕', '8': '𝟖', '9': '𝟗'
    };
    return map[char] || char;
  })},

  // Outline Text
  { name: "Outline Text", category: "outline", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => {
    const map: Record<string, string> = {
      'a': '𝖺', 'b': '𝖻', 'c': '𝖼', 'd': '𝖽', 'e': '𝖾', 'f': '𝖿', 'g': '𝗀', 'h': '𝗁', 'i': '𝗂', 'j': '𝗃', 'k': '𝗄', 'l': '𝗅', 'm': '𝗆', 'n': '𝗇', 'o': '𝗈', 'p': '𝗉', 'q': '𝗊', 'r': '𝗋', 's': '𝗌', 't': '𝗍', 'u': '𝗎', 'v': '𝗏', 'w': '𝗐', 'x': '𝗑', 'y': '𝗒', 'z': '𝗓',
      'A': '𝖠', 'B': '𝖡', 'C': '𝖢', 'D': '𝖣', 'E': '𝖤', 'F': '𝖥', 'G': '𝖦', 'H': '𝖧', 'I': '𝖨', 'J': '𝖩', 'K': '𝖪', 'L': '𝖫', 'M': '𝖬', 'N': '𝖭', 'O': '𝖮', 'P': '𝖯', 'Q': '𝖰', 'R': '𝖱', 'S': '𝖲', 'T': '𝖳', 'U': '𝖴', 'V': '𝖵', 'W': '𝖶', 'X': '𝖷', 'Y': '𝖸', 'Z': '𝖹'
    };
    return map[char] || char;
  })},

  // Diacritic Heavy
  { name: "Diacritic Heavy", category: "diacritic", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => {
    const map: Record<string, string> = {
      'a': 'ä', 'b': 'ḃ', 'c': 'ċ', 'd': 'ḋ', 'e': 'ë', 'f': 'ḟ', 'g': 'ġ', 'h': 'ḧ', 'i': 'ï', 'j': 'j̈', 'k': 'k̈', 'l': 'l̈', 'm': 'ṁ', 'n': 'ṅ', 'o': 'ö', 'p': 'ṗ', 'q': 'q̈', 'r': 'ṙ', 's': 'ṡ', 't': 'ẗ', 'u': 'ü', 'v': 'v̈', 'w': 'ẅ', 'x': 'ẍ', 'y': 'ÿ', 'z': 'ż',
      'A': 'Ä', 'B': 'Ḃ', 'C': 'Ċ', 'D': 'Ḋ', 'E': 'Ë', 'F': 'Ḟ', 'G': 'Ġ', 'H': 'Ḧ', 'I': 'Ï', 'J': 'J̈', 'K': 'K̈', 'L': 'L̈', 'M': 'Ṁ', 'N': 'Ṅ', 'O': 'Ö', 'P': 'Ṗ', 'Q': 'Q̈', 'R': 'Ṙ', 'S': 'Ṡ', 'T': 'T̈', 'U': 'Ü', 'V': 'V̈', 'W': 'Ẅ', 'X': 'Ẍ', 'Y': 'Ÿ', 'Z': 'Ż'
    };
    return map[char] || char;
  })},

  // Accented Characters
  { name: "Accented Characters", category: "accented", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => {
    const map: Record<string, string> = {
      'a': 'á', 'b': 'ḅ', 'c': 'ć', 'd': 'ḍ', 'e': 'é', 'f': 'f́', 'g': 'ǵ', 'h': 'h́', 'i': 'í', 'j': 'j́', 'k': 'ḱ', 'l': 'ĺ', 'm': 'ḿ', 'n': 'ń', 'o': 'ó', 'p': 'ṕ', 'q': 'q́', 'r': 'ŕ', 's': 'ś', 't': 't́', 'u': 'ú', 'v': 'v́', 'w': 'ẃ', 'x': 'x́', 'y': 'ý', 'z': 'ź',
      'A': 'Á', 'B': 'Ḅ', 'C': 'Ć', 'D': 'Ḍ', 'E': 'É', 'F': 'F́', 'G': 'Ǵ', 'H': 'H́', 'I': 'Í', 'J': 'J́', 'K': 'Ḱ', 'L': 'Ĺ', 'M': 'Ḿ', 'N': 'Ń', 'O': 'Ó', 'P': 'Ṕ', 'Q': 'Q́', 'R': 'Ŕ', 'S': 'Ś', 'T': 'T́', 'U': 'Ú', 'V': 'V́', 'W': 'Ẃ', 'X': 'X́', 'Y': 'Ý', 'Z': 'Ź'
    };
    return map[char] || char;
  })},

  // Tilde Style
  { name: "Tilde Style", category: "tilde", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => {
    const map: Record<string, string> = {
      'a': 'ã', 'b': 'b̃', 'c': 'c̃', 'd': 'd̃', 'e': 'ẽ', 'f': 'f̃', 'g': 'g̃', 'h': 'h̃', 'i': 'ĩ', 'j': 'j̃', 'k': 'k̃', 'l': 'l̃', 'm': 'm̃', 'n': 'ñ', 'o': 'õ', 'p': 'p̃', 'q': 'q̃', 'r': 'r̃', 's': 's̃', 't': 't̃', 'u': 'ũ', 'v': 'ṽ', 'w': 'w̃', 'x': 'x̃', 'y': 'ỹ', 'z': 'z̃',
      'A': 'Ã', 'B': 'B̃', 'C': 'C̃', 'D': 'D̃', 'E': 'Ẽ', 'F': 'F̃', 'G': 'G̃', 'H': 'H̃', 'I': 'Ĩ', 'J': 'J̃', 'K': 'K̃', 'L': 'L̃', 'M': 'M̃', 'N': 'Ñ', 'O': 'Õ', 'P': 'P̃', 'Q': 'Q̃', 'R': 'R̃', 'S': 'S̃', 'T': 'T̃', 'U': 'Ũ', 'V': 'Ṽ', 'W': 'W̃', 'X': 'X̃', 'Y': 'Ỹ', 'Z': 'Z̃'
    };
    return map[char] || char;
  })},

  // Circumflex Style
  { name: "Circumflex Style", category: "circumflex", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => {
    const map: Record<string, string> = {
      'a': 'â', 'b': 'b̂', 'c': 'ĉ', 'd': 'd̂', 'e': 'ê', 'f': 'f̂', 'g': 'ĝ', 'h': 'ĥ', 'i': 'î', 'j': 'ĵ', 'k': 'k̂', 'l': 'l̂', 'm': 'm̂', 'n': 'n̂', 'o': 'ô', 'p': 'p̂', 'q': 'q̂', 'r': 'r̂', 's': 'ŝ', 't': 't̂', 'u': 'û', 'v': 'v̂', 'w': 'ŵ', 'x': 'x̂', 'y': 'ŷ', 'z': 'ẑ',
      'A': 'Â', 'B': 'B̂', 'C': 'Ĉ', 'D': 'D̂', 'E': 'Ê', 'F': 'F̂', 'G': 'Ĝ', 'H': 'Ĥ', 'I': 'Î', 'J': 'Ĵ', 'K': 'K̂', 'L': 'L̂', 'M': 'M̂', 'N': 'N̂', 'O': 'Ô', 'P': 'P̂', 'Q': 'Q̂', 'R': 'R̂', 'S': 'Ŝ', 'T': 'T̂', 'U': 'Û', 'V': 'V̂', 'W': 'Ŵ', 'X': 'X̂', 'Y': 'Ŷ', 'Z': 'Ẑ'
    };
    return map[char] || char;
  })},

  // Grave Accent
  { name: "Grave Accent", category: "grave", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => {
    const map: Record<string, string> = {
      'a': 'à', 'b': 'b̀', 'c': 'c̀', 'd': 'd̀', 'e': 'è', 'f': 'f̀', 'g': 'g̀', 'h': 'h̀', 'i': 'ì', 'j': 'j̀', 'k': 'k̀', 'l': 'l̀', 'm': 'm̀', 'n': 'ǹ', 'o': 'ò', 'p': 'p̀', 'q': 'q̀', 'r': 'r̀', 's': 's̀', 't': 't̀', 'u': 'ù', 'v': 'v̀', 'w': 'ẁ', 'x': 'x̀', 'y': 'ỳ', 'z': 'z̀',
      'A': 'À', 'B': 'B̀', 'C': 'C̀', 'D': 'D̀', 'E': 'È', 'F': 'F̀', 'G': 'G̀', 'H': 'H̀', 'I': 'Ì', 'J': 'J̀', 'K': 'K̀', 'L': 'L̀', 'M': 'M̀', 'N': 'Ǹ', 'O': 'Ò', 'P': 'P̀', 'Q': 'Q̀', 'R': 'R̀', 'S': 'S̀', 'T': 'T̀', 'U': 'Ù', 'V': 'V̀', 'W': 'Ẁ', 'X': 'X̀', 'Y': 'Ỳ', 'Z': 'Z̀'
    };
    return map[char] || char;
  })},

  // Celtic Style
  { name: "Celtic Style", category: "celtic", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => {
    const map: Record<string, string> = {
      'a': 'ⱥ', 'b': 'ƀ', 'c': 'ȼ', 'd': 'đ', 'e': 'ɇ', 'f': 'ƒ', 'g': 'ǥ', 'h': 'ħ', 'i': 'ɨ', 'j': 'ɉ', 'k': 'ꝁ', 'l': 'ł', 'm': 'ɱ', 'n': 'ꞑ', 'o': 'ø', 'p': 'ᵽ', 'q': 'ꝗ', 'r': 'ɍ', 's': 'ş', 't': 'ŧ', 'u': 'ᵾ', 'v': 'ⱱ', 'w': 'ⱳ', 'x': 'ẋ', 'y': 'ɏ', 'z': 'ƶ',
      'A': 'Ⱥ', 'B': 'Ɓ', 'C': 'Ȼ', 'D': 'Đ', 'E': 'Ɇ', 'F': 'Ƒ', 'G': 'Ǥ', 'H': 'Ħ', 'I': 'Ɨ', 'J': 'Ɉ', 'K': 'Ꝁ', 'L': 'Ł', 'M': 'Ɱ', 'N': 'Ꞑ', 'O': 'Ø', 'P': 'Ᵽ', 'Q': 'Ꝗ', 'R': 'Ɍ', 'S': 'Ş', 'T': 'Ŧ', 'U': 'ᵾ', 'V': 'ⱱ', 'W': 'Ⱳ', 'X': 'Ẋ', 'Y': 'Ɏ', 'Z': 'Ƶ'
    };
    return map[char] || char;
  })},

  // Runic Style
  { name: "Runic Style", category: "runic", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => {
    const map: Record<string, string> = {
      'a': 'ᚨ', 'b': 'ᛒ', 'c': 'ᚲ', 'd': 'ᛞ', 'e': 'ᛖ', 'f': 'ᚠ', 'g': 'ᚷ', 'h': 'ᚺ', 'i': 'ᛁ', 'j': 'ᛃ', 'k': 'ᚲ', 'l': 'ᛚ', 'm': 'ᛗ', 'n': 'ᚾ', 'o': 'ᛟ', 'p': 'ᛈ', 'q': 'ᚲ', 'r': 'ᚱ', 's': 'ᛊ', 't': 'ᛏ', 'u': 'ᚢ', 'v': 'ᚡ', 'w': 'ᚹ', 'x': 'ᚲᛊ', 'y': 'ᛃ', 'z': 'ᛉ',
      'A': 'ᚨ', 'B': 'ᛒ', 'C': 'ᚲ', 'D': 'ᛞ', 'E': 'ᛖ', 'F': 'ᚠ', 'G': 'ᚷ', 'H': 'ᚺ', 'I': 'ᛁ', 'J': 'ᛃ', 'K': 'ᚲ', 'L': 'ᛚ', 'M': 'ᛗ', 'N': 'ᚾ', 'O': 'ᛟ', 'P': 'ᛈ', 'Q': 'ᚲ', 'R': 'ᚱ', 'S': 'ᛊ', 'T': 'ᛏ', 'U': 'ᚢ', 'V': 'ᚡ', 'W': 'ᚹ', 'X': 'ᚲᛊ', 'Y': 'ᛃ', 'Z': 'ᛉ'
    };
    return map[char] || char;
  })},

  // Arabic Numerals Style
  { name: "Arabic Numerals", category: "arabic", transform: (text) => text.replace(/[0-9]/g, (char) => {
    const map: Record<string, string> = {
      '0': '٠', '1': '١', '2': '٢', '3': '٣', '4': '٤', '5': '٥', '6': '٦', '7': '٧', '8': '٨', '9': '٩'
    };
    return map[char] || char;
  })},

  // Roman Numerals
  { name: "Roman Numerals", category: "roman", transform: (text) => text.replace(/[0-9]/g, (char) => {
    const map: Record<string, string> = {
      '1': 'Ⅰ', '2': 'Ⅱ', '3': 'Ⅲ', '4': 'Ⅳ', '5': 'Ⅴ', '6': 'Ⅵ', '7': 'Ⅶ', '8': 'Ⅷ', '9': 'Ⅸ', '0': '⓪'
    };
    return map[char] || char;
  })},

  // Chinese Numbers
  { name: "Chinese Numbers", category: "chinese", transform: (text) => text.replace(/[0-9]/g, (char) => {
    const map: Record<string, string> = {
      '0': '〇', '1': '一', '2': '二', '3': '三', '4': '四', '5': '五', '6': '六', '7': '七', '8': '八', '9': '九'
    };
    return map[char] || char;
  })},

  // Braille Patterns
  { name: "Braille Patterns", category: "braille", transform: (text) => text.replace(/[a-zA-Z0-9]/g, (char) => {
    const map: Record<string, string> = {
      'a': '⠁', 'b': '⠃', 'c': '⠉', 'd': '⠙', 'e': '⠑', 'f': '⠋', 'g': '⠛', 'h': '⠓', 'i': '⠊', 'j': '⠚', 'k': '⠅', 'l': '⠇', 'm': '⠍', 'n': '⠝', 'o': '⠕', 'p': '⠏', 'q': '⠟', 'r': '⠗', 's': '⠎', 't': '⠞', 'u': '⠥', 'v': '⠧', 'w': '⠺', 'x': '⠭', 'y': '⠽', 'z': '⠵',
      'A': '⠁', 'B': '⠃', 'C': '⠉', 'D': '⠙', 'E': '⠑', 'F': '⠋', 'G': '⠛', 'H': '⠓', 'I': '⠊', 'J': '⠚', 'K': '⠅', 'L': '⠇', 'M': '⠍', 'N': '⠝', 'O': '⠕', 'P': '⠏', 'Q': '⠟', 'R': '⠗', 'S': '⠎', 'T': '⠞', 'U': '⠥', 'V': '⠧', 'W': '⠺', 'X': '⠭', 'Y': '⠽', 'Z': '⠵',
      '0': '⠚', '1': '⠁', '2': '⠃', '3': '⠉', '4': '⠙', '5': '⠑', '6': '⠋', '7': '⠛', '8': '⠓', '9': '⠊'
    };
    return map[char] || char;
  })},

  // Leet Speak (1337)
  { name: "Leet Speak", category: "leet", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => {
    const map: Record<string, string> = {
      'a': '4', 'b': '8', 'c': '(', 'd': 'Ð', 'e': '3', 'f': 'ƒ', 'g': '9', 'h': '#', 'i': '!', 'j': '_|', 'k': '|<', 'l': '1', 'm': '/\\/\\', 'n': '/\\/', 'o': '0', 'p': '|*', 'q': '9', 'r': '12', 's': '5', 't': '7', 'u': '(_)', 'v': '\\/', 'w': '\\/\\/', 'x': '><', 'y': '`/', 'z': '2',
      'A': '4', 'B': '8', 'C': '(', 'D': 'Ð', 'E': '3', 'F': 'ƒ', 'G': '9', 'H': '#', 'I': '!', 'J': '_|', 'K': '|<', 'L': '1', 'M': '/\\/\\', 'N': '/\\/', 'O': '0', 'P': '|*', 'Q': '9', 'R': '12', 'S': '5', 'T': '7', 'U': '(_)', 'V': '\\/', 'W': '\\/\\/', 'X': '><', 'Y': '`/', 'Z': '2'
    };
    return map[char] || char;
  })},

  // Symbols Mix
  { name: "Symbols Mix", category: "symbols", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => {
    const map: Record<string, string> = {
      'a': '⟒', 'b': '♭', 'c': '☾', 'd': '♦', 'e': '€', 'f': '♠', 'g': '⚬', 'h': '♯', 'i': '☤', 'j': '⚘', 'k': '☃', 'l': '♪', 'm': '♫', 'n': '♩', 'o': '⊕', 'p': '☮', 'q': '♕', 'r': '®', 's': '§', 't': '♣', 'u': '☺', 'v': '✓', 'w': '₩', 'x': '✗', 'y': '¥', 'z': '♩',
      'A': '△', 'B': '♭', 'C': '☾', 'D': '♦', 'E': '€', 'F': '♠', 'G': '⚬', 'H': '♯', 'I': '☤', 'J': '⚘', 'K': '☃', 'L': '♪', 'M': '♫', 'N': '♩', 'O': '⊕', 'P': '☮', 'Q': '♕', 'R': '®', 'S': '§', 'T': '♣', 'U': '☺', 'V': '✓', 'W': '₩', 'X': '✗', 'Y': '¥', 'Z': '♩'
    };
    return map[char] || char;
  })},

  // Geometric Shapes
  { name: "Geometric Shapes", category: "geometric", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => {
    const map: Record<string, string> = {
      'a': '▲', 'b': '■', 'c': '●', 'd': '♦', 'e': '▼', 'f': '▶', 'g': '◆', 'h': '▪', 'i': '▸', 'j': '◗', 'k': '◀', 'l': '◼', 'm': '▬', 'n': '◣', 'o': '⬢', 'p': '◐', 'q': '◑', 'r': '◒', 's': '◓', 't': '◯', 'u': '◞', 'v': '◟', 'w': '◈', 'x': '◊', 'y': '◌', 'z': '◍',
      'A': '▲', 'B': '■', 'C': '●', 'D': '♦', 'E': '▼', 'F': '▶', 'G': '◆', 'H': '▪', 'I': '▸', 'J': '◗', 'K': '◀', 'L': '◼', 'M': '▬', 'N': '◣', 'O': '⬢', 'P': '◐', 'Q': '◑', 'R': '◒', 'S': '◓', 'T': '◯', 'U': '◞', 'V': '◟', 'W': '◈', 'X': '◊', 'Y': '◌', 'Z': '◍'
    };
    return map[char] || char;
  })},

  // Binary Style
  { name: "Binary Style", category: "binary", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => {
    const binaryMap: Record<string, string> = {
      'a': '01100001', 'b': '01100010', 'c': '01100011', 'd': '01100100', 'e': '01100101', 'f': '01100110', 'g': '01100111', 'h': '01101000', 'i': '01101001', 'j': '01101010', 'k': '01101011', 'l': '01101100', 'm': '01101101', 'n': '01101110', 'o': '01101111', 'p': '01110000', 'q': '01110001', 'r': '01110010', 's': '01110011', 't': '01110100', 'u': '01110101', 'v': '01110110', 'w': '01110111', 'x': '01111000', 'y': '01111001', 'z': '01111010',
      'A': '01000001', 'B': '01000010', 'C': '01000011', 'D': '01000100', 'E': '01000101', 'F': '01000110', 'G': '01000111', 'H': '01001000', 'I': '01001001', 'J': '01001010', 'K': '01001011', 'L': '01001100', 'M': '01001101', 'N': '01001110', 'O': '01001111', 'P': '01010000', 'Q': '01010001', 'R': '01010010', 'S': '01010011', 'T': '01010100', 'U': '01010101', 'V': '01010110', 'W': '01010111', 'X': '01011000', 'Y': '01011001', 'Z': '01011010'
    };
    return binaryMap[char] || char;
  }).replace(/(\d{8})/g, '$1 ') },

  // Hexadecimal Style
  { name: "Hexadecimal Style", category: "hex", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => {
    return '0x' + char.charCodeAt(0).toString(16).toUpperCase();
  }).replace(/0x([A-F0-9]+)/g, '0x$1 ') },

  // Morse Code
  { name: "Morse Code", category: "morse", transform: (text) => text.replace(/[a-zA-Z0-9]/g, (char) => {
    const morseMap: Record<string, string> = {
      'a': '.-', 'b': '-...', 'c': '-.-.', 'd': '-..', 'e': '.', 'f': '..-.', 'g': '--.', 'h': '....', 'i': '..', 'j': '.---', 'k': '-.-', 'l': '.-..', 'm': '--', 'n': '-.', 'o': '---', 'p': '.--.', 'q': '--.-', 'r': '.-.', 's': '...', 't': '-', 'u': '..-', 'v': '...-', 'w': '.--', 'x': '-..-', 'y': '-.--', 'z': '--..',
      'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--', 'Z': '--..',
      '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.'
    };
    return morseMap[char] || char;
  }).replace(/([.-]+)/g, '$1 ') },

  // NATO Phonetic
  { name: "NATO Phonetic", category: "nato", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => {
    const natoMap: Record<string, string> = {
      'a': 'Alpha', 'b': 'Bravo', 'c': 'Charlie', 'd': 'Delta', 'e': 'Echo', 'f': 'Foxtrot', 'g': 'Golf', 'h': 'Hotel', 'i': 'India', 'j': 'Juliet', 'k': 'Kilo', 'l': 'Lima', 'm': 'Mike', 'n': 'November', 'o': 'Oscar', 'p': 'Papa', 'q': 'Quebec', 'r': 'Romeo', 's': 'Sierra', 't': 'Tango', 'u': 'Uniform', 'v': 'Victor', 'w': 'Whiskey', 'x': 'X-ray', 'y': 'Yankee', 'z': 'Zulu',
      'A': 'ALPHA', 'B': 'BRAVO', 'C': 'CHARLIE', 'D': 'DELTA', 'E': 'ECHO', 'F': 'FOXTROT', 'G': 'GOLF', 'H': 'HOTEL', 'I': 'INDIA', 'J': 'JULIET', 'K': 'KILO', 'L': 'LIMA', 'M': 'MIKE', 'N': 'NOVEMBER', 'O': 'OSCAR', 'P': 'PAPA', 'Q': 'QUEBEC', 'R': 'ROMEO', 'S': 'SIERRA', 'T': 'TANGO', 'U': 'UNIFORM', 'V': 'VICTOR', 'W': 'WHISKEY', 'X': 'X-RAY', 'Y': 'YANKEE', 'Z': 'ZULU'
    };
    return natoMap[char] || char;
  }).replace(/([A-Za-z-]+)/g, '$1 ') },

  // Subscript Numbers
  { name: "Subscript Numbers", category: "script", transform: (text) => text.replace(/[0-9]/g, (char) => {
    const map: Record<string, string> = {
      '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉'
    };
    return map[char] || char;
  })},

  // Superscript Numbers
  { name: "Superscript Numbers", category: "script", transform: (text) => text.replace(/[0-9]/g, (char) => {
    const map: Record<string, string> = {
      '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹'
    };
    return map[char] || char;
  })},

  // Negative Squared
  { name: "Negative Squared", category: "squares", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => {
    const map: Record<string, string> = {
      'a': '🅰', 'b': '🅱', 'c': '🅲', 'd': '🅳', 'e': '🅴', 'f': '🅵', 'g': '🅶', 'h': '🅷', 'i': '🅸', 'j': '🅹', 'k': '🅺', 'l': '🅻', 'm': '🅼', 'n': '🅽', 'o': '🅾', 'p': '🅿', 'q': '🆀', 'r': '🆁', 's': '🆂', 't': '🆃', 'u': '🆄', 'v': '🆅', 'w': '🆆', 'x': '🆇', 'y': '🆈', 'z': '🆉',
      'A': '🅰', 'B': '🅱', 'C': '🅲', 'D': '🅳', 'E': '🅴', 'F': '🅵', 'G': '🅶', 'H': '🅷', 'I': '🅸', 'J': '🅹', 'K': '🅺', 'L': '🅻', 'M': '🅼', 'N': '🅽', 'O': '🅾', 'P': '🅿', 'Q': '🆀', 'R': '🆁', 'S': '🆂', 'T': '🆃', 'U': '🆄', 'V': '🆅', 'W': '🆆', 'X': '🆇', 'Y': '🆈', 'Z': '🆉'
    };
    return map[char] || char;
  })},

  // Double Underlined
  { name: "Double Underlined", category: "decorative", transform: (text) => text.split('').map(char => char + '\u0333').join('') },

  // Wave Underlined
  { name: "Wave Underlined", category: "decorative", transform: (text) => text.split('').map(char => char + '\u0330').join('') },

  // Ring Above
  { name: "Ring Above", category: "decorative", transform: (text) => text.split('').map(char => char + '\u030A').join('') },

  // Double Grave
  { name: "Double Grave", category: "decorative", transform: (text) => text.split('').map(char => char + '\u030F').join('') },

  // Inverted Breve
  { name: "Inverted Breve", category: "decorative", transform: (text) => text.split('').map(char => char + '\u0311').join('') },

  // Advanced Zalgo
  { name: "Advanced Zalgo", category: "crazy", transform: (text) => {
    const zalgoUp = ['̍', '̎', '̄', '̅', '̿', '̑', '̆', '̐', '͒', '͗', '͑', '̇', '̈', '̊', '͂', '̓', '̈́', '͊', '͋', '͌', '̃', '̂', '̌', '͐', '́', '̋', '̏', '̽', '̉', 'ͣ', 'ͤ', 'ͥ', 'ͦ', 'ͧ', 'ͨ', 'ͩ', 'ͪ', 'ͫ', 'ͬ', 'ͭ', 'ͮ', 'ͯ', '̾', '͛', '͆', '̚'];
    const zalgoDown = ['̖', '̗', '̘', '̙', '̜', '̝', '̞', '̟', '̠', '̤', '̥', '̦', '̩', '̪', '̫', '̬', '̭', '̮', '̯', '̰', '̱', '̲', '̳', '̹', '̺', '̻', '̼', 'ͅ', '͇', '͈', '͉', '͍', '͎', '͓', '͔', '͕', '͖', '͙', '͚', '̻'];
    const zalgoMid = ['̕', '̛', '̀', '́', '͘', '̡', '̢', '̧', '̨', '̴', '̵', '̶', '͜', '͝', '͞', '͟', '͠', '͢', '̸', '̷', '͡'];
    
    return text.split('').map(char => {
      if (char.match(/[a-zA-Z]/)) {
        let result = char;
        const intensity = Math.floor(Math.random() * 5) + 1;
        
        for (let i = 0; i < intensity; i++) {
          const rand = Math.random();
          if (rand < 0.4) {
            result += zalgoUp[Math.floor(Math.random() * zalgoUp.length)];
          } else if (rand < 0.8) {
            result += zalgoDown[Math.floor(Math.random() * zalgoDown.length)];
          } else {
            result += zalgoMid[Math.floor(Math.random() * zalgoMid.length)];
          }
        }
        return result;
      }
      return char;
    }).join('');
  }},

  // Shadow Text
  { name: "Shadow Text", category: "shadow", transform: (text) => text.split('').map(char => char + '҈').join('') },

  // Glitch Text
  { name: "Glitch Text", category: "glitch", transform: (text) => {
    const glitchChars = ['̴', '̵', '̶', '̷', '̸', '̡', '̢', '̧', '̨', '͜', '͝', '͞', '͟', '͠', '͢'];
    return text.split('').map(char => {
      if (char.match(/[a-zA-Z]/)) {
        return char + glitchChars[Math.floor(Math.random() * glitchChars.length)];
      }
      return char;
    }).join('');
  }},

  // Aesthetic Text
  { name: "Aesthetic Text", category: "aesthetic", transform: (text) => text.split('').join(' ').replace(/\s+/g, '  ') },

  // Vapor Wave
  { name: "Vapor Wave", category: "vaporwave", transform: (text) => text.replace(/[a-zA-Z0-9 ]/g, (char) => {
    const map: Record<string, string> = {
      'a': 'ａ', 'b': 'ｂ', 'c': 'ｃ', 'd': 'ｄ', 'e': 'ｅ', 'f': 'ｆ', 'g': 'ｇ', 'h': 'ｈ', 'i': 'ｉ', 'j': 'ｊ', 'k': 'ｋ', 'l': 'ｌ', 'm': 'ｍ', 'n': 'ｎ', 'o': 'ｏ', 'p': 'ｐ', 'q': 'ｑ', 'r': 'ｒ', 's': 'ｓ', 't': 'ｔ', 'u': 'ｕ', 'v': 'ｖ', 'w': 'ｗ', 'x': 'ｘ', 'y': 'ｙ', 'z': 'ｚ',
      'A': 'Ａ', 'B': 'Ｂ', 'C': 'Ｃ', 'D': 'Ｄ', 'E': 'Ｅ', 'F': 'Ｆ', 'G': 'Ｇ', 'H': 'Ｈ', 'I': 'Ｉ', 'J': 'Ｊ', 'K': 'Ｋ', 'L': 'Ｌ', 'M': 'Ｍ', 'N': 'Ｎ', 'O': 'Ｏ', 'P': 'Ｐ', 'Q': 'Ｑ', 'R': 'Ｒ', 'S': 'Ｓ', 'T': 'Ｔ', 'U': 'Ｕ', 'V': 'Ｖ', 'W': 'Ｗ', 'X': 'Ｘ', 'Y': 'Ｙ', 'Z': 'Ｚ',
      '0': '０', '1': '１', '2': '２', '3': '３', '4': '４', '5': '５', '6': '６', '7': '７', '8': '８', '9': '９',
      ' ': '　'
    };
    return map[char] || char;
  }).toUpperCase()},

  // Old English
  { name: "Old English", category: "oldeng", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => {
    const map: Record<string, string> = {
      'a': '𝔞', 'b': '𝔟', 'c': '𝔠', 'd': '𝔡', 'e': '𝔢', 'f': '𝔣', 'g': '𝔤', 'h': '𝔥', 'i': '𝔦', 'j': '𝔧', 'k': '𝔨', 'l': '𝔩', 'm': '𝔪', 'n': '𝔫', 'o': '𝔬', 'p': '𝔭', 'q': '𝔮', 'r': '𝔯', 's': '𝔰', 't': '𝔱', 'u': '𝔲', 'v': '𝔳', 'w': '𝔴', 'x': '𝔵', 'y': '𝔶', 'z': '𝔷',
      'A': '𝔄', 'B': '𝔅', 'C': '𝔞', 'D': '𝔇', 'E': '𝔈', 'F': '𝔉', 'G': '𝔊', 'H': 'ℌ', 'I': 'ℑ', 'J': '𝔍', 'K': '𝔎', 'L': '𝔏', 'M': '𝔐', 'N': '𝔑', 'O': '𝔒', 'P': '𝔓', 'Q': '𝔔', 'R': 'ℜ', 'S': '𝔖', 'T': '𝔗', 'U': '𝔘', 'V': '𝔙', 'W': '𝔚', 'X': '𝔛', 'Y': '𝔜', 'Z': 'ℨ'
    };
    return map[char] || char;
  })},

  // Additional Mathematical Variants
  { name: "Rounded Bold", category: "rounded", transform: (text) => text.replace(/[a-zA-Z0-9]/g, (char) => {
    const map: Record<string, string> = {
      'a': 'ค', 'b': '๒', 'c': 'ς', 'd': '๔', 'e': 'є', 'f': 'Ŧ', 'g': 'ﻮ', 'h': 'ђ', 'i': 'เ', 'j': 'ן', 'k': 'к', 'l': 'ɭ', 'm': '๓', 'n': 'ภ', 'o': '๏', 'p': 'ק', 'q': 'ợ', 'r': 'г', 's': 'ร', 't': 'Շ', 'u': 'ย', 'v': 'ש', 'w': 'ฬ', 'x': 'א', 'y': 'ץ', 'z': 'չ',
      'A': 'ค', 'B': '๒', 'C': 'ς', 'D': '๔', 'E': 'є', 'F': 'Ŧ', 'G': 'ﻮ', 'H': 'ђ', 'I': 'เ', 'J': 'ן', 'K': 'к', 'L': 'ɭ', 'M': '๓', 'N': 'ภ', 'O': '๏', 'P': 'ק', 'Q': 'ợ', 'R': 'г', 'S': 'ร', 'T': 'Շ', 'U': 'ย', 'V': 'ש', 'W': 'ฬ', 'X': 'א', 'Y': 'ץ', 'Z': 'չ',
      '0': '໐', '1': '໑', '2': '໒', '3': '໓', '4': '໔', '5': '໕', '6': '໖', '7': '໗', '8': '໘', '9': '໙'
    };
    return map[char] || char;
  })},

  // Stylish Bold
  { name: "Stylish Bold", category: "stylish", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => {
    const map: Record<string, string> = {
      'a': 'α', 'b': 'в', 'c': 'c', 'd': 'đ', 'e': 'є', 'f': 'ƒ', 'g': 'g', 'h': 'н', 'i': 'ι', 'j': 'נ', 'k': 'к', 'l': 'ℓ', 'm': 'м', 'n': 'η', 'o': 'σ', 'p': 'ρ', 'q': 'q', 'r': 'я', 's': 'ѕ', 't': 'т', 'u': 'υ', 'v': 'ν', 'w': 'ω', 'x': 'χ', 'y': 'у', 'z': 'z',
      'A': 'Α', 'B': 'Β', 'C': 'C', 'D': 'Đ', 'E': 'Є', 'F': 'Ƒ', 'G': 'G', 'H': 'Η', 'I': 'Ι', 'J': 'נ', 'K': 'Κ', 'L': 'Ł', 'M': 'Μ', 'N': 'Η', 'O': 'Ο', 'P': 'Ρ', 'Q': 'Q', 'R': 'Я', 'S': 'Ѕ', 'T': 'Τ', 'U': 'Υ', 'V': 'Ν', 'W': 'Ω', 'X': 'Χ', 'Y': 'Υ', 'Z': 'Z'
    };
    return map[char] || char;
  })},

  // Decorative Style 1 - Lucky Style
  { name: "Lucky Style", category: "decorative", transform: (text) => `꧁༒☬☠${text}☠︎☬༒꧂` },

  // Decorative Style 2 - Ninja Style
  { name: "Ninja Decorative", category: "decorative", transform: (text) => `꧁༺${text}༻꧂` },

  // Decorative Style 3 - Joker Style
  { name: "Joker Style", category: "decorative", transform: (text) => `꧁༺J꙰O꙰K꙰E꙰R꙰༻꧂༄●⃝ᶫᵒꪜe☯ᴮᴼᵞ࿐` },

  // Decorative Style 4 - Alone Boy
  { name: "Alone Boy", category: "decorative", transform: (text) => `×͜×ㅤ${text}ㅤ𝙱𝙾𝚈` },

  // Decorative Style 5 - Sunny Style
  { name: "Sunny Style", category: "decorative", transform: (text) => `亗꧁༒☬${text}☬༒꧂` },

  // Decorative Style 6 - Royal Crown
  { name: "Royal Crown", category: "decorative", transform: (text) => `◥꧁ད ঔৣ͎.͎${text}ঔৣ͎.͎ད꧂◤` },

  // Decorative Style 7 - Diamond Border
  { name: "Diamond Border", category: "decorative", transform: (text) => `♦◊◊『${text}』◊◊♦` },

  // Decorative Style 8 - Star Frame
  { name: "Star Frame", category: "decorative", transform: (text) => `★·.·´¯\`·.·★ ${text} ★·.·´¯\`·.·★` },

  // Decorative Style 9 - Gothic Style
  { name: "Gothic Style", category: "decorative", transform: (text) => `ঔৣ☬✞✞☬ঔৣ${text}ঔৣ☬✞✞☬ঔৣ` },

  // Decorative Style 10 - King Style
  { name: "King Style", category: "decorative", transform: (text) => `꧁░K░I░N░G░${text}░꧂` },

  // Decorative Style 11 - Queen Style
  { name: "Queen Style", category: "decorative", transform: (text) => `꧁✦Q✦U✦E✦E✦N✦${text}✦꧂` },

  // Decorative Style 12 - Boss Style
  { name: "Boss Style", category: "decorative", transform: (text) => `⚡${text}⚡Boss⚡` },

  // Decorative Style 13 - Pro Style
  { name: "Pro Style", category: "decorative", transform: (text) => `🅿🆁🅾${text}` },

  // Decorative Style 14 - Cool Style
  { name: "Cool Style", category: "decorative", transform: (text) => `༺ ̊ ༻-×͜×-༺ ̊ ༻ ${text} ༺ ̊ ༻-×͜×-༺ ̊ ༻` },

  // Decorative Style 15 - Attitude Style
  { name: "Attitude Style", category: "decorative", transform: (text) => `☬ᴮᴬᴰʙᴏʏ☬${text}☬ᴮᴬᴰʙᴏʏ☬` },

  // Decorative Style 16 - Legend Style
  { name: "Legend Style", category: "decorative", transform: (text) => `꧁༺₦Ї₦ℑ₳༻꧂${text}` },

  // Decorative Style 17 - Master Style
  { name: "Master Style", category: "decorative", transform: (text) => `♔♕♔${text}♔♕♔` },

  // Decorative Style 18 - God Style
  { name: "God Style", category: "decorative", transform: (text) => `【†】【G】【O】【D】${text}【†】` },

  // Decorative Style 19 - Shadow Style
  { name: "Shadow Decorative", category: "decorative", transform: (text) => `ঔৣͦͬ░░♕๖ۣۜǤнσѕт♕░░ঔৣͦͬ${text}` },

  // Decorative Style 20 - Hunter Style
  { name: "Hunter Style", category: "decorative", transform: (text) => `᭄ꦿ᭄ꦿ${text}ꦿ᭄ꦿ᭄` },

  // Decorative Style 21 - Killer Style
  { name: "Killer Style", category: "decorative", transform: (text) => `K͓̽I͓̽L͓̽L͓̽E͓̽R͓̽${text}` },

  // Decorative Style 22 - Prince Style
  { name: "Prince Style", category: "decorative", transform: (text) => `◤◢◣◥◤◢◣◥${text}◤◢◣◥◤◢◣◥` },

  // Decorative Style 23 - Princess Style
  { name: "Princess Style", category: "decorative", transform: (text) => `•◦✦◦•◦✦◦•${text}•◦✦◦•◦✦◦•` },

  // Decorative Style 24 - Stylish Border
  { name: "Stylish Border", category: "decorative", transform: (text) => `ミ★彡★彡${text}彡★彡★ミ` },

  // Decorative Style 25 - Warrior Frame
  { name: "Warrior Frame", category: "decorative", transform: (text) => `░W░A░R░R░I░O░R░${text}` },

  // Decorative Style 26 - Champion Style
  { name: "Champion Style", category: "decorative", transform: (text) => `C̸H̸A̸M̸P̸I̸O̸N̸${text}` },

  // Decorative Style 27 - Elite Style
  { name: "Elite Style", category: "decorative", transform: (text) => `ᴱᴸᴵᵀᴱ${text}ᴱᴸᴵᵀᴱ` },

  // Decorative Style 28 - Alpha Style
  { name: "Alpha Style", category: "decorative", transform: (text) => `ΛŁƤĦΛ${text}ΛŁƤĦΛ` },

  // Decorative Style 29 - Beta Style
  { name: "Beta Style", category: "decorative", transform: (text) => `乃乇ㄒ卂${text}乃乇ㄒ卂` },

  // Decorative Style 30 - Sigma Style
  { name: "Sigma Style", category: "decorative", transform: (text) => `ΣIᎶmΛ${text}ΣIᎶmΛ` },

  // Bubble Letter
  { name: "Bubble Letter", category: "bubble", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => {
    const map: Record<string, string> = {
      'a': 'ᵃ', 'b': 'ᵇ', 'c': 'ᶜ', 'd': 'ᵈ', 'e': 'ᵉ', 'f': 'ᶠ', 'g': 'ᵍ', 'h': 'ʰ', 'i': 'ⁱ', 'j': 'ʲ', 'k': 'ᵏ', 'l': 'ˡ', 'm': 'ᵐ', 'n': 'ⁿ', 'o': 'ᵒ', 'p': 'ᵖ', 'q': 'q', 'r': 'ʳ', 's': 'ˢ', 't': 'ᵗ', 'u': 'ᵘ', 'v': 'ᵛ', 'w': 'ʷ', 'x': 'ˣ', 'y': 'ʸ', 'z': 'ᶻ',
      'A': 'ᴬ', 'B': 'ᴮ', 'C': 'ᶜ', 'D': 'ᴰ', 'E': 'ᴱ', 'F': 'ᶠ', 'G': 'ᴳ', 'H': 'ᴴ', 'I': 'ᴵ', 'J': 'ᴶ', 'K': 'ᴷ', 'L': 'ᴸ', 'M': 'ᴹ', 'N': 'ᴺ', 'O': 'ᴼ', 'P': 'ᴾ', 'Q': 'Q', 'R': 'ᴿ', 'S': 'ˢ', 'T': 'ᵀ', 'U': 'ᵁ', 'V': 'ⱽ', 'W': 'ᵂ', 'X': 'ˣ', 'Y': 'ʸ', 'Z': 'ᶻ'
    };
    return '○' + map[char] + '○';
  })},

  // Neon Style
  { name: "Neon Style", category: "neon", transform: (text) => text.split('').map(char => '▫' + char + '▫').join('') },

  // Galaxy Style
  { name: "Galaxy Style", category: "galaxy", transform: (text) => text.split('').map(char => '✦' + char + '✦').join('') },

  // Shadow Bold
  { name: "Shadow Bold", category: "shadow", transform: (text) => text.split('').map(char => char + '◉').join('') },

  // Glow Effect
  { name: "Glow Effect", category: "glow", transform: (text) => text.split('').map(char => '☼' + char + '☼').join('') },

  // Diamond Style
  { name: "Diamond Style", category: "diamond", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => '◆' + char + '◆') },

  // Crown Style
  { name: "Crown Style", category: "crown", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => '♔' + char + '♔') },

  // Heart Style
  { name: "Heart Style", category: "heart", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => '♡' + char + '♡') },

  // Star Border
  { name: "Star Border", category: "star", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => '✦' + char + '✦') },

  // Moon Style
  { name: "Moon Style", category: "moon", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => '☾' + char + '☽') },

  // Sun Style
  { name: "Sun Style", category: "sun", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => '☀' + char + '☀') },

  // Arrow Style
  { name: "Arrow Style", category: "arrow", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => '➤' + char + '➤') },

  // Music Style
  { name: "Music Style", category: "music", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => '♪' + char + '♪') },

  // Gaming Style
  { name: "Gaming Style", category: "gaming", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => '⚡' + char + '⚡') },

  // Tech Style
  { name: "Tech Style", category: "tech", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => '⚡' + char + '⚡') },

  // Cyber Style
  { name: "Cyber Style", category: "cyber", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => '▸' + char + '◂') },

  // Matrix Style
  { name: "Matrix Style", category: "matrix", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => '●' + char + '●') },

  // Retro Style
  { name: "Retro Style", category: "retro", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => '◄' + char + '►') },

  // Vintage Style
  { name: "Vintage Style", category: "vintage", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => '◊' + char + '◊') },

  // Modern Style
  { name: "Modern Style", category: "modern", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => '▪' + char + '▪') },

  // Minimal Style
  { name: "Minimal Style", category: "minimal", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => '◦' + char + '◦') },

  // Elegant Style
  { name: "Elegant Style", category: "elegant", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => '✦' + char + '✦') },

  // Luxury Style
  { name: "Luxury Style", category: "luxury", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => '◈' + char + '◈') },

  // Royal Style
  { name: "Royal Style", category: "royal", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => '♛' + char + '♛') },

  // Warrior Style
  { name: "Warrior Style", category: "warrior", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => '⚔' + char + '⚔') },

  // Angel Style
  { name: "Angel Style", category: "angel", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => '☪' + char + '☪') },

  // Devil Style
  { name: "Devil Style", category: "devil", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => '⸸' + char + '⸸') },

  // Ghost Style
  { name: "Ghost Style", category: "ghost", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => '◯' + char + '◯') },

  // Skull Style
  { name: "Skull Style", category: "skull", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => '☠' + char + '☠') },

  // Robot Style
  { name: "Robot Style", category: "robot", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => '⧨' + char + '⧨') },

  // Alien Style
  { name: "Alien Style", category: "alien", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => '◉' + char + '◉') },

  // Space Style
  { name: "Space Style", category: "space", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => '✦' + char + '✧') },

  // Ocean Style
  { name: "Ocean Style", category: "ocean", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => '〰' + char + '〰') },

  // Forest Style
  { name: "Forest Style", category: "forest", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => '♠' + char + '♠') },

  // Mountain Style
  { name: "Mountain Style", category: "mountain", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => '▲' + char + '▲') },

  // Desert Style
  { name: "Desert Style", category: "desert", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => '◇' + char + '◇') },

  // Jungle Style
  { name: "Jungle Style", category: "jungle", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => '♧' + char + '♧') },

  // City Style
  { name: "City Style", category: "city", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => '▦' + char + '▦') },

  // Wild Style
  { name: "Wild Style", category: "wild", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => '♦' + char + '♦') },

  // Dragon Style
  { name: "Dragon Style", category: "dragon", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => '☬' + char + '☬') },

  // Phoenix Style
  { name: "Phoenix Style", category: "phoenix", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => '☥' + char + '☥') },

  // Thunder Style
  { name: "Thunder Style", category: "thunder", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => '⚡' + char + '⚡') },

  // Storm Style
  { name: "Storm Style", category: "storm", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => '◉' + char + '◉') },

  // Tornado Style
  { name: "Tornado Style", category: "tornado", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => '◐' + char + '◑') },

  // Rainbow Style
  { name: "Rainbow Style", category: "rainbow", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => '◈' + char + '◈') },

  // Flower Style
  { name: "Flower Style", category: "flower", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => '❀' + char + '❀') },

  // Butterfly Style
  { name: "Butterfly Style", category: "butterfly", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => '❅' + char + '❅') },

  // Crystal Style
  { name: "Crystal Style", category: "crystal", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => '◆' + char + '◆') },

  // Magic Style
  { name: "Magic Style", category: "magic", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => '☆' + char + '☆') },

  // Wizard Style
  { name: "Wizard Style", category: "wizard", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => '✦' + char + '✦') },

  // Ninja Style
  { name: "Ninja Style", category: "ninja", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => '⚹' + char + '⚹') },

  // Pirate Style
  { name: "Pirate Style", category: "pirate", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => '☠' + char + '☠') },

  // Viking Style
  { name: "Viking Style", category: "viking", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => '⚔' + char + '⚔') },

  // Knight Style
  { name: "Knight Style", category: "knight", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => '♜' + char + '♜') },

  // Samurai Style
  { name: "Samurai Style", category: "samurai", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => '⚔' + char + '⚔') },

  // Gladiator Style
  { name: "Gladiator Style", category: "gladiator", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => '⛨' + char + '⛨') },

  // Spartan Style
  { name: "Spartan Style", category: "spartan", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => '⛊' + char + '⛊') },

  // Aztec Style
  { name: "Aztec Style", category: "aztec", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => '▲' + char + '▲') },

  // Egyptian Style
  { name: "Egyptian Style", category: "egyptian", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => '▲' + char + '▲') },

  // Greek Style Ancient
  { name: "Greek Ancient", category: "ancient", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => '♔' + char + '♔') },

  // Roman Style
  { name: "Roman Style", category: "roman-style", transform: (text) => text.replace(/[a-zA-Z]/g, (char) => '⚜' + char + '⚜') },

  // Additional Complex Decorative Styles
  // Mystical Frame
  { name: "Mystical Frame", category: "mystical", transform: (text) => `꧁☬⚡︎${text}⚡︎☬꧂` },

  // Death Knight
  { name: "Death Knight", category: "death-knight", transform: (text) => `꧁༒☠︎${text}☠︎༒꧂` },

  // Crown Royal
  { name: "Crown Royal", category: "crown-royal", transform: (text) => `꧁♛◊${text}◊♛꧂` },

  // Shadow Warrior
  { name: "Shadow Warrior", category: "shadow-warrior", transform: (text) => `꧁◈⚔${text}⚔◈꧂` },

  // Fire Dragon
  { name: "Fire Dragon", category: "fire-dragon", transform: (text) => `꧁🔥🐉${text}🐉🔥꧂` },

  // Ice Crystal
  { name: "Ice Crystal", category: "ice-crystal", transform: (text) => `꧁❅◊${text}◊❅꧂` },

  // Lightning Storm
  { name: "Lightning Storm", category: "lightning-storm", transform: (text) => `꧁⚡☬${text}☬⚡꧂` },

  // Ancient Runes
  { name: "Ancient Runes", category: "ancient-runes", transform: (text) => `꧁ᚱᚢᚾᛖ${text}ᚱᚢᚾᛖ꧂` },

  // Demon Lord
  { name: "Demon Lord", category: "demon-lord", transform: (text) => `꧁༺☠︎⚡${text}⚡☠︎༻꧂` },

  // Angel Wings
  { name: "Angel Wings", category: "angel-wings", transform: (text) => `꧁༒☪☬${text}☬☪༒꧂` },

  // Skull Crown
  { name: "Skull Crown", category: "skull-crown", transform: (text) => `꧁☠︎♛⚔${text}⚔♛☠︎꧂` },

  // Gothic Cross
  { name: "Gothic Cross", category: "gothic-cross", transform: (text) => `꧁✠☬†${text}†☬✠꧂` },

  // Vampire Lord
  { name: "Vampire Lord", category: "vampire-lord", transform: (text) => `꧁༒⚰️🦇${text}🦇⚰️༒꧂` },

  // Phoenix Fire
  { name: "Phoenix Fire", category: "phoenix-fire", transform: (text) => `꧁🔥🦅✨${text}✨🦅🔥꧂` },

  // Dark Magic
  { name: "Dark Magic", category: "dark-magic", transform: (text) => `꧁◈☬༒${text}༒☬◈꧂` },

  // Thunder God
  { name: "Thunder God", category: "thunder-god", transform: (text) => `꧁⚡👑⚡${text}⚡👑⚡꧂` },

  // Blood Moon
  { name: "Blood Moon", category: "blood-moon", transform: (text) => `꧁☾☬☠︎${text}☠︎☬☾꧂` },

  // Crystal Sword
  { name: "Crystal Sword", category: "crystal-sword", transform: (text) => `꧁◆⚔💎${text}💎⚔◆꧂` },

  // Frost King
  { name: "Frost King", category: "frost-king", transform: (text) => `꧁❅👑❄️${text}❄️👑❅꧂` },

  // Shadow Blade
  { name: "Shadow Blade", category: "shadow-blade", transform: (text) => `꧁◈⚔︎⚡${text}⚡⚔︎◈꧂` },

  // Divine Light
  { name: "Divine Light", category: "divine-light", transform: (text) => `꧁✨☪✨${text}✨☪✨꧂` },

  // War Chief
  { name: "War Chief Style", category: "war-chief", transform: (text) => `꧁⚔🛡️⚔${text}⚔🛡️⚔꧂` },

  // Mystic Portal
  { name: "Mystic Portal", category: "mystic-portal", transform: (text) => `꧁🌀✨🔮${text}🔮✨🌀꧂` },

  // Dragon Slayer
  { name: "Dragon Slayer Style", category: "dragon-slayer", transform: (text) => `꧁⚔🐉⚡${text}⚡🐉⚔꧂` },

  // Void Walker
  { name: "Void Walker Style", category: "void-walker", transform: (text) => `꧁◉☬⚫${text}⚫☬◉꧂` },

  // Star Guardian
  { name: "Star Guardian Style", category: "star-guardian", transform: (text) => `꧁⭐✨🌟${text}🌟✨⭐꧂` },

  // Shadow Emperor
  { name: "Shadow Emperor Style", category: "shadow-emperor", transform: (text) => `꧁👑⚫🖤${text}🖤⚫👑꧂` },

  // Fire Serpent
  { name: "Fire Serpent Style", category: "fire-serpent", transform: (text) => `꧁🔥🐍⚡${text}⚡🐍🔥꧂` },

  // Ice Phoenix
  { name: "Ice Phoenix Style", category: "ice-phoenix", transform: (text) => `꧁❄️🦅💎${text}💎🦅❄️꧂` },

  // Blood Warrior
  { name: "Blood Warrior Style", category: "blood-warrior", transform: (text) => `꧁⚔🩸⚡${text}⚡🩸⚔꧂` },

  // Cosmic Mage
  { name: "Cosmic Mage Style", category: "cosmic-mage", transform: (text) => `꧁🌌✨🔮${text}🔮✨🌌꧂` }
];

export default function FancyTextGenerator() {
  const [inputText, setInputText] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const { toast } = useToast();

  const filteredStyles = useMemo(() => {
    if (!searchFilter) return FONT_STYLES;
    return FONT_STYLES.filter(style => 
      style.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      style.category.toLowerCase().includes(searchFilter.toLowerCase())
    );
  }, [searchFilter]);

  const copyToClipboard = async (text: string, styleName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${styleName} style copied to clipboard.`,
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const insertSymbol = (symbol: string) => {
    setInputText(prev => prev + symbol);
  };

  const copySymbol = async (symbol: string) => {
    try {
      await navigator.clipboard.writeText(symbol);
      toast({
        title: "Symbol Copied!",
        description: `${symbol} copied to clipboard.`,
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy symbol to clipboard.",
        variant: "destructive",
      });
    }
  };

  const exampleNames = [
    "ProGamer",
    "ShadowHunter", 
    "FireStorm",
    "IceQueen",
    "NightWolf",
    "StarPlayer",
    "CyberNinja",
    "DiamondKing"
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">

      {/* Symbol Panels */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            Special Symbols
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Click to add to text • Shift+Click or Right-click to copy symbol
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-8 sm:grid-cols-12 md:grid-cols-16 lg:grid-cols-20 gap-2">
            {SPECIAL_SYMBOLS.map((symbol, index) => (
              <Button
                key={`special-${index}`}
                variant="outline"
                size="sm"
                onClick={(e) => {
                  if (e.shiftKey) {
                    copySymbol(symbol);
                  } else {
                    insertSymbol(symbol);
                  }
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  copySymbol(symbol);
                }}
                className="h-10 w-10 p-0 text-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors cursor-pointer"
                title={`Click to add • Shift+Click or Right-click to copy`}
              >
                {symbol}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emoji Styling Panel */}
      <Card className="bg-gradient-to-r from-pink-50 to-orange-50 dark:from-pink-900/20 dark:to-orange-900/20 border-pink-200 dark:border-pink-800">
        <CardHeader>
          <CardTitle className="text-lg">Emoji Styling</CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Click to add to text • Shift+Click or Right-click to copy emoji
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-8 sm:grid-cols-12 md:grid-cols-16 lg:grid-cols-20 gap-2">
            {EMOJI_SYMBOLS.map((emoji, index) => (
              <Button
                key={`emoji-${index}`}
                variant="outline"
                size="sm"
                onClick={(e) => {
                  if (e.shiftKey) {
                    copySymbol(emoji);
                  } else {
                    insertSymbol(emoji);
                  }
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  copySymbol(emoji);
                }}
                className="h-10 w-10 p-0 text-lg hover:bg-pink-100 dark:hover:bg-pink-900/50 transition-colors cursor-pointer"
                title={`Click to add • Shift+Click or Right-click to copy`}
              >
                {emoji}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Input Section */}
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="space-y-4">
            <label htmlFor="input-text" className="text-sm font-medium block">
              Enter Your Text
            </label>
            <Input
              id="input-text"
              placeholder="Type your name or text here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="text-lg p-4 border-2 focus:border-blue-500 transition-colors"
            />
          </div>
        </CardContent>
      </Card>

      {/* Search Filter */}
      {inputText && (
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search font styles..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Font Styles Results */}
      {inputText && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Fancy Text Results
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

      {/* Example Names Section */}
      <Card className="shadow-lg bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            Example Gaming Names
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {exampleNames.map((name) => (
              <Button
                key={name}
                variant="ghost"
                size="sm"
                onClick={() => setInputText(name)}
                className="justify-start text-sm hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
              >
                {name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* SEO Footer */}
      <div className="text-xs text-gray-500 dark:text-gray-400 space-y-2 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <p><strong>Popular uses:</strong> Instagram stylish names, BGMI fancy text, FreeFire username generator, Discord fancy fonts, WhatsApp stylish text</p>
        <p><strong>Categories:</strong> Bold fonts, Italic text, Cursive writing, Gothic letters, Asian characters, Decorative symbols, Gaming usernames</p>
      </div>
    </div>
  );
}