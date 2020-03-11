import React from 'react';
import { storiesOf } from '@storybook/react';

import {ToastContainer} from '..';
import './toasts.styles.scss';

storiesOf('Toasts', module)
  .add('Toast types', () => {
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
  })
  .add('With add/remove button', () => {
    class Demo extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          toasts: []
        };
      }

      addToast() {
        const newToasts = Object.assign([], this.state.toasts);
        newToasts.push({
          title: 'Example toast',
          details: 'Example toast description'
        });
        this.setState({toasts: newToasts});
        return false;
      }

      removeToast() {
        const newToasts = Object.assign([], this.state.toasts);
        newToasts.shift();
        this.setState({toasts: newToasts});
        return false;
      }

      render() {
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
                onClick={this.addToast.bind(this)}
              >
                Add toast
              </a>
              <a
                href='javascript:void(0)'
                className='toast-button'
                onClick={this.removeToast.bind(this)}
              >
                Remove toast
              </a>
            </div>

            <ToastContainer
              toasts={this.state.toasts}
            />
          </div>
        );
      }
    }

    return <Demo />;
  })
  .add('Clickable toasts', () => {

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
  });
