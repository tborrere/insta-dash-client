
import React from 'react';
import { HardDrive, FileText, Megaphone } from 'lucide-react';

interface BotaoLinksProps {
  driveUrl?: string | null;
  notionUrl?: string | null;
  anunciosUrl?: string | null;
}

const BotaoLinks: React.FC<BotaoLinksProps> = ({
  driveUrl,
  notionUrl,
  anunciosUrl
}) => {
  const buttonBaseClasses = "flex items-center gap-2 px-4 py-2 rounded-md transition-colors";
  const activeClasses = "bg-white border border-gray-300 text-black hover:bg-gray-100 hover:text-blue-900";
  const disabledClasses = "bg-gray-200 text-gray-400 opacity-50 cursor-not-allowed";

  return (
    <div className="flex gap-2">
      {/* Drive Button */}
      {driveUrl ? (
        <a
          href={driveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${buttonBaseClasses} ${activeClasses}`}
        >
          <HardDrive size={20} />
          DRIVE
        </a>
      ) : (
        <button
          disabled
          className={`${buttonBaseClasses} ${disabledClasses}`}
        >
          <HardDrive size={20} />
          DRIVE
        </button>
      )}

      {/* Notion Button */}
      {notionUrl ? (
        <a
          href={notionUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${buttonBaseClasses} ${activeClasses}`}
        >
          <FileText size={20} />
          NOTION
        </a>
      ) : (
        <button
          disabled
          className={`${buttonBaseClasses} ${disabledClasses}`}
        >
          <FileText size={20} />
          NOTION
        </button>
      )}

      {/* Anúncios Button */}
      {anunciosUrl ? (
        <a
          href={anunciosUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${buttonBaseClasses} ${activeClasses}`}
        >
          <Megaphone size={20} />
          ANÚNCIOS
        </a>
      ) : (
        <button
          disabled
          className={`${buttonBaseClasses} ${disabledClasses}`}
        >
          <Megaphone size={20} />
          ANÚNCIOS
        </button>
      )}
    </div>
  );
};

export default BotaoLinks;
