import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Wind,
  RefreshCw,
  BookOpen,
  FormInput,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  CheckSquare,
  Square,
  AlertCircle,
  Info,
  QrCode,
  Share2
} from 'lucide-react';

import {
  SUPERPOWERS,
  CUSTOM_SUPERPOWER_TEMPLATE,
  CATEGORIES,
  Superpower,
  UnlockedRecord
} from './data/superpowers';
import { BoreasHero } from './components/BoreasHero';
import { BoreasSkillBag } from './components/BoreasSkillBag';
import { SuperpowerIcon } from './components/SuperpowerIcon';
import { CertificationCard } from './components/CertificationCard';
import { SuperpowerCodexModal } from './components/SuperpowerCodexModal';
import { GoogleSyncModal } from './components/GoogleSyncModal';
import { ShareModal } from './components/ShareModal';
import {
  getSavedStudentName,
  saveStudentName,
  saveRecord,
  syncRecordToGoogleForm,
  getGoogleFormConfig
} from './utils/storage';

type Step = 'cover' | 'draw' | 'answer' | 'certified';

export default function App() {
  // Navigation & User State
  const [currentStep, setCurrentStep] = useState<Step>('cover');
  const [studentName, setStudentName] = useState<string>('');
  const [nameError, setNameError] = useState<string>('');

  // 4 Drawn Cards
  const [drawnCards, setDrawnCards] = useState<Superpower[]>([]);
  const [selectedCardsToReroll, setSelectedCardsToReroll] = useState<Set<number>>(new Set());
  const [rerollAvailable, setRerollAvailable] = useState<boolean>(true);

  // Selected Card for Answering
  const [activeSkill, setActiveSkill] = useState<Superpower | null>(null);
  const [customSkillName, setCustomSkillName] = useState<string>('');
  const [customSkillKeywords, setCustomSkillKeywords] = useState<string>('自創・獨特軟實力');
  const [studentStory, setStudentStory] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Result Certification
  const [certifiedRecord, setCertifiedRecord] = useState<UnlockedRecord | null>(null);

  // Modals
  const [showCodex, setShowCodex] = useState<boolean>(false);
  const [showGoogleModal, setShowGoogleModal] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);

  // Load saved student name on initial mount
  useEffect(() => {
    const savedName = getSavedStudentName();
    if (savedName) setStudentName(savedName);
  }, []);

  // Shuffle helper to pick 3 random superpowers + 1 guaranteed custom superpower
  const drawFourCards = (excludeIds: string[] = []): Superpower[] => {
    const availablePool = SUPERPOWERS.filter((s) => !excludeIds.includes(s.id));
    const shuffled = [...availablePool].sort(() => Math.random() - 0.5);
    const threeSkills = shuffled.slice(0, 3);
    const customCard: Superpower = { ...CUSTOM_SUPERPOWER_TEMPLATE };
    return [...threeSkills, customCard];
  };

  // Start Drawing Flow
  const handleStartDraw = () => {
    if (!studentName.trim()) {
      setNameError('請先輸入您的姓名或暱稱（如：小柏/北風KD），以便頒發專屬認證卡！');
      return;
    }
    setNameError('');
    saveStudentName(studentName.trim());

    const initialCards = drawFourCards();
    setDrawnCards(initialCards);
    setSelectedCardsToReroll(new Set());
    setRerollAvailable(true);
    setCurrentStep('draw');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle selection for reroll
  const toggleCardForReroll = (index: number) => {
    const next = new Set(selectedCardsToReroll);
    if (next.has(index)) {
      next.delete(index);
    } else {
      next.add(index);
    }
    setSelectedCardsToReroll(next);
  };

  // Execute Reroll for checked cards (1 opportunity)
  const handleExecuteReroll = () => {
    if (!rerollAvailable || selectedCardsToReroll.size === 0) return;

    // Current unselected ids to avoid drawing duplicates
    const currentUnselectedIds = drawnCards
      .filter((_, idx) => !selectedCardsToReroll.has(idx))
      .map((c) => c.id);

    const pool = SUPERPOWERS.filter((s) => !currentUnselectedIds.includes(s.id));
    const shuffled = [...pool].sort(() => Math.random() - 0.5);

    let replacementIndex = 0;
    const newCards = drawnCards.map((card, index) => {
      if (!selectedCardsToReroll.has(index)) {
        return card;
      }
      if (card.isCustom) {
        return {
          ...CUSTOM_SUPERPOWER_TEMPLATE,
          name: '我的專屬超能力'
        };
      }
      const replacement = shuffled[replacementIndex] || card;
      replacementIndex++;
      return replacement;
    });

    setDrawnCards(newCards);
    setSelectedCardsToReroll(new Set());
    setRerollAvailable(false);
  };

  // Choose a card to proceed to answering
  const handleSelectSkillToAnswer = (skill: Superpower) => {
    setActiveSkill(skill);
    if (skill.isCustom) {
      setCustomSkillName('');
      setCustomSkillKeywords('獨創力・自我定義・破框潛能');
    }
    setStudentStory('');
    setCurrentStep('answer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate story word count (standard character count in Chinese/English)
  const storyLength = studentStory.trim().length;
  const isSatisfiedRequirement = storyLength >= 35;

  // Submit Answer & Skill Appraisal
  const handleSubmitAppraisal = async () => {
    if (!isSatisfiedRequirement || !activeSkill) return;

    if (activeSkill.isCustom && !customSkillName.trim()) {
      alert('請為您的「專屬超能力」命名一個酷炫的技能名稱！');
      return;
    }

    setIsSubmitting(true);

    const now = new Date();
    const formattedDate = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const certId = `BOR-${now.getFullYear()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const finalSkillName = activeSkill.isCustom
      ? customSkillName.trim()
      : activeSkill.name;

    const newRecord: UnlockedRecord = {
      id: certId,
      studentName: studentName.trim(),
      skillId: activeSkill.id,
      skillName: activeSkill.name,
      customSkillName: activeSkill.isCustom ? finalSkillName : undefined,
      category: activeSkill.category,
      keywords: activeSkill.isCustom ? customSkillKeywords : activeSkill.keywords,
      description: activeSkill.description,
      story: studentStory.trim(),
      unlockedAt: formattedDate,
      syncedToCloud: false
    };

    // Save locally
    saveRecord(newRecord);
    setCertifiedRecord(newRecord);

    // Fire celebratory confetti!
    confetti({
      particleCount: 95,
      spread: 75,
      origin: { y: 0.6 }
    });

    // Auto-attempt Google Form submission in background if form URL is configured
    const formConfig = getGoogleFormConfig();
    if (formConfig.formUrl) {
      syncRecordToGoogleForm(newRecord, formConfig);
    }

    setIsSubmitting(false);
    setCurrentStep('certified');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-sky-50 to-blue-100 text-slate-800 flex flex-col font-sans relative overflow-x-hidden">
      {/* Background North Wind Streaks & Aurora Aura */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-200/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-32 w-[30rem] h-[30rem] bg-sky-200/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 left-1/4 w-[36rem] h-[36rem] bg-blue-200/30 rounded-full blur-3xl" />

        {/* Breezy Wind Lines */}
        <svg
          className="absolute inset-0 w-full h-full opacity-35"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M -100 120 C 300 80, 700 160, 1400 100"
            stroke="#38bdf8"
            strokeWidth="1.5"
            strokeDasharray="8 12"
            fill="none"
          />
          <path
            d="M -100 280 C 400 240, 900 320, 1600 260"
            stroke="#7dd3fc"
            strokeWidth="1.2"
            strokeDasharray="14 18"
            fill="none"
          />
          <path
            d="M -50 560 C 500 520, 1000 620, 1800 540"
            stroke="#bae6fd"
            strokeWidth="2"
            strokeDasharray="10 16"
            fill="none"
          />
        </svg>
      </div>

      {/* Global Top Navigation Bar */}
      <header className="relative z-20 w-full bg-white/80 backdrop-blur-md border-b border-sky-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <div
          onClick={() => setCurrentStep('cover')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-cyan-400 p-0.5 shadow-sm">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center text-sky-600">
              <Wind className="w-5 h-5 group-hover:rotate-12 transition-transform text-sky-600" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-sky-600 bg-sky-100 px-1.5 py-0.2 rounded">
                BOREAS
              </span>
              <span className="text-xs font-bold text-slate-500">北風學院</span>
            </div>
            <h1 className="text-sm sm:text-base font-extrabold text-slate-800 leading-tight">
              隱藏版超能力解鎖
            </h1>
          </div>
        </div>

        {/* Header Tools */}
        <div className="flex items-center gap-2">
          {/* Share / QR Code Button */}
          <button
            onClick={() => setShowShareModal(true)}
            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            title="投影大螢幕 QR Code 或複製網址分享"
          >
            <QrCode className="w-4 h-4" />
            <span className="hidden sm:inline">投影 QR Code / 分享</span>
            <span className="sm:hidden">分享</span>
          </button>

          {/* Superpower Codex Button */}
          <button
            onClick={() => setShowCodex(true)}
            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white hover:bg-sky-50 border border-sky-200 text-sky-800 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <BookOpen className="w-4 h-4 text-sky-600" />
            <span className="hidden sm:inline">超能力全圖鑑</span>
            <span className="sm:hidden">圖鑑</span>
            <span className="px-1.5 py-0.2 text-[10px] bg-sky-100 text-sky-700 rounded-full font-bold">
              30+
            </span>
          </button>

          {/* Google Form Sync Setup Button */}
          <button
            onClick={() => setShowGoogleModal(true)}
            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white hover:bg-sky-50 border border-sky-200 text-sky-800 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            title="設定 Google 表單自動存檔"
          >
            <FormInput className="w-4 h-4 text-sky-600" />
            <span className="hidden sm:inline">Google 表單</span>
            <span className="sm:hidden">表單</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center">
        {/* ========================================================= */}
        {/* VIEW 1: COVER SCREEN (封面：Q版北風小超人、技能包、姓名/暱稱輸入) */}
        {/* ========================================================= */}
        {currentStep === 'cover' && (
          <div className="w-full flex flex-col items-center text-center space-y-8 py-4 sm:py-8 animate-fade-in">
            {/* Category Badges */}
            <div className="flex flex-wrap justify-center gap-2 max-w-2xl">
              {Object.values(CATEGORIES)
                .filter((c) => c.id !== 'custom')
                .map((cat) => (
                  <span
                    key={cat.id}
                    className={`text-[11px] sm:text-xs font-bold px-3 py-1 rounded-full border shadow-xs transition-transform hover:scale-105 cursor-default ${cat.badgeBg}`}
                  >
                    {cat.roman}. {cat.name}
                  </span>
                ))}
            </div>

            {/* Title & Tagline */}
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sky-200/70 text-sky-900 text-xs font-bold border border-sky-300 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-sky-700" />
                探索你在學院生活中悄悄累積的軟實力
              </div>

              <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Boreas 北風學院
                <br />
                <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  隱藏版超能力解鎖
                </span>
              </h2>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
                新手村活得很好？尷尬結界突破？還是腦洞合法化？
                <br className="hidden sm:inline" />
                臥虎藏龍的學院生活裡，你早已覺醒了獨一無二的超能力！
              </p>
            </div>

            {/* CENTER STAGE: Q版北風小超人 + 北風技能包 */}
            <div className="relative w-full max-w-lg py-4 flex items-center justify-center gap-2 sm:gap-6">
              {/* Left/Center: Q版北風小超人 */}
              <div className="flex flex-col items-center">
                <BoreasHero size="lg" animated={true} />
                <div className="mt-1 px-3 py-1 bg-white/90 rounded-full border border-sky-200 shadow-xs text-xs font-extrabold text-sky-800">
                  北風小超人
                </div>
              </div>

              {/* Wind Energy Gust in between */}
              <div className="hidden sm:flex flex-col items-center text-sky-500 animate-pulse">
                <Wind className="w-8 h-8" />
                <span className="text-[10px] font-bold tracking-widest text-sky-700 mt-1 uppercase">
                  BURST
                </span>
              </div>

              {/* Right/Center: 北風技能包 */}
              <div className="flex flex-col items-center">
                <BoreasSkillBag
                  size="md"
                  onClick={() => setShowCodex(true)}
                />
                <div className="mt-1 px-3 py-1 bg-white/90 rounded-full border border-sky-200 shadow-xs text-xs font-extrabold text-sky-800">
                  北風技能包 (30+ 技能)
                </div>
              </div>
            </div>

            {/* Student Info Card & Start Trigger (Only Name / Nickname) */}
            <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-7 shadow-xl border-2 border-sky-200 space-y-4 text-left">
              <div className="flex items-center gap-2 border-b border-sky-100 pb-3">
                <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center font-bold text-sm">
                  ⚡
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
                    準備抽取你的超能力籤
                  </h4>
                  <p className="text-xs text-slate-500">
                    一次抽出 4 張籤（包含 1 張可自行定義的專屬超能力！）
                  </p>
                </div>
              </div>

              {/* Name / Nickname input with requested example: 小柏/北風KD */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  姓名 / 暱稱 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => {
                    setStudentName(e.target.value);
                    if (nameError) setNameError('');
                  }}
                  placeholder="請輸入姓名/暱稱，如：小柏/北風KD"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm font-medium bg-slate-50/50 text-slate-900"
                />
                {nameError && (
                  <p className="text-xs text-red-500 font-bold flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {nameError}
                  </p>
                )}
              </div>

              {/* Start Button */}
              <button
                onClick={handleStartDraw}
                className="w-full py-4 bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white font-extrabold text-base rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group cursor-pointer active:scale-98"
              >
                <span>開始抽取超能力籤</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="pt-1 flex flex-col sm:flex-row items-center justify-center gap-2 text-xs">
                <button
                  onClick={() => setShowShareModal(true)}
                  className="px-3 py-1.5 bg-sky-100 hover:bg-sky-200 text-sky-800 rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5 text-sky-600" />
                  <span>投影 QR Code / 複製分享給全班</span>
                </button>
                <button
                  onClick={() => setShowCodex(true)}
                  className="text-sky-700 hover:text-sky-900 font-semibold underline py-1"
                >
                  超能力全圖鑑 (30項)
                </button>
              </div>
            </div>

            {/* Features preview strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl text-left">
              <div className="bg-white/70 backdrop-blur-xs p-4 rounded-2xl border border-sky-100 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                  🎲
                </div>
                <div>
                  <h5 className="font-bold text-xs text-slate-800">4 張籤 ＋ 1 次重抽</h5>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    抽出的 4 張牌包含 1 張自由命名的專屬超能力，不滿意還可勾選重抽！
                  </p>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-xs p-4 rounded-2xl border border-sky-100 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                  ✍️
                </div>
                <div>
                  <h5 className="font-bold text-xs text-slate-800">35 字真實經驗解鎖</h5>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    寫下你在學院的具體事件與感受，透過反思點亮你的專屬徽章。
                  </p>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-xs p-4 rounded-2xl border border-sky-100 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                  📸
                </div>
                <div>
                  <h5 className="font-bold text-xs text-slate-800">官方認證卡 ＆ 表單存檔</h5>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    鑑定送出即刻生成精美認證證書，一鍵截圖下載或同步送入 Google 表單。
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 2: DRAW STAGE (抽籤畫面：4張籤，其中1張必為專屬超能力，可勾選重抽) */}
        {/* ========================================================= */}
        {currentStep === 'draw' && (
          <div className="w-full space-y-6 animate-fade-in pb-12">
            {/* Top Bar / Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/80 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-sky-200">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentStep('cover')}
                  className="p-2 hover:bg-sky-100 rounded-xl text-slate-600 transition-colors"
                  title="返回封面"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded">
                      第 2 步：超能力命定抽籤
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      勇者：<strong>{studentName}</strong>
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                    請從 4 張籤中選擇 1 張進行技能解鎖
                  </h2>
                </div>
              </div>

              {/* Reroll Chance Indicator */}
              <div className="flex items-center gap-2">
                <div
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 ${
                    rerollAvailable
                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${
                      rerollAvailable ? 'text-amber-600' : 'text-slate-400'
                    }`}
                  />
                  <span>
                    重抽機會：{rerollAvailable ? '1 / 1 (可用)' : '0 / 1 (已使用)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Instruction Banner */}
            <div className="bg-sky-50/90 border border-sky-200 rounded-2xl p-4 text-xs sm:text-sm text-sky-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-start gap-2.5">
                <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">遊戲規則：</p>
                  <p className="text-slate-600 text-xs mt-0.5 leading-relaxed">
                    點擊任一張喜歡的卡片即可<strong>「前往作答解鎖」</strong>；若覺得這幾張都不太像你，可以<strong>勾選不滿意的卡片並點選「重新抽取」</strong>（僅有一次重抽機會！）。
                  </p>
                </div>
              </div>

              {/* Reroll Action Button */}
              {rerollAvailable && (
                <button
                  onClick={handleExecuteReroll}
                  disabled={selectedCardsToReroll.size === 0}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shrink-0 ${
                    selectedCardsToReroll.size > 0
                      ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-md active:scale-95 cursor-pointer'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>
                    重抽勾選的 {selectedCardsToReroll.size} 張卡片 (剩 1 次)
                  </span>
                </button>
              )}
            </div>

            {/* 4 Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {drawnCards.map((card, index) => {
                const isChecked = selectedCardsToReroll.has(index);
                const isCustom = card.isCustom;
                const catKey = card.categoryNumber || (isCustom ? 'custom' : 'cat1');
                const catInfo = CATEGORIES[catKey] || CATEGORIES.custom;

                return (
                  <div
                    key={`${card.id}-${index}`}
                    className={`relative rounded-3xl p-5 border-2 transition-all flex flex-col justify-between shadow-md hover:shadow-xl group ${
                      isCustom
                        ? 'bg-gradient-to-b from-amber-50/90 via-white to-amber-50/70 border-amber-300 hover:border-amber-400'
                        : isChecked
                        ? 'bg-slate-100/80 border-slate-400 opacity-80'
                        : 'bg-gradient-to-b from-sky-50/90 via-white to-blue-50/70 border-sky-300 hover:border-sky-500'
                    }`}
                  >
                    {/* Top Tag & Checkbox */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className={`text-[11px] font-black px-2.5 py-0.5 rounded-full border ${catInfo.badgeBg}`}
                        >
                          {catInfo.roman}. {card.category}
                        </span>

                        {/* Reroll Checkbox */}
                        {rerollAvailable ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCardForReroll(index);
                            }}
                            className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md transition-colors ${
                              isChecked
                                ? 'bg-amber-100 text-amber-800'
                                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                            }`}
                            title="勾選此卡以在重抽時換掉"
                          >
                            {isChecked ? (
                              <>
                                <CheckSquare className="w-3.5 h-3.5 text-amber-600" />
                                <span>已勾選換掉</span>
                              </>
                            ) : (
                              <>
                                <Square className="w-3.5 h-3.5" />
                                <span>換這張</span>
                              </>
                            )}
                          </button>
                        ) : null}
                      </div>

                      {/* Icon */}
                      <div className="flex justify-center my-3">
                        <div
                          className={`w-16 h-16 rounded-2xl p-0.5 shadow-sm transition-transform group-hover:scale-110 ${
                            isCustom
                              ? 'bg-gradient-to-tr from-amber-400 to-yellow-300'
                              : 'bg-gradient-to-tr from-sky-500 to-cyan-400'
                          }`}
                        >
                          <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                            <SuperpowerIcon
                              name={card.iconName}
                              className={`w-8 h-8 ${
                                isCustom ? 'text-amber-500' : 'text-sky-600'
                              }`}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Card Title */}
                      <div className="text-center space-y-1">
                        <h3
                          className={`text-lg font-black leading-snug ${
                            isCustom ? 'text-amber-900' : 'text-slate-900'
                          }`}
                        >
                          {card.name}
                        </h3>

                        <p
                          className={`text-xs font-bold ${
                            isCustom ? 'text-amber-700' : 'text-sky-700'
                          }`}
                        >
                          {card.keywords}
                        </p>

                        {isCustom && (
                          <span className="inline-block px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold mt-1">
                            ✨ 點擊可由你親自命名！
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <p className="mt-3 text-xs text-slate-600 leading-relaxed bg-white/70 p-3 rounded-xl border border-slate-100 line-clamp-4">
                        {card.description}
                      </p>
                    </div>

                    {/* Bottom Action: Select This Card */}
                    <div className="mt-5 pt-3 border-t border-slate-100 space-y-2">
                      <button
                        onClick={() => handleSelectSkillToAnswer(card)}
                        className={`w-full py-2.5 px-4 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer ${
                          isCustom
                            ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white'
                            : 'bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white'
                        }`}
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>選擇這張解鎖作答</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 3: ANSWER & UNLOCK CONDITION (作答與解鎖條件：35字以上) */}
        {/* ========================================================= */}
        {currentStep === 'answer' && activeSkill && (
          <div className="w-full max-w-2xl space-y-6 animate-fade-in pb-12">
            {/* Back button */}
            <button
              onClick={() => setCurrentStep('draw')}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/80 hover:bg-white text-slate-700 text-xs font-bold rounded-xl border border-sky-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> 返回重選其他籤
            </button>

            {/* Selected Superpower Showcase Card */}
            <div
              className={`rounded-3xl p-6 sm:p-7 border-2 shadow-lg ${
                activeSkill.isCustom
                  ? 'bg-gradient-to-br from-amber-50 via-white to-amber-50/50 border-amber-300'
                  : 'bg-gradient-to-br from-sky-50 via-white to-blue-50/50 border-sky-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                {/* Icon */}
                <div
                  className={`w-20 h-20 rounded-2xl p-0.5 shadow-md shrink-0 ${
                    activeSkill.isCustom
                      ? 'bg-gradient-to-tr from-amber-400 to-yellow-300'
                      : 'bg-gradient-to-tr from-sky-500 to-cyan-400'
                  }`}
                >
                  <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                    <SuperpowerIcon
                      name={activeSkill.iconName}
                      className={`w-10 h-10 ${
                        activeSkill.isCustom ? 'text-amber-500' : 'text-sky-600'
                      }`}
                    />
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 text-center sm:text-left space-y-1.5 w-full">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
                      {activeSkill.category}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      {activeSkill.keywords}
                    </span>
                  </div>

                  {/* Skill Name (Custom or Official) */}
                  {activeSkill.isCustom ? (
                    <div className="space-y-1 pt-1">
                      <label className="block text-xs font-black text-amber-800">
                        ✨ 請為你的專屬超能力命名：
                      </label>
                      <input
                        type="text"
                        value={customSkillName}
                        onChange={(e) => setCustomSkillName(e.target.value)}
                        placeholder="例如：混亂中的神級修補術、宵夜外送導航眼..."
                        className="w-full px-4 py-2.5 text-base font-extrabold bg-white border-2 border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-slate-900"
                        maxLength={25}
                      />
                    </div>
                  ) : (
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                      {activeSkill.name}
                    </h2>
                  )}

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1 italic">
                    「{activeSkill.description}」
                  </p>
                </div>
              </div>
            </div>

            {/* UNLOCK CONDITION SECTION */}
            <div className="bg-white/95 rounded-3xl p-6 sm:p-7 shadow-xl border-2 border-sky-200 space-y-4">
              <div className="border-b border-sky-100 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center font-bold">
                    📜
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">
                      【 解鎖條件 】
                    </h3>
                    <p className="text-xs text-sky-700 font-bold">
                      寫下一個事件+感受，證明你已解鎖這個技能（35字以上）
                    </p>
                  </div>
                </div>

                {/* Character Counter Badge */}
                <div
                  className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
                    isSatisfiedRequirement
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300 animate-pulse'
                      : 'bg-amber-50 text-amber-800 border-amber-300'
                  }`}
                >
                  {storyLength} / 35 字
                </div>
              </div>

              {/* Guiding Hints */}
              <div className="bg-sky-50/70 rounded-2xl p-3.5 border border-sky-100 text-xs text-slate-600 space-y-1">
                <p className="font-bold text-sky-900 flex items-center gap-1">
                  💡 書寫小錦囊（事件 ＋ 感受）：
                </p>
                <ul className="list-disc list-inside space-y-0.5 text-slate-600 pl-1">
                  <li><strong>事件：</strong>在學院或生活裡發生了什麼事？你遇到了什麼狀況或任務？</li>
                  <li><strong>感受：</strong>你當下的真實心情是什麼？你如何面對與思考？</li>
                  <li><strong>證明：</strong>這段經歷如何展現出你擁有這項超能力？</li>
                </ul>
              </div>

              {/* Textarea for Story */}
              <div className="space-y-1.5">
                <textarea
                  rows={5}
                  value={studentStory}
                  onChange={(e) => setStudentStory(e.target.value)}
                  placeholder="請在此寫下你的真實經歷與心境感受...（至少 35 字）"
                  className="w-full p-4 rounded-2xl border-2 border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 text-sm leading-relaxed text-slate-800 resize-y"
                />

                {/* Progress Bar & Status */}
                <div className="space-y-1">
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isSatisfiedRequirement ? 'bg-emerald-500' : 'bg-sky-500'
                      }`}
                      style={{
                        width: `${Math.min(100, (storyLength / 35) * 100)}%`
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold">
                    {!isSatisfiedRequirement ? (
                      <span className="text-amber-700 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        還差 {35 - storyLength} 個字，再多描寫一點當時的感受吧！
                      </span>
                    ) : (
                      <span className="text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        已達標（共 {storyLength} 字），可以進行技能鑑定！
                      </span>
                    )}
                    <span className="text-slate-400">最低要求 35 字</span>
                  </div>
                </div>
              </div>

              {/* Student Name Confirmation */}
              <div className="pt-2 flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span>
                  認證姓名：<strong>{studentName}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const newName = prompt('修改姓名/暱稱（如：小柏/北風KD）：', studentName);
                    if (newName && newName.trim()) setStudentName(newName.trim());
                  }}
                  className="text-sky-600 hover:text-sky-800 font-bold underline"
                >
                  修改姓名
                </button>
              </div>

              {/* Submit Button (技能鑑定) */}
              <div className="pt-2">
                <button
                  onClick={handleSubmitAppraisal}
                  disabled={!isSatisfiedRequirement || isSubmitting}
                  className={`w-full py-4 rounded-2xl font-black text-base shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isSatisfiedRequirement && !isSubmitting
                      ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white shadow-emerald-200 hover:shadow-xl active:scale-98 animate-pulse'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  }`}
                >
                  <Sparkles className="w-5 h-5" />
                  <span>
                    {isSubmitting ? '技能鑑定中...' : '技能鑑定（解鎖送出）'}
                  </span>
                </button>
                {!isSatisfiedRequirement && (
                  <p className="text-center text-[11px] text-slate-400 mt-1.5 font-medium">
                    需滿 35 字以上才能按下技能鑑定
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 4: CERTIFIED RESULT SCREEN (證書與截圖下載) */}
        {/* ========================================================= */}
        {currentStep === 'certified' && certifiedRecord && activeSkill && (
          <CertificationCard
            record={certifiedRecord}
            iconName={activeSkill.iconName}
            onRestart={() => {
              setCurrentStep('cover');
              setCertifiedRecord(null);
              setActiveSkill(null);
            }}
            onOpenGoogleSync={() => setShowGoogleModal(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-6 text-center text-xs text-slate-500 border-t border-sky-200/60 bg-white/40">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Boreas 北風學院 ｜ 隱藏版超能力解鎖遊戲</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCodex(true)}
              className="text-sky-700 hover:underline font-bold"
            >
              超能力圖鑑 (30項)
            </button>
            <span>•</span>
            <button
              onClick={() => setShowGoogleModal(true)}
              className="text-sky-700 hover:underline font-bold"
            >
              Google 表單設定
            </button>
          </div>
        </div>
      </footer>

      {/* Superpower Codex Modal */}
      <SuperpowerCodexModal
        isOpen={showCodex}
        onClose={() => setShowCodex(false)}
        onSelectSkillToUnlock={(skill) => {
          if (!studentName.trim()) {
            const name = prompt('請先輸入您的姓名或暱稱（如：小柏/北風KD）：');
            if (!name || !name.trim()) return;
            setStudentName(name.trim());
          }
          handleSelectSkillToAnswer(skill);
        }}
      />

      {/* Google Form Modal */}
      <GoogleSyncModal
        isOpen={showGoogleModal}
        onClose={() => setShowGoogleModal(false)}
      />

      {/* Share / QR Code Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
    </div>
  );
}
