import React, { useState } from 'react';
import { QrCode, Copy, Check, ExternalLink, X, Share2, Sparkles } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  sharedUrl?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  sharedUrl
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedInvite, setCopiedInvite] = useState(false);

  if (!isOpen) return null;

  // Use the shared pre URL or current window URL
  const currentUrl =
    sharedUrl ||
    (typeof window !== 'undefined'
      ? window.location.origin
      : 'https://ais-pre-7db5h5lt45xjaxivfxk7il-653150570827.asia-northeast1.run.app');

  // Generate QR Code image url using Google Charts / QRServer API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent(
    currentUrl
  )}`;

  const inviteText = `⚡【Boreas 北風學院｜隱藏版超能力解鎖】⚡\n\n快來探索你在學院生活裡悄悄累積的軟實力！\n抽出一張屬於你的超能力籤，解鎖官方技能認證卡！\n\n👉 點擊立即開始解鎖：\n${currentUrl}`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(inviteText);
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sky-950/65 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border-2 border-sky-100 overflow-hidden flex flex-col animate-scale-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-600 via-sky-500 to-cyan-500 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
              <Share2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black">公布與分享遊戲</h3>
              <p className="text-xs text-sky-100">投影在大螢幕或發布給全班同學！</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 text-center space-y-5">
          {/* QR Code Container for classroom projection */}
          <div className="inline-block p-4 bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl border-2 border-sky-200 shadow-inner">
            <img
              src={qrCodeUrl}
              alt="遊戲 QR Code"
              className="w-48 h-48 sm:w-56 sm:h-56 mx-auto rounded-xl shadow-xs bg-white p-2"
            />
            <p className="text-xs text-sky-800 font-bold mt-2 flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              學生用手機掃描即可立即開始！
            </p>
          </div>

          {/* URL Box & Copy */}
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-bold text-slate-700">遊戲分享網址：</label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-700 select-all focus:outline-none"
              />
              <button
                onClick={handleCopyUrl}
                className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-xs"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> 已複製
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> 複製網址
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Copy Invitation Text for Google Classroom / LINE */}
          <div className="pt-1">
            <button
              onClick={handleCopyInvite}
              className="w-full py-2.5 px-4 bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedInvite ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  已複製邀請公告文字（可直接貼至 LINE / Classroom）
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-sky-600" />
                  一鍵複製完整公告文案（含標題與連結）
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-colors"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
};
