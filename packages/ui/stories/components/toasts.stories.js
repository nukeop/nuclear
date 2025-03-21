import React, { useState } from 'react';
import { ToastContainer } from '../..';
import './toasts.styles.scss';

export default {
  title: 'Components/Toasts'
};

export const ToastTypes = () => {
  return (
    <div
      style={{
        background: '#282a36',
        height: '100%',
        boxSizing: 'border-box'
      }}
    >
      <ToastContainer
        toasts={[
          {
            title: 'Example toast',
            details: 'Toast notification description',
            icon: <img src='https://cdn.svgporn.com/logos/emacs.svg' />
          },
          {
            title: 'Error notification',
            details: 'Error notification description',
            error: true
          },
          {
            title: 'Warning notification',
            details: 'Warning notification description',
            warning: true
          },
          {
            title: 'Example info toast',
            details: 'Toast notification description',
            icon: <img src='https://cdn.svgporn.com/logos/vim.svg' />,
            info: true
          },
          {
            title: 'Example success toast',
            details: 'Toast notification description',
            icon: <img src='https://cdn.svgporn.com/logos/atom.svg' />,
            success: true
          },
          {
            title: 'Toast with a very long description and a very long title that overflows',
            details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce posuere feugiat orci, sed elementum neque malesuada a.'
          },
          {
            title: 'Toast with a long description and an icon',
            details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce posuere feugiat orci, sed elementum neque malesuada a.',
            icon: <img src='https://cdn.svgporn.com/logos/emacs.svg' />
          },
          {
            title: 'Toast with no description'
          }
        ]}
      />
    </div>
  );
};

export const WithAddRemoveButton = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = () => {
    const newToasts = [...toasts];
    newToasts.push({
      title: 'Example toast',
      details: 'Example toast description'
    });
    setToasts(newToasts);
    return false;
  };

  const removeToast = () => {
    const newToasts = [...toasts];
    newToasts.shift();
    setToasts(newToasts);
    return false;
  };

  return (
    <div
      style={{
        background: '#282a36',
        height: '100%',
        boxSizing: 'border-box'
      }}
    >
      <div className='buttons'>
        <a
          href='javascript:void(0)'
          className='toast-button'
          onClick={addToast}
        >
          Add toast
        </a>
        <a
          href='javascript:void(0)'
          className='toast-button'
          onClick={removeToast}
        >
          Remove toast
        </a>
      </div>

      <ToastContainer
        toasts={toasts}
      />
    </div>
  );
};

export const ClickableToasts = () => {
  return (
    <div
      style={{
        background: '#282a36',
        height: '100%',
        boxSizing: 'border-box'
      }}
    >
      <ToastContainer
        toasts={[
          {
            title: 'Example clickable toast',
            details: 'Example toast description',
            onClick: () => alert('You clicked me')
          }
        ]}
      />
    </div>
  );
};
