import React from "react";

export interface CharacterInfo {
  id: string;
  name: string;
  badge: string;
  description: string;
  tagline: string;
  avatarBg: string;
  primaryColor: string;
}

export const CHARACTER_ROSTER: CharacterInfo[] = [
  {
    id: "noob",
    name: "Roblox Noob Classic",
    badge: "Si Kuning Ikonik",
    description: "Karakter paling legendaris dengan wajah kuning polos & baju biru ceria.",
    tagline: "OOF! Cerita kocak & apes seru!",
    avatarBg: "#ffd700",
    primaryColor: "#0066cc",
  },
  {
    id: "bacon",
    name: "Bacon Hair Guy",
    badge: "Rambut Bacon",
    description: "Karakter cowok kasual berambut bacon cokelat, ramah dan santai.",
    tagline: "Cerita curhat & POV harian.",
    avatarBg: "#8b4513",
    primaryColor: "#0284c7",
  },
  {
    id: "pink_girl",
    name: "Pink Gamer Girl",
    badge: "Kawaii Gamer",
    description: "Karakter cewek berambut pink pastel dengan headset telinga kucing.",
    tagline: "Tips gaming & cerita seru.",
    avatarBg: "#f472b6",
    primaryColor: "#ec4899",
  },
  {
    id: "police",
    name: "Police Officer / SWAT",
    badge: "Penjaga Ketertiban",
    description: "Petugas polisi dengan topi dinas, kacamata hitam, dan rompi taktis.",
    tagline: "Investigasi & drama hukum game!",
    avatarBg: "#1e3a8a",
    primaryColor: "#3b82f6",
  },
  {
    id: "dominus",
    name: "Dominus Sultan",
    badge: "Lord Sultan 👑",
    description: "Karakter bertudung hitam mistis dengan mata neon ungu & aura sultan.",
    tagline: "Pamer item langka & flexing!",
    avatarBg: "#581c87",
    primaryColor: "#a855f7",
  },
  {
    id: "hacker",
    name: "Hacker / Guest 666",
    badge: "Misteri Horor",
    description: "Hoodie hitam gelap dengan mata merah menyala dan senyum menyeramkan.",
    tagline: "Creepypasta & misteri server.",
    avatarBg: "#7f1d1d",
    primaryColor: "#ef4444",
  },
  {
    id: "chill_guy",
    name: "Chill Guy / Streetwear",
    badge: "Santai Abis",
    description: "Karakter santai dengan beanie hat, kacamata bulat, dan sweater tebal.",
    tagline: "Nasihat hidup & santai bro.",
    avatarBg: "#78350f",
    primaryColor: "#f59e0b",
  },
  {
    id: "ceo",
    name: "CEO / Mafia Boss",
    badge: "Eksekutif",
    description: "Setelan jas hitam elegan, dasi merah sutra, dan aura pebisnis tajir.",
    tagline: "Mindset miliarder & tips cuan.",
    avatarBg: "#0f172a",
    primaryColor: "#dc2626",
  },
  {
    id: "olip",
    name: "Olip Chibi (Dark Chic)",
    badge: "Asisten Olip",
    description: "Rambut hitam panjang lurus berkilau, mata tajam manis, choker elegan.",
    tagline: "Storyteller setia Aa Baim.",
    avatarBg: "#18181b",
    primaryColor: "#f43f5e",
  },
  {
    id: "custom",
    name: "Upload Karakter Sendiri",
    badge: "Kustom PNG",
    description: "Unggah gambar PNG karakter atau foto bebas sesuai keinginan Aa Baim.",
    tagline: "Bebas berkreasi tanpa batas!",
    avatarBg: "#334155",
    primaryColor: "#38bdf8",
  },
];

export const BACKGROUND_THEMES = [
  {
    id: "rainbow_obby",
    name: "Rainbow Obby",
    desc: "Platform parkour warna-warni melayang di angkasa",
    color: "#ec4899",
  },
  {
    id: "minecraft",
    name: "Minecraft Parkour",
    desc: "Blok voxel rumput, batu, dan awan piksel",
    color: "#22c55e",
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk Night",
    desc: "Gedung pencakar langit neon ungu kebiruan",
    color: "#8b5cf6",
  },
  {
    id: "studio",
    name: "Dark Gamer Studio",
    desc: "Studio gaming gelap dengan panel akustik & lampu LED",
    color: "#06b6d4",
  },
];

// SVG Character Renderer with talking mouth flap and eye blinking
export const RobloxCharacterAvatar: React.FC<{
  characterId: string;
  isTalking: boolean;
  isBlinking: boolean;
  mouthOpen: boolean;
  customAvatarUrl?: string;
  size?: number;
}> = ({
  characterId,
  isTalking,
  isBlinking,
  mouthOpen,
  customAvatarUrl,
  size = 460,
}) => {
  // If custom upload image
  if (characterId === "custom" && customAvatarUrl) {
    return (
      <div
        style={{
          width: size,
          height: size,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <img
          src={customAvatarUrl}
          alt="Custom Avatar"
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
            filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.6))",
          }}
        />
        {/* Talking sound wave indicator */}
        {isTalking && (
          <div
            style={{
              position: "absolute",
              bottom: 20,
              right: 20,
              padding: "6px 14px",
              background: "#38bdf8",
              color: "#0f172a",
              borderRadius: 20,
              fontWeight: 800,
              fontSize: 14,
              boxShadow: "0 0 15px rgba(56, 189, 248, 0.8)",
            }}
          >
            🎙️ TALKING
          </div>
        )}
      </div>
    );
  }

  // Mouth rendering helper
  const renderMouth = (style: "happy" | "cool" | "creepy" | "serious" | "sweet") => {
    if (isTalking && mouthOpen) {
      // Open mouth for speech
      return (
        <ellipse
          cx="100"
          cy="125"
          rx={style === "creepy" ? "14" : "12"}
          ry={style === "creepy" ? "18" : "14"}
          fill="#1e1e1e"
          stroke="#ef4444"
          strokeWidth={style === "creepy" ? "3" : "0"}
        >
          {/* Tongue inside mouth */}
          <path d="M 94 132 Q 100 137 106 132" fill="#f87171" />
        </ellipse>
      );
    }

    // Closed mouth variations
    switch (style) {
      case "happy":
        return <path d="M 88 122 Q 100 134 112 122" stroke="#1f2937" strokeWidth="4" fill="none" strokeLinecap="round" />;
      case "cool":
        return <path d="M 90 124 Q 102 128 110 122" stroke="#1f2937" strokeWidth="4" fill="none" strokeLinecap="round" />;
      case "creepy":
        return <path d="M 85 125 Q 100 115 115 125 Q 100 140 85 125" fill="#7f1d1d" stroke="#ef4444" strokeWidth="3" />;
      case "serious":
        return <line x1="90" y1="125" x2="110" y2="125" stroke="#1f2937" strokeWidth="4" strokeLinecap="round" />;
      case "sweet":
        return <path d="M 92 123 Q 100 129 108 123" stroke="#e11d48" strokeWidth="4" fill="#fb7185" strokeLinecap="round" />;
    }
  };

  // Eye rendering helper with blinking
  const renderEyes = (type: "dot" | "shades" | "anime" | "glow_purple" | "glow_red" | "glasses") => {
    if (isBlinking && type !== "shades" && type !== "glow_purple" && type !== "glow_red") {
      // Blinking eyes: flat line
      return (
        <g stroke="#1f2937" strokeWidth="4" strokeLinecap="round">
          <line x1="72" y1="92" x2="88" y2="92" />
          <line x1="112" y1="92" x2="128" y2="92" />
        </g>
      );
    }

    switch (type) {
      case "dot":
        return (
          <g fill="#1f2937">
            <ellipse cx="80" cy="92" rx="6" ry="8" />
            <ellipse cx="120" cy="92" rx="6" ry="8" />
            {/* Catchlight */}
            <circle cx="82" cy="89" r="2.5" fill="#ffffff" />
            <circle cx="122" cy="89" r="2.5" fill="#ffffff" />
          </g>
        );
      case "shades":
        return (
          <g>
            <polygon points="65,85 95,85 90,105 70,105" fill="#09090b" stroke="#fbbf24" strokeWidth="2" />
            <polygon points="105,85 135,85 130,105 110,105" fill="#09090b" stroke="#fbbf24" strokeWidth="2" />
            <line x1="95" y1="90" x2="105" y2="90" stroke="#fbbf24" strokeWidth="3" />
            {/* Reflection lens shine */}
            <line x1="70" y1="88" x2="85" y2="102" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
            <line x1="110" y1="88" x2="125" y2="102" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
          </g>
        );
      case "anime":
        return (
          <g>
            <ellipse cx="78" cy="92" rx="9" ry="12" fill="#0f172a" />
            <ellipse cx="122" cy="92" rx="9" ry="12" fill="#0f172a" />
            <ellipse cx="78" cy="95" rx="7" ry="8" fill="#ec4899" />
            <ellipse cx="122" cy="95" rx="7" ry="8" fill="#ec4899" />
            {/* Sparkle stars */}
            <circle cx="76" cy="88" r="3.5" fill="#ffffff" />
            <circle cx="82" cy="96" r="1.8" fill="#ffffff" />
            <circle cx="120" cy="88" r="3.5" fill="#ffffff" />
            <circle cx="126" cy="96" r="1.8" fill="#ffffff" />
          </g>
        );
      case "glow_purple":
        return (
          <g filter="drop-shadow(0 0 10px #c084fc)">
            <polygon points="70,90 90,86 85,98" fill="#d8b4fe" />
            <polygon points="130,90 110,86 115,98" fill="#d8b4fe" />
          </g>
        );
      case "glow_red":
        return (
          <g filter="drop-shadow(0 0 12px #ef4444)">
            <ellipse cx="78" cy="92" rx="8" ry="10" fill="#dc2626" />
            <ellipse cx="122" cy="92" rx="8" ry="10" fill="#dc2626" />
            <circle cx="78" cy="92" r="3" fill="#ffffff" />
            <circle cx="122" cy="92" r="3" fill="#ffffff" />
          </g>
        );
      case "glasses":
        return (
          <g>
            <circle cx="78" cy="92" r="14" fill="none" stroke="#d97706" strokeWidth="3" />
            <circle cx="122" cy="92" r="14" fill="none" stroke="#d97706" strokeWidth="3" />
            <line x1="92" y1="92" x2="108" y2="92" stroke="#d97706" strokeWidth="3" />
            <ellipse cx="78" cy="92" rx="5" ry="6" fill="#1f2937" />
            <ellipse cx="122" cy="92" rx="5" ry="6" fill="#1f2937" />
          </g>
        );
    }
  };

  return (
    <div
      style={{
        width: size,
        height: size,
        filter: "drop-shadow(0 25px 35px rgba(0,0,0,0.65))",
        position: "relative",
      }}
    >
      <svg
        viewBox="0 0 200 240"
        width="100%"
        height="100%"
        style={{ overflow: "visible" }}
      >
        <defs>
          <radialGradient id="noobSkin" cx="40%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#fff066" />
            <stop offset="100%" stopColor="#ffd700" />
          </radialGradient>
          <radialGradient id="fairSkin" cx="40%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffedd5" />
            <stop offset="100%" stopColor="#fed7aa" />
          </radialGradient>
          <radialGradient id="olipSkin" cx="40%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#fff1f2" />
            <stop offset="100%" stopColor="#ffe4e6" />
          </radialGradient>
        </defs>

        {/* 1. NOOB CLASSIC */}
        {characterId === "noob" && (
          <g>
            {/* Torso */}
            <rect x="55" y="160" width="90" height="75" rx="8" fill="#0066cc" />
            {/* Left Arm & Right Arm */}
            <rect x="25" y="160" width="25" height="70" rx="8" fill="#ffd700" />
            <rect x="150" y="160" width="25" height="70" rx="8" fill="#ffd700" />
            {/* Roblox White R on chest */}
            <rect x="90" y="175" width="20" height="20" rx="3" fill="#ffffff" />
            <rect x="94" y="179" width="12" height="12" rx="1" fill="#0066cc" />
            {/* Head (Square blocky with rounded corners) */}
            <rect x="60" y="55" width="80" height="85" rx="16" fill="url(#noobSkin)" stroke="#eab308" strokeWidth="2" />
            {renderEyes("dot")}
            {renderMouth("happy")}
          </g>
        )}

        {/* 2. BACON HAIR GUY */}
        {characterId === "bacon" && (
          <g>
            {/* Torso Denim Jacket */}
            <rect x="55" y="160" width="90" height="75" rx="8" fill="#0284c7" />
            <polygon points="85,160 115,160 100,185" fill="#f8fafc" />
            {/* Arms */}
            <rect x="25" y="160" width="25" height="70" rx="8" fill="#0284c7" />
            <rect x="150" y="160" width="25" height="70" rx="8" fill="#0284c7" />
            {/* Head */}
            <rect x="60" y="55" width="80" height="85" rx="16" fill="url(#fairSkin)" />
            {/* Iconic Bacon Hair wavy strands on top */}
            <path
              d="M 50 65 Q 60 25 100 28 Q 140 25 150 65 Q 155 85 145 95 Q 135 50 100 48 Q 65 50 55 95 Z"
              fill="#854d0e"
            />
            {/* Bacon wavy highlights */}
            <path d="M 65 55 Q 100 40 135 55" stroke="#ca8a04" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M 75 68 Q 100 55 125 68" stroke="#ca8a04" strokeWidth="3" fill="none" strokeLinecap="round" />
            {renderEyes("dot")}
            {renderMouth("cool")}
          </g>
        )}

        {/* 3. PINK GAMER GIRL */}
        {characterId === "pink_girl" && (
          <g>
            {/* Torso: Pastel Pink Hoodie */}
            <rect x="55" y="160" width="90" height="75" rx="10" fill="#f472b6" />
            <circle cx="100" cy="190" r="10" fill="#ffffff" />
            <path d="M 100 183 L 102 188 L 107 189 L 103 193 L 104 198 L 100 195 L 96 198 L 97 193 L 93 189 L 98 188 Z" fill="#ec4899" />
            {/* Arms */}
            <rect x="25" y="160" width="25" height="70" rx="8" fill="#f472b6" />
            <rect x="150" y="160" width="25" height="70" rx="8" fill="#f472b6" />
            {/* Hair Back */}
            <rect x="50" y="50" width="100" height="120" rx="20" fill="#f472b6" />
            {/* Head */}
            <rect x="62" y="58" width="76" height="82" rx="16" fill="url(#fairSkin)" />
            {/* Bangs */}
            <path d="M 60 70 Q 100 95 140 70 Q 140 50 100 50 Q 60 50 60 70 Z" fill="#f472b6" />
            {/* Cat Ear Headset */}
            <path d="M 52 90 A 55 55 0 0 1 148 90" stroke="#334155" strokeWidth="7" fill="none" />
            {/* Ear Cups */}
            <rect x="46" y="80" width="12" height="25" rx="6" fill="#ec4899" stroke="#ffffff" strokeWidth="2" />
            <rect x="142" y="80" width="12" height="25" rx="6" fill="#ec4899" stroke="#ffffff" strokeWidth="2" />
            {/* Cat Ears */}
            <polygon points="62,45 80,48 68,25" fill="#ec4899" stroke="#ffffff" strokeWidth="2" />
            <polygon points="65,42 76,44 69,30" fill="#fbcfe8" />
            <polygon points="138,45 120,48 132,25" fill="#ec4899" stroke="#ffffff" strokeWidth="2" />
            <polygon points="135,42 124,44 131,30" fill="#fbcfe8" />
            {/* Blushing cheeks */}
            <ellipse cx="70" cy="115" rx="6" ry="3" fill="rgba(244, 63, 94, 0.4)" />
            <ellipse cx="130" cy="115" rx="6" ry="3" fill="rgba(244, 63, 94, 0.4)" />
            {renderEyes("anime")}
            {renderMouth("sweet")}
          </g>
        )}

        {/* 4. POLICE OFFICER / SWAT */}
        {characterId === "police" && (
          <g>
            {/* Tactical Navy Uniform */}
            <rect x="55" y="160" width="90" height="75" rx="8" fill="#1e293b" />
            {/* Golden Badge on Chest */}
            <polygon points="120,175 130,170 140,175 138,190 130,195 122,190" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
            {/* Radio Mic */}
            <rect x="65" y="168" width="12" height="18" rx="2" fill="#09090b" />
            <line x1="71" y1="168" x2="71" y2="158" stroke="#09090b" strokeWidth="2" />
            {/* Arms */}
            <rect x="25" y="160" width="25" height="70" rx="8" fill="#1e293b" />
            <rect x="150" y="160" width="25" height="70" rx="8" fill="#1e293b" />
            {/* Head */}
            <rect x="60" y="65" width="80" height="85" rx="16" fill="url(#fairSkin)" />
            {/* Police Peaked Cap */}
            <path d="M 45 68 Q 100 45 155 68 L 145 45 Q 100 35 55 45 Z" fill="#0f172a" />
            <rect x="50" y="65" width="100" height="8" rx="2" fill="#1e3a8a" />
            {/* Cap Gold Emblem */}
            <polygon points="100,45 106,53 100,58 94,53" fill="#facc15" />
            {/* Visor */}
            <path d="M 45 73 Q 100 85 155 73 L 145 68 Q 100 78 55 68 Z" fill="#09090b" />
            {renderEyes("shades")}
            {renderMouth("serious")}
          </g>
        )}

        {/* 5. DOMINUS SULTAN */}
        {characterId === "dominus" && (
          <g>
            {/* Black Robe */}
            <rect x="55" y="160" width="90" height="75" rx="10" fill="#09090b" stroke="#581c87" strokeWidth="2" />
            <path d="M 100 160 L 100 235" stroke="#a855f7" strokeWidth="3" />
            {/* Arms */}
            <rect x="25" y="160" width="25" height="70" rx="8" fill="#09090b" />
            <rect x="150" y="160" width="25" height="70" rx="8" fill="#09090b" />
            {/* Dominus Wings/Horns */}
            <path d="M 50 65 Q 20 30 10 70 Q 30 75 52 80 Z" fill="#581c87" stroke="#c084fc" strokeWidth="2" />
            <path d="M 150 65 Q 180 30 190 70 Q 170 75 148 80 Z" fill="#581c87" stroke="#c084fc" strokeWidth="2" />
            {/* Large Cowl / Hood */}
            <path d="M 45 60 Q 100 15 155 60 Q 165 110 150 150 Q 100 160 50 150 Q 35 110 45 60 Z" fill="#09090b" stroke="#7e22ce" strokeWidth="3" />
            {/* Void Face Interior */}
            <ellipse cx="100" cy="100" rx="42" ry="40" fill="#000000" />
            {renderEyes("glow_purple")}
            {renderMouth("cool")}
          </g>
        )}

        {/* 6. HACKER / GUEST 666 */}
        {characterId === "hacker" && (
          <g>
            {/* Black Hoodie with Red Glitch Strip */}
            <rect x="55" y="160" width="90" height="75" rx="8" fill="#0f172a" />
            <line x1="55" y1="180" x2="145" y2="180" stroke="#ef4444" strokeWidth="3" />
            <line x1="55" y1="205" x2="145" y2="205" stroke="#ef4444" strokeWidth="2" strokeDasharray="6 3" />
            {/* Arms */}
            <rect x="25" y="160" width="25" height="70" rx="8" fill="#0f172a" />
            <rect x="150" y="160" width="25" height="70" rx="8" fill="#0f172a" />
            {/* Dark Hood */}
            <path d="M 50 65 Q 100 20 150 65 Q 160 115 145 150 Q 100 158 55 150 Q 40 115 50 65 Z" fill="#020617" stroke="#ef4444" strokeWidth="2" />
            {/* Face Shadow */}
            <rect x="62" y="65" width="76" height="80" rx="16" fill="#0f172a" />
            {renderEyes("glow_red")}
            {renderMouth("creepy")}
          </g>
        )}

        {/* 7. CHILL GUY / STREETWEAR */}
        {characterId === "chill_guy" && (
          <g>
            {/* Oversized Brown Sweater */}
            <rect x="50" y="160" width="100" height="75" rx="14" fill="#78350f" />
            <path d="M 90 160 Q 100 170 110 160" stroke="#f59e0b" strokeWidth="3" fill="none" />
            {/* Arms */}
            <rect x="20" y="160" width="28" height="70" rx="10" fill="#78350f" />
            <rect x="152" y="160" width="28" height="70" rx="10" fill="#78350f" />
            {/* Head */}
            <rect x="60" y="65" width="80" height="85" rx="16" fill="url(#fairSkin)" />
            {/* Beanie Hat */}
            <path d="M 52 75 Q 100 25 148 75 Z" fill="#d97706" />
            <rect x="48" y="72" width="104" height="16" rx="6" fill="#b45309" />
            {renderEyes("glasses")}
            {renderMouth("happy")}
          </g>
        )}

        {/* 8. CEO / BUSINESS MAN */}
        {characterId === "ceo" && (
          <g>
            {/* Black Suit & Tie */}
            <rect x="55" y="160" width="90" height="75" rx="8" fill="#0f172a" />
            {/* White Collar & Red Tie */}
            <polygon points="85,160 115,160 100,185" fill="#f8fafc" />
            <polygon points="97,175 103,175 106,220 100,225 94,220" fill="#dc2626" />
            {/* Golden Watch on Wrist */}
            <rect x="25" y="215" width="25" height="8" rx="2" fill="#facc15" />
            {/* Arms */}
            <rect x="25" y="160" width="25" height="70" rx="8" fill="#0f172a" />
            <rect x="150" y="160" width="25" height="70" rx="8" fill="#0f172a" />
            {/* Head */}
            <rect x="60" y="65" width="80" height="85" rx="16" fill="url(#fairSkin)" />
            {/* Slick Dark Hair */}
            <path d="M 55 70 Q 60 35 100 35 Q 140 35 145 70 Q 120 50 100 52 Q 75 50 55 70 Z" fill="#18181b" />
            {renderEyes("dot")}
            {renderMouth("serious")}
          </g>
        )}

        {/* 9. OLIP CHIBI (DARK CHIC) */}
        {characterId === "olip" && (
          <g>
            {/* Velvet Dark Outfit with berry accent */}
            <rect x="55" y="160" width="90" height="75" rx="12" fill="#18181b" stroke="#e11d48" strokeWidth="1.5" />
            {/* Black Choker with small silver pendant (no cross) */}
            <rect x="75" y="152" width="50" height="7" rx="3" fill="#09090b" />
            <circle cx="100" cy="155.5" r="3" fill="#e2e8f0" />
            {/* Arms */}
            <rect x="25" y="160" width="25" height="70" rx="8" fill="#18181b" />
            <rect x="150" y="160" width="25" height="70" rx="8" fill="#18181b" />
            {/* Jet Black Long Hair behind */}
            <rect x="44" y="50" width="112" height="130" rx="20" fill="#09090b" />
            {/* Face */}
            <rect x="62" y="58" width="76" height="82" rx="18" fill="url(#olipSkin)" />
            {/* Straight sleek bangs */}
            <path d="M 58 68 Q 100 88 142 68 Q 142 45 100 45 Q 58 45 58 68 Z" fill="#09090b" />
            {/* Warm smokey eyeshadow */}
            <ellipse cx="78" cy="88" rx="10" ry="4" fill="rgba(190, 24, 93, 0.25)" />
            <ellipse cx="122" cy="88" rx="10" ry="4" fill="rgba(190, 24, 93, 0.25)" />
            {/* Almond Eyes */}
            <ellipse cx="78" cy="92" rx="7" ry="9" fill="#09090b" />
            <ellipse cx="122" cy="92" rx="7" ry="9" fill="#09090b" />
            <circle cx="76" cy="89" r="2.5" fill="#ffffff" />
            <circle cx="120" cy="89" r="2.5" fill="#ffffff" />
            {/* Soft berry tint blush */}
            <ellipse cx="70" cy="112" rx="6" ry="3" fill="rgba(244, 63, 94, 0.3)" />
            <ellipse cx="130" cy="112" rx="6" ry="3" fill="rgba(244, 63, 94, 0.3)" />
            {renderMouth("sweet")}
          </g>
        )}
      </svg>
    </div>
  );
};
