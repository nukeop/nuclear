import React from 'react';

import styles from './styles.scss';

import WindowButton from './WindowButton';

type WindowControlsProps = {
  onCloseClick: React.MouseEventHandler;
  onMaxClick: React.MouseEventHandler;
  onMinClick: React.MouseEventHandler;
};

const WindowControls: React.FC<WindowControlsProps> = ({
  onCloseClick,
  onMaxClick,
  onMinClick
}) => {
  const [isMaximized, setIsMaximized] = React.useState(false);

  const handleMaximizeClick = (event: React.MouseEvent) => {
    setIsMaximized(!isMaximized);
    onMaxClick(event);
  };

  React.useEffect(() => {
    const handleWindowResize = () => {
      const maximized =
        window.outerWidth === window.screen.availWidth &&
        window.outerHeight === window.screen.availHeight;
      setIsMaximized(maximized);
    };

    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  return (
    <div className={styles.window_controls_container}>
      <WindowButton
        data-testid='minimize-button'
        icon='window minimize'
        onClick={onMinClick}
      />
      <WindowButton
        data-testid='maximize-button'
        icon={isMaximized ? 'window restore outline' : 'window maximize outline'}
        onClick={handleMaximizeClick} 
      />
      <WindowButton
        data-testid='close-button'
        icon='close'
        onClick={onCloseClick}
      />
    </div>
  );
};

export default WindowControls;
