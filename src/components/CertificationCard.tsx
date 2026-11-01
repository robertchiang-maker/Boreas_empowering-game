import React, { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import {
  Download,
  Copy,
  Check,
  FormInput,
  RefreshCw,
  Sparkles,
  Award,
  User,
  ShieldCheck,
  Quote
} from 'lucide-react';
import { UnlockedRecord, CATEGORIES } from '../data/superpowers';
import { SuperpowerIcon } from './SuperpowerIcon';
import { BoreasHero } from './BoreasHero';
import { syncRecordToGoogleForm, getGoogleFormConfig } from '../utils/storage';

interface CertificationCardProps {
  record: UnlockedRecord;
  iconName: string;
  onRestart: () => void;
  onOpenGoogleSync: () => void;
}

export const CertificationCard: React.FC<CertificationCardProps> = ({
  record,
  iconName,
  onRestart,
  onOpenGoogleSync
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Generate a stylish ID if missing
  const certId = record.id || `BOR-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  // Find category styling
  const catKey = Object.keys(CATEGORIES).find(
    (k) => CATEGORIES[k].name === record.category
  ) || 'cat1';
  const catInfo = CATEGORIES[catKey] || CATEGORIES.cat1;

  // Handle PNG Screenshot Download
  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    try {
      setDownloading(true);
      // Wait for any font rendering
      await new Promise((res) => setTimeout(res, 150));
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        quality: 0.98,
        pixelRatio: 2.5,
        backgroundColor: '#f0f9ff'
      });
      const link = document.createElement('a');
      const filename = `Boreas超能力認證_${record.studentName}_${record.customSkillName || record.skillName}.png`;
      link.download = filename;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Screenshot download failed', err);
      alert('截圖生成中遇到問題，您也可以直接在螢幕上截圖存檔喔！');
    } finally {
      setDownloading(false);
    }
  };

  // Copy text summary
  const handleCopySummary = () => {
    const text = `【Boreas 北風學院 隱藏版超能力認證】\n` +
      `🎓 姓名：${record.studentName}\n` +
      `⚡ 超能力名稱：${record.customSkillName || record.skillName}（${record.category}）\n` +
      `🔑 核心特質：${record.keywords}\n` +
      `📜 事件與感受：\n「${record.story}」\n` +
      `📅 認證時間：${record.unlockedAt}\n` +
      `🏅 認證編號：${certId}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Sync to Google Form
  const handleSyncToGoogle = async () => {
    const config = getGoogleFormConfig();
    if (!config.formUrl) {
      onOpenGoogleSync();
      return;
    }

    setIsSyncing(true);
    setSyncStatus(null);
    const result = await syncRecordToGoogleForm(record);
    setIsSyncing(false);
    setSyncStatus(result.message);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Top Congratulatory Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-sm font-bold border border-emerald-300 shadow-sm animate-bounce">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          恭喜完成技能鑑定！超能力已正式覺醒！
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
          🎉 獲得專屬北風認證卡
        </h2>
        <p className="text-sm text-slate-600">
          您可以直接點擊下方<strong>「📸 下載認證卡截圖 (PNG)」</strong>保存，或同步存進 Google 表單！
        </p>
      </div>

      {/* The Printable / Screenshotable Card */}
      <div
        ref={cardRef}
        className="relative bg-gradient-to-br from-white via-sky-50/70 to-blue-50/80 rounded-3xl p-6 sm:p-9 shadow-2xl border-4 border-sky-200/90 text-slate-800 overflow-hidden"
      >
        {/* Subtle Wind Wave Background Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-25">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="windPattern" width="120" height="60" patternUnits="userSpaceOnUse">
                <path d="M 0 30 Q 30 15 60 30 T 120 30" fill="none" stroke="#0284c7" strokeWidth="1.2" strokeDasharray="4 6" />
                <path d="M 10 45 Q 40 35 70 45 T 130 45" fill="none" stroke="#38bdf8" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#windPattern)" />
          </svg>
        </div>

        {/* Top Boreas Crest & Title */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between pb-5 border-b-2 border-sky-200/80 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-cyan-500 flex items-center justify-center text-white shadow-md">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-widest text-sky-700 uppercase bg-sky-100/90 px-2 py-0.5 rounded-md">
                  BOREAS ACADEMY
                </span>
                <span className="text-xs font-semibold text-slate-500">北風學院</span>
              </div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                隱藏版超能力官方認證卡
              </h1>
            </div>
          </div>

          {/* Certificate ID & Date */}
          <div className="text-right sm:text-right flex sm:flex-col items-center sm:items-end gap-2 sm:gap-0.5 text-xs text-slate-500 font-mono">
            <span>認證編號：<strong className="text-sky-800">{certId}</strong></span>
            <span>日期：{record.unlockedAt.split(' ')[0] || new Date().toISOString().slice(0, 10)}</span>
          </div>
        </div>

        {/* Student Name Banner (No class/team, clean name badge) */}
        <div className="relative z-10 mt-5 bg-gradient-to-r from-sky-500/10 via-cyan-500/10 to-transparent p-3.5 rounded-2xl border border-sky-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-slate-700">
            <User className="w-4 h-4 text-sky-600" />
            <span className="text-xs font-bold text-slate-500">超能力擁有者：</span>
            <span className="text-base sm:text-lg font-black text-slate-900">
              {record.studentName}
            </span>
          </div>
          <span className="text-xs font-bold text-sky-700 flex items-center gap-1 bg-white/80 px-2.5 py-1 rounded-full shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 經學院鑑定正式解鎖
          </span>
        </div>

        {/* Main Superpower Feature Box */}
        <div className="relative z-10 mt-6 bg-white/95 rounded-2xl p-6 shadow-sm border border-sky-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Superpower Icon with Wind Swirl */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-cyan-400 p-0.5 shadow-md shrink-0">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-sky-600">
                <SuperpowerIcon name={iconName} className="w-8 h-8" />
              </div>
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-xs font-black px-2.5 py-0.5 rounded-full border ${catInfo.badgeBg}`}>
                  {catInfo.roman}. {record.category}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {record.keywords}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                {record.customSkillName || record.skillName}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                「{record.description}」
              </p>
            </div>
          </div>
        </div>

        {/* Student's Unlock Proof (The Story: Event + Feeling) */}
        <div className="relative z-10 mt-5 bg-gradient-to-br from-sky-100/60 to-blue-50/70 rounded-2xl p-5 border border-sky-200/90 shadow-inner">
          <div className="flex items-center gap-2 mb-2 text-sky-900 font-bold text-xs sm:text-sm">
            <Quote className="w-4 h-4 text-sky-600 fill-sky-600" />
            <span>事件與感受：</span>
          </div>
          <div className="text-slate-800 text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-medium pl-3 border-l-3 border-sky-400">
            {record.story}
          </div>
        </div>

        {/* Bottom Seal & Q-version Boreas Hero Signature */}
        <div className="relative z-10 mt-6 pt-4 border-t border-sky-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BoreasHero size="sm" animated={false} className="w-14 h-14" />
            <div>
              <p className="text-xs font-bold text-sky-900">Boreas 北風學院評議會</p>
              <p className="text-[11px] text-slate-500">乘風而行・潛能無限</p>
            </div>
          </div>

          {/* Official Holographic / Stamp Seal */}
          <div className="relative w-24 h-24 flex items-center justify-center select-none pointer-events-none transform -rotate-6">
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-red-500/80 animate-spin-slow" />
            <div className="w-20 h-20 rounded-full border-2 border-red-600/90 bg-red-50/50 flex flex-col items-center justify-center text-center p-1 text-red-600 shadow-sm backdrop-blur-[1px]">
              <span className="text-[8px] font-black tracking-tighter uppercase">BOREAS SEAL</span>
              <span className="text-[10px] font-black leading-tight border-y border-red-500/50 my-0.5 py-0.5 w-full">
                北風鑑定通過
              </span>
              <span className="text-[7px] font-bold">能力已解鎖</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons Toolbar */}
      <div className="bg-white rounded-2xl p-5 shadow-lg border border-sky-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Primary Download Button */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleDownloadImage}
            disabled={downloading}
            className="flex-1 sm:flex-none px-6 py-3.5 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            {downloading ? '生成截圖中...' : '📸 下載認證卡截圖 (PNG)'}
          </button>

          <button
            onClick={handleCopySummary}
            className="px-4 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer"
            title="複製文字內容"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>已複製！</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>複製文字</span>
              </>
            )}
          </button>
        </div>

        {/* Cloud Sync & Restart Actions */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={handleSyncToGoogle}
            disabled={isSyncing}
            className="px-4 py-3 bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer"
            title="存進 Google 表單"
          >
            <FormInput className={`w-4 h-4 text-sky-600 ${isSyncing ? 'animate-bounce' : ''}`} />
            <span>{isSyncing ? '送出中...' : '存進 Google 表單'}</span>
          </button>

          <button
            onClick={onRestart}
            className="px-5 py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>再抽下一張籤</span>
          </button>
        </div>
      </div>

      {/* Sync feedback notification */}
      {syncStatus && (
        <div className="p-3.5 bg-sky-50 border border-sky-300 rounded-xl text-xs sm:text-sm text-sky-900 flex items-center justify-between animate-fade-in">
          <span>{syncStatus}</span>
          <button
            onClick={onOpenGoogleSync}
            className="text-xs text-sky-700 font-bold underline hover:text-sky-900 ml-3"
          >
            查看/變更 Google 表單設定
          </button>
        </div>
      )}
    </div>
  );
};
