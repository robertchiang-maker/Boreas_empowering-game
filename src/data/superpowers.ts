export interface Superpower {
  id: string; // e.g. "01", "custom"
  num: number;
  name: string;
  category: string;
  categoryNumber: string;
  categoryTheme: string;
  keywords: string;
  description: string;
  iconName: string;
  isCustom?: boolean;
}

export interface CategoryInfo {
  id: string;
  roman: string;
  name: string;
  subtitle: string;
  color: string;
  bgColor: string;
  borderColor: string;
  badgeBg: string;
}

export const CATEGORIES: Record<string, CategoryInfo> = {
  cat1: {
    id: 'cat1',
    roman: 'Ⅰ',
    name: '生存適應系',
    subtitle: '新手村也能活得很好',
    color: 'text-sky-700',
    bgColor: 'bg-sky-50',
    borderColor: 'border-sky-300',
    badgeBg: 'bg-sky-100 text-sky-800 border-sky-300'
  },
  cat2: {
    id: 'cat2',
    roman: 'Ⅱ',
    name: '團隊共鬥系',
    subtitle: '一個人很強，不如一群人不互相傷害',
    color: 'text-teal-700',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-300',
    badgeBg: 'bg-teal-100 text-teal-800 border-teal-300'
  },
  cat3: {
    id: 'cat3',
    roman: 'Ⅲ',
    name: '任務執行系',
    subtitle: '想法很美，還要真的做出來',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-300',
    badgeBg: 'bg-blue-100 text-blue-800 border-blue-300'
  },
  cat4: {
    id: 'cat4',
    roman: 'Ⅳ',
    name: '大腦探索系',
    subtitle: '腦袋不是只有一種使用方式',
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-300',
    badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-300'
  },
  cat5: {
    id: 'cat5',
    roman: 'Ⅴ',
    name: '內在調節系',
    subtitle: '不只管得住自己，也懂得照顧自己',
    color: 'text-cyan-700',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-300',
    badgeBg: 'bg-cyan-100 text-cyan-800 border-cyan-300'
  },
  cat6: {
    id: 'cat6',
    roman: 'Ⅵ',
    name: '北風限定系',
    subtitle: '這些技能不是每間學院都有',
    color: 'text-sky-900',
    bgColor: 'bg-gradient-to-r from-sky-50 to-blue-50',
    borderColor: 'border-sky-400',
    badgeBg: 'bg-sky-200 text-sky-900 border-sky-400'
  },
  custom: {
    id: 'custom',
    roman: '★',
    name: '專屬自創系',
    subtitle: '只有你能定義的北風傳奇技能',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-300',
    badgeBg: 'bg-amber-100 text-amber-800 border-amber-300'
  }
};

export const SUPERPOWERS: Superpower[] = [
  // Ⅰ. 生存適應系
  {
    id: '01',
    num: 1,
    name: '異世界登入術',
    category: '生存適應系',
    categoryNumber: 'cat1',
    categoryTheme: '新手村也能活得很好',
    keywords: '適應力・新環境適應',
    description: '被丟進新空間、新生活、新團體，不會立刻當機。就算內心正在載入 99%，表面還是能慢慢開始探索。',
    iconName: 'Compass'
  },
  {
    id: '02',
    num: 2,
    name: '尷尬結界突破術',
    category: '生存適應系',
    categoryNumber: 'cat1',
    categoryTheme: '新手村也能活得很好',
    keywords: '連結感・人際互動',
    description: '能從不知道要說什麼，到找到一句話、一個共同話題，成功讓兩個原本不熟的人類開始連線。',
    iconName: 'Sparkles'
  },
  {
    id: '03',
    num: 3,
    name: '合法放電領域',
    category: '生存適應系',
    categoryNumber: 'cat1',
    categoryTheme: '新手村也能活得很好',
    keywords: 'Free Play・有品質的放電',
    description: '把多餘精力轉化成歡笑、遊戲和有創意的混亂。不是單純把電放光，而是放完之後大家還更有精神。',
    iconName: 'Zap'
  },
  {
    id: '04',
    num: 4,
    name: '自己人召喚術',
    category: '生存適應系',
    categoryNumber: 'cat1',
    categoryTheme: '新手村也能活得很好',
    keywords: '文化力・歸屬感・認同',
    description: '能把一群人從「只是剛好在同一個地方」，慢慢變成「這是我們的地方，而且我們有自己的梗」。',
    iconName: 'Users'
  },
  {
    id: '05',
    num: 5,
    name: '日常快樂偵測器',
    category: '生存適應系',
    categoryNumber: 'cat1',
    categoryTheme: '新手村也能活得很好',
    keywords: '生活力・享受生活',
    description: '能從吃飯、聊天、散步、發呆裡找到快樂。明白人生不只有完成任務，活得有滋有味也是一種本事。',
    iconName: 'Sun'
  },

  // Ⅱ. 團隊共鬥系
  {
    id: '06',
    num: 6,
    name: '隊友同步率提升',
    category: '團隊共鬥系',
    categoryNumber: 'cat2',
    categoryTheme: '一個人很強，不如一群人不互相傷害',
    keywords: '共榮感・合作力',
    description: '能從「我只要做好我的部分」，進化到「怎樣才能讓整隊都順利」。知道合作不是每個人各做各的就好。',
    iconName: 'Radio'
  },
  {
    id: '07',
    num: 7,
    name: '豬隊友轉職術',
    category: '團隊共鬥系',
    categoryNumber: 'cat2',
    categoryTheme: '一個人很強，不如一群人不互相傷害',
    keywords: '合作力・欣賞差異',
    description: '面對做事方式不同、步調不同的人，不急著判定對方是豬隊友，而是試著找到彼此能合作的方法。',
    iconName: 'Wand2'
  },
  {
    id: '08',
    num: 8,
    name: '人類語言解碼器',
    category: '團隊共鬥系',
    categoryNumber: 'cat2',
    categoryTheme: '一個人很強，不如一群人不互相傷害',
    keywords: '溝通力・理解他人',
    description: '不只會把話說出去，也開始聽得懂別人在意什麼、自己真正想表達什麼，以及「隨便」有時候真的不只是隨便。',
    iconName: 'MessageSquareQuote'
  },
  {
    id: '09',
    num: 9,
    name: '臨時隊長召喚術',
    category: '團隊共鬥系',
    categoryNumber: 'cat2',
    categoryTheme: '一個人很強，不如一群人不互相傷害',
    keywords: '領導力・組織協調',
    description: '沒有王冠、沒有超高薪，也可能沒人自願，但能在混亂中協助大家找到方向。真正的隊長不一定最大聲。',
    iconName: 'Crown'
  },
  {
    id: '10',
    num: 10,
    name: '鍋蓋承受者',
    category: '團隊共鬥系',
    categoryNumber: 'cat2',
    categoryTheme: '一個人很強，不如一群人不互相傷害',
    keywords: '責任感・承擔責任',
    description: '能承認「這件事是我負責的」，出包時不立刻使用甩鍋技能，並且願意想辦法補救。',
    iconName: 'ShieldCheck'
  },

  // Ⅲ. 任務執行系
  {
    id: '11',
    num: 11,
    name: '腦洞合法化',
    category: '任務執行系',
    categoryNumber: 'cat3',
    categoryTheme: '想法很美，還要真的做出來',
    keywords: '展現創意・創造可能性',
    description: '把「這想法也太奇怪了吧」變成「等等，好像真的可以試試看」。不保證每次成功，但保證不讓腦袋太早下班。',
    iconName: 'Lightbulb'
  },
  {
    id: '12',
    num: 12,
    name: '混亂預言家',
    category: '任務執行系',
    categoryNumber: 'cat3',
    categoryTheme: '想法很美，還要真的做出來',
    keywords: '規劃設計・預想流程',
    description: '能在事情發生前先想想順序、資源和可能的意外。不是算命，而是盡量不要把「早知道」留到最後才說。',
    iconName: 'Eye'
  },
  {
    id: '13',
    num: 13,
    name: '停止空想・立即啟動',
    category: '任務執行系',
    categoryNumber: 'cat3',
    categoryTheme: '想法很美，還要真的做出來',
    keywords: '執行力・開始行動',
    description: '能把「我們應該可以做一個很棒的東西」變成第一個實際步驟。專治計畫討論三小時、實際進度零公分。',
    iconName: 'Rocket'
  },
  {
    id: '14',
    num: 14,
    name: '時間縫隙忍者',
    category: '任務執行系',
    categoryNumber: 'cat3',
    categoryTheme: '想法很美，還要真的做出來',
    keywords: '自我管理・時間運用',
    description: '知道什麼該先做、什麼可以晚點做，也知道不能把所有任務都塞進最後一晚的宇宙縫隙裡。',
    iconName: 'Timer'
  },
  {
    id: '15',
    num: 15,
    name: '爛攤子復原術',
    category: '任務執行系',
    categoryNumber: 'cat3',
    categoryTheme: '想法很美，還要真的做出來',
    keywords: '執行力・問題處理・責任感',
    description: '當事情跟想像的不一樣，不會只站在旁邊說「完蛋了」。能找出問題、調整方法，讓任務繼續往前走。',
    iconName: 'Hammer'
  },

  // Ⅳ. 大腦探索系
  {
    id: '16',
    num: 16,
    name: '腦袋轉彎漂移',
    category: '大腦探索系',
    categoryNumber: 'cat4',
    categoryTheme: '腦袋不是只有一種使用方式',
    keywords: '探索新思維・思考彈性',
    description: '發現原本的方法走不通時，能換個角度想想，而不是把頭撞在同一面牆上三次，再怪牆太硬。',
    iconName: 'Compass'
  },
  {
    id: '17',
    num: 17,
    name: '興趣引力場',
    category: '大腦探索系',
    categoryNumber: 'cat4',
    categoryTheme: '腦袋不是只有一種使用方式',
    keywords: '自主閱讀・主動探索',
    description: '能被自己真正感興趣的東西吸進去，從一本書、一部影片或一個奇怪的問題，開啟自己的探索支線。',
    iconName: 'Magnet'
  },
  {
    id: '18',
    num: 18,
    name: '自我偵查科',
    category: '大腦探索系',
    categoryNumber: 'cat4',
    categoryTheme: '腦袋不是只有一種使用方式',
    keywords: '探索自我・自我覺察',
    description: '開始發現自己為什麼會生氣、拖延、興奮或逃避。案件不一定破得完，但至少知道嫌疑人可能就是自己的某個習慣。',
    iconName: 'Search'
  },
  {
    id: '19',
    num: 19,
    name: '標準答案粉碎機',
    category: '大腦探索系',
    categoryNumber: 'cat4',
    categoryTheme: '腦袋不是只有一種使用方式',
    keywords: '探索新思維・獨立思考',
    description: '不會因為大家都這樣想，就認定只能這樣想。願意追問、找證據、提出不同可能，而不是看到標準答案就自動跪拜。',
    iconName: 'Flame'
  },
  {
    id: '20',
    num: 20,
    name: '自己的導師召喚術',
    category: '大腦探索系',
    categoryNumber: 'cat4',
    categoryTheme: '腦袋不是只有一種使用方式',
    keywords: '自主學習・作自己的老師',
    description: '能試著決定自己想學什麼、怎麼學、學到哪裡，卡住時也會想辦法找資源。老師不在旁邊時，學習也不會直接關機。',
    iconName: 'GraduationCap'
  },

  // Ⅴ. 內在調節系
  {
    id: '21',
    num: 21,
    name: '全場慢速結界',
    category: '內在調節系',
    categoryNumber: 'cat5',
    categoryTheme: '不只管得住自己，也懂得照顧自己',
    keywords: '放慢腳步・調整節奏',
    description: '在所有人都急著衝刺時，還能停下來想想：現在真的需要加速嗎？還是大家只是一起慌張？',
    iconName: 'Hourglass'
  },
  {
    id: '22',
    num: 22,
    name: '腦內分頁管理員',
    category: '內在調節系',
    categoryNumber: 'cat5',
    categoryTheme: '不只管得住自己，也懂得照顧自己',
    keywords: '專注力・自我管理',
    description: '能察覺自己什麼時候分心、什麼時候需要休息，試著把腦袋裡開了 87 個分頁的狀態，整理成還能正常運作的樣子。',
    iconName: 'Layers'
  },
  {
    id: '23',
    num: 23,
    name: '情緒翻譯蒟蒻',
    category: '內在調節系',
    categoryNumber: 'cat5',
    categoryTheme: '不只管得住自己，也懂得照顧自己',
    keywords: '情緒覺察・溝通表達',
    description: '能慢慢把「我就是很煩」翻譯成「我可能是因為事情太多、不知道怎麼開始」。不是消除情緒，而是讓自己更懂得發生了什麼。',
    iconName: 'HeartHandshake'
  },
  {
    id: '24',
    num: 24,
    name: '不會就不會護盾',
    category: '內在調節系',
    categoryNumber: 'cat5',
    categoryTheme: '不只管得住自己，也懂得照顧自己',
    keywords: '接納限制・願意求助',
    description: '能承認自己還不會、聽不懂或需要幫忙。知道說出「我不知道」不是遊戲結束，而是下一個任務的起點。',
    iconName: 'Shield'
  },
  {
    id: '25',
    num: 25,
    name: '小進度放大鏡',
    category: '內在調節系',
    categoryNumber: 'cat5',
    categoryTheme: '不只管得住自己，也懂得照顧自己',
    keywords: '自我肯定・持續行動',
    description: '不只看最後有沒有拿到大獎，也能發現自己今天多試了一次、多問了一句、多完成了一小步。',
    iconName: 'Sparkle'
  },

  // Ⅵ. 北風限定系
  {
    id: '26',
    num: 26,
    name: '冷門梗共振術',
    category: '北風限定系',
    categoryNumber: 'cat6',
    categoryTheme: '這些技能不是每間學院都有',
    keywords: '文化創造・群體認同',
    description: '能和一群人一起創造只有自己人懂的笑點、儀式和共同記憶。外人看不懂沒關係，自己人笑成一團就算成功。',
    iconName: 'Laugh'
  },
  {
    id: '27',
    num: 27,
    name: '無所事事合理化',
    category: '北風限定系',
    categoryNumber: 'cat6',
    categoryTheme: '這些技能不是每間學院都有',
    keywords: '生活力・休息與節奏',
    description: '知道休息不一定是偷懶，沒有每分每秒都在產出，也不代表人生進度落後。能把自己充飽電，再回來面對世界。',
    iconName: 'Coffee'
  },
  {
    id: '28',
    num: 28,
    name: '奇怪想法實體化',
    category: '北風限定系',
    categoryNumber: 'cat6',
    categoryTheme: '這些技能不是每間學院都有',
    keywords: '創意・規劃・實作',
    description: '能把腦中的奇怪點子變成真的作品、活動或企畫。即使成品跟原本想像差了十萬八千里，也至少成功讓想法落地。',
    iconName: 'Palette'
  },
  {
    id: '29',
    num: 29,
    name: '北風導航系統',
    category: '北風限定系',
    categoryNumber: 'cat6',
    categoryTheme: '這些技能不是每間學院都有',
    keywords: '自主選擇・為自己負責',
    description: '不一定知道最終目的地在哪裡，但開始能判斷自己想往哪裡走、為什麼選這條路，以及走錯時要怎麼調整。',
    iconName: 'Wind'
  },
  {
    id: '30',
    num: 30,
    name: '尚未命名的超能力',
    category: '北風限定系',
    categoryNumber: 'cat6',
    categoryTheme: '這些技能不是每間學院都有',
    keywords: '自我探索・持續發現',
    description: '還說不清楚自己有什麼厲害的地方也沒關係。願意繼續探索、嘗試和認識自己，這項技能就還在開發中。',
    iconName: 'HelpCircle'
  }
];

export const CUSTOM_SUPERPOWER_TEMPLATE: Superpower = {
  id: 'custom',
  num: 99,
  name: '我的專屬超能力',
  category: '專屬自創系',
  categoryNumber: 'custom',
  categoryTheme: '只有你能定義的北風傳奇技能',
  keywords: '獨創力・自我定義・破框潛能',
  description: '你的身上有一種無法被既有詞彙定義的力量。這項能力來自你在學院的獨特經歷，由你親自為它命名與加冕！',
  iconName: 'Star',
  isCustom: true
};

export interface UnlockedRecord {
  id: string; // e.g. "BOR-2026-XXXX"
  studentName: string;
  skillId: string;
  skillName: string;
  customSkillName?: string;
  category: string;
  keywords: string;
  description: string;
  story: string;
  unlockedAt: string;
  syncedToCloud?: boolean;
}
