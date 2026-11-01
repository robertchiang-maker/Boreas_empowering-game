import React, { useState } from 'react';
import {
  X,
  BookOpen,
  CheckCircle2,
  Lock,
  Download,
  Filter,
  Search,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { SUPERPOWERS, CATEGORIES, Superpower } from '../data/superpowers';
import { SuperpowerIcon } from './SuperpowerIcon';
import { exportRecordsToCSV, getSavedRecords } from '../utils/storage';

interface SuperpowerCodexModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSkillToUnlock?: (skill: Superpower) => void;
}

export const SuperpowerCodexModal: React.FC<SuperpowerCodexModalProps> = ({
  isOpen,
  onClose,
  onSelectSkillToUnlock
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previewSkill, setPreviewSkill] = useState<Superpower | null>(null);

  if (!isOpen) return null;

  const records = getSavedRecords();
  const unlockedIds = new Set(records.map((r) => r.skillId));

  const filteredSkills = SUPERPOWERS.filter((skill) => {
    const matchesCategory =
      selectedCategory === 'all' || skill.categoryNumber === selectedCategory;
    const matchesQuery =
      searchQuery === '' ||
      skill.name.includes(searchQuery) ||
      skill.keywords.includes(searchQuery) ||
      skill.description.includes(searchQuery);
    return matchesCategory && matchesQuery;
  });

  const handleExportCSV = () => {
    if (records.length === 0) {
      alert('目前尚無解鎖紀錄可匯出。完成技能鑑定後即可一鍵匯出！');
      return;
    }
    exportRecordsToCSV(records);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-sky-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-sky-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-600 via-sky-500 to-cyan-500 p-5 sm:p-6 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-md">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black">
                Boreas 北風學院｜超能力全圖鑑
              </h3>
              <p className="text-xs sm:text-sm text-sky-100">
                收錄 30 項隱藏版學院軟實力（已解鎖 {unlockedIds.size} / 30 項）
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Filter bar & Search */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 shrink-0 space-y-3">
          <div className="flex flex-col sm:flex-row gap-2 justify-between items-stretch sm:items-center">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜尋技能名稱、關鍵字或描述..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  清除
                </button>
              )}
            </div>

            {/* Export records */}
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors shrink-0"
              title="匯出所有已解鎖紀錄"
            >
              <Download className="w-4 h-4 text-sky-600" />
              匯出全班已解鎖紀錄 (CSV)
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-full font-bold transition-colors shrink-0 ${
                selectedCategory === 'all'
                  ? 'bg-sky-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              全部 (30)
            </button>
            {Object.values(CATEGORIES)
              .filter((c) => c.id !== 'custom')
              .map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full font-bold transition-colors shrink-0 flex items-center gap-1 ${
                    selectedCategory === cat.id
                      ? 'bg-sky-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>{cat.roman}.</span>
                  <span>{cat.name}</span>
                </button>
              ))}
          </div>
        </div>

        {/* Superpowers Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {filteredSkills.map((skill) => {
            const isUnlocked = unlockedIds.has(skill.id);
            const catInfo = CATEGORIES[skill.categoryNumber] || CATEGORIES.cat1;

            return (
              <div
                key={skill.id}
                onClick={() => setPreviewSkill(skill)}
                className={`group relative p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between hover:shadow-md ${
                  isUnlocked
                    ? 'bg-sky-50/70 border-sky-300 hover:border-sky-500'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono font-bold text-slate-400">
                      NO.{skill.id}
                    </span>
                    {isUnlocked ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        <CheckCircle2 className="w-3 h-3" /> 已解鎖
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-medium">
                        <Lock className="w-2.5 h-2.5" /> 待解鎖
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <SuperpowerIcon name={skill.iconName} className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm leading-tight group-hover:text-sky-600 transition-colors">
                        {skill.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {skill.keywords}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {skill.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className={`px-2 py-0.5 rounded font-bold ${catInfo.badgeBg}`}>
                    {catInfo.name}
                  </span>
                  <span className="text-sky-600 font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                    查看詳情 <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Skill Preview Modal Overlay if clicked */}
        {previewSkill && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-20">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border-2 border-sky-200 animate-scale-up space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center shadow-xs">
                    <SuperpowerIcon name={previewSkill.iconName} className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-sky-600">
                      NO.{previewSkill.id} ｜ {previewSkill.category}
                    </span>
                    <h3 className="text-xl font-black text-slate-900">
                      {previewSkill.name}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setPreviewSkill(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-sky-50 rounded-xl p-3 border border-sky-100">
                <p className="text-xs font-bold text-sky-800">
                  核心特質：{previewSkill.keywords}
                </p>
                <p className="text-[11px] text-sky-600 mt-0.5">
                  系所定位：{previewSkill.categoryTheme}
                </p>
              </div>

              <div className="space-y-1">
                <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  技能官方說明
                </h5>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  {previewSkill.description}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setPreviewSkill(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                >
                  返回列表
                </button>
                {onSelectSkillToUnlock && (
                  <button
                    onClick={() => {
                      onSelectSkillToUnlock(previewSkill);
                      setPreviewSkill(null);
                      onClose();
                    }}
                    className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    選擇此技能直接挑戰解鎖
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>北風學院超能力圖鑑（共 30 項隱藏技能 ＋ 1 項專屬自創）</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold transition-colors"
          >
            關閉圖鑑
          </button>
        </div>
      </div>
    </div>
  );
};
