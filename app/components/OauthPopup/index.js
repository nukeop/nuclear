import React from 'react';
import PropTypes from 'prop-types';

class OauthPopup extends React.Component {
  constructor(props) {
    super(props);
  }

  createPopup() {
    const {
      url,
      width,
      height,
      onCode,
      onClose,
      onError
    } = this.props;

    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2.5;
    this.externalWindow = window.open(
      url,
      '',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    this.codeCheck = setInterval(() => {
      try {
        const params = new URL(this.externalWindow.location).searchParams;
        const code = params.get('code');
        if (!code) {
          return;
        }
        clearInterval(this.codeCheck);
        onCode(code, params);
        this.externalWindow.close();
      } catch (e) {
        onError(e);
      }
    }, 20);

    this.externalWindow.onbeforeunload = () => {
      onClose();
      clearInterval(this.codeCheck);
    };
  }

  render() {
    const {
      render
    } = this.props;
    
    return render({ onClick: this.createPopup.bind(this) });
  }
}

OauthPopup.propTypes = {
  url: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  render: PropTypes.func,
  onCode: PropTypes.func,
  onClose: PropTypes.func,
  onError: PropTypes.func
};

OauthPopup.defaultProps = {
  url: '',
  width: 500,
  height: 500,
  render: () => null,
  onCode: () => {},
  onClose: () => {},
  onError: () => {}
};

export default OauthPopup;
