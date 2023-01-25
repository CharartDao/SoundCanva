import React from 'react';
// import { useTranslation } from 'react-i18next';
import layout from '../../components/layout';
import MicrophoneInput from '../../components/microphone-input';
import './sound-canva-page.scss';

const SoundCanvaPage: React.FC = () => {

  // const { t } = useTranslation();

  return (
    <div className="sound-canva">
        <h1>Sound Wave</h1>
        <p className="subtitle">Present the special person the special sound to abstract art representation of love. </p>
        <MicrophoneInput />
    </div>
  );
};

export default layout(SoundCanvaPage)({ pageName: 'soundCanva' });