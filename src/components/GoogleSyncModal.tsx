import React, { useState, useEffect } from 'react';
import { FormInput, Check, ExternalLink, X, HelpCircle, Save, Sparkles, FileSpreadsheet } from 'lucide-react';
import {
  getGoogleFormConfig,
  saveGoogleFormConfig,
  parsePrefilledGoogleFormUrl,
  GoogleFormConfig
} from '../utils/storage';

interface GoogleSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (config: GoogleFormConfig) => void;
}

export const GoogleSyncModal: React.FC<GoogleSyncModalProps> = ({
  isOpen,
  onClose,
  onSaved
}) => {
  const [config, setConfig] = useState<GoogleFormConfig>(getGoogleFormConfig());
  const [pastedUrl, setPastedUrl] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [parseHint, setParseHint] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setConfig(getGoogleFormConfig());
      setPastedUrl('');
      setParseHint(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Auto-parse when user pastes prefilled link
  const handleAutoParse = (inputUrl: string) => {
    setPastedUrl(inputUrl);
    if (!inputUrl.trim()) return;

    const parsed = parsePrefilledGoogleFormUrl(inputUrl.trim());
    if (parsed && parsed.formUrl) {
      const newConfig: GoogleFormConfig = {
        formUrl: parsed.formUrl,
        nameEntryId: parsed.nameEntryId || config.nameEntryId || '',
        skillEntryId: parsed.skillEntryId || config.skillEntryId || '',
        storyEntryId: parsed.storyEntryId || config.storyEntryId || ''
      };
      setConfig(newConfig);
      setParseHint('🎉 成功自動辨識表單網址與 3 個欄位代碼！');
    } else if (inputUrl.includes('docs.google.com/forms')) {
      // Basic form link without entries
      let responseUrl = inputUrl.split('?')[0];
      if (responseUrl.endsWith('/viewform')) {
        responseUrl = responseUrl.replace('/viewform', '/formResponse');
      } else if (!responseUrl.endsWith('/formResponse')) {
        responseUrl = responseUrl.replace(/\/$/, '') + '/formResponse';
      }
      setConfig((prev) => ({ ...prev, formUrl: responseUrl }));
      setParseHint('已填入表單網址。若為一般網址，請確認三個 entry 欄位代碼或直接使用預填連結。');
    }
  };

  const handleSave = () => {
    saveGoogleFormConfig(config);
    setSavedSuccess(true);
    if (onSaved) onSaved(config);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sky-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border-2 border-sky-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-600 via-sky-500 to-cyan-500 p-5 sm:p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-md">
              <FormInput className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-black">Google 表單自動收集設定</h3>
              <p className="text-xs text-sky-100 mt-0.5">
                學生完成鑑定後，自動填入您的 Google 表單並匯總至 Google 試算表
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-700">
          {/* Target Columns Notice */}
          <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 text-xs sm:text-sm leading-relaxed">
            <p className="font-bold text-sky-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-sky-600" />
              已設定收集的三個欄位：
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="px-3 py-1 bg-white rounded-lg font-bold text-sky-800 border border-sky-200 shadow-xs">
                1. 姓名
              </span>
              <span className="px-3 py-1 bg-white rounded-lg font-bold text-sky-800 border border-sky-200 shadow-xs">
                2. 超能力名稱
              </span>
              <span className="px-3 py-1 bg-white rounded-lg font-bold text-sky-800 border border-sky-200 shadow-xs">
                3. 事件與感受
              </span>
            </div>
          </div>

          {/* Quick Paste Area */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-800">
              貼上您的 Google 表單網址（或「預先填寫的連結」）
            </label>
            <input
              type="url"
              value={pastedUrl || config.formUrl}
              onChange={(e) => handleAutoParse(e.target.value)}
              placeholder="https://docs.google.com/forms/d/e/.../viewform?usp=pp_url&entry..."
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400 text-xs sm:text-sm font-mono"
            />
            {parseHint && (
              <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> {parseHint}
              </p>
            )}
          </div>

          {/* Entry Fields Setup */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/70 space-y-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              欄位代碼對照（若貼上「預先填寫的連結」會自動帶入）
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  1. 姓名代碼
                </label>
                <input
                  type="text"
                  value={config.nameEntryId}
                  onChange={(e) =>
                    setConfig({ ...config, nameEntryId: e.target.value.trim() })
                  }
                  placeholder="如 entry.123456"
                  className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  2. 超能力名稱代碼
                </label>
                <input
                  type="text"
                  value={config.skillEntryId}
                  onChange={(e) =>
                    setConfig({ ...config, skillEntryId: e.target.value.trim() })
                  }
                  placeholder="如 entry.234567"
                  className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  3. 事件與感受代碼
                </label>
                <input
                  type="text"
                  value={config.storyEntryId}
                  onChange={(e) =>
                    setConfig({ ...config, storyEntryId: e.target.value.trim() })
                  }
                  placeholder="如 entry.345678"
                  className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* 30-Second Tutorial */}
          <div className="border border-sky-100 rounded-2xl p-4 bg-sky-50/50 space-y-2 text-xs text-slate-600">
            <p className="font-bold text-sky-900 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-sky-600" />
              如何 30 秒取得「預先填寫的連結」？（超簡單！）
            </p>
            <ol className="list-decimal list-inside space-y-1 pl-1 leading-relaxed">
              <li>打開您的 Google 表單，點擊右上角<strong>「三個點 (⋮)」</strong>圖示。</li>
              <li>選擇<strong>「取得預先填寫的連結」</strong>。</li>
              <li>在「姓名」、「超能力名稱」、「事件與感受」三個格子隨便打個 1、2、3。</li>
              <li>滑到最底下點擊<strong>「取得連結」</strong>並複製，直接貼到上方輸入框即可自動帶入！</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {config.formUrl ? '✓ 已綁定表單' : '尚未設定'}
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-xs transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" /> 已儲存
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> 儲存表單設定
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
