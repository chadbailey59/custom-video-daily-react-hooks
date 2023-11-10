import './Subtitle.css';
import { useParticipantProperty, useAppMessage } from '@daily-co/daily-react';
import { useState, useContext } from 'react';
import { LanguageContext } from '../../contexts/Language/LanguageContext';

export default function Subtitle({ id }) {
  const [text, setText] = useState();
  const [lang, setLang] = useContext(LanguageContext);

  const sendAppMessage = useAppMessage({
    onAppMessage: (ev) => {
      if (lang.local?.subtitles == ev.data?.translation_language && ev.data?.session_id === id) {
        setText(ev.data.translation);
      }
    },
  });

  return (
    <div className="subtitle">
      <p>{text && <span>{text}</span>}</p>
    </div>
  );
}
