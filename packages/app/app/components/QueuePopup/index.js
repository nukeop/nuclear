import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import _ from 'lodash';
import { Dropdown, Popup } from 'semantic-ui-react';
import Img from 'react-image';

import artPlaceholder from '../../../resources/media/art_placeholder.png';
import { getSelectedStream } from '../../utils';

import styles from './styles.scss';
import { withTranslation } from 'react-i18next';

@withTranslation('queue')
class QueuePopup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false
    };
  }

  toggleOpen() {
    this.setState({
      isOpen: !this.state.isOpen
    });
    this.container.click();
  }

  handleClose() {
    this.setState({ isOpen: false });
  }

  rerollTrack(track) {
    let selectedStream = getSelectedStream(
      track.streams,
      this.props.defaultMusicSource
    );
    let musicSource = _.find(
      this.props.musicSources,
      s => s.sourceName === selectedStream.source
    );
    this.props.rerollTrack(musicSource, selectedStream, track);
  }

  renderStreamSourceDropdown() {
    let { track, musicSources, defaultMusicSource } = this.props;

    let dropdownOptions = _.map(musicSources, s => {
      return {
        key: s.sourceName,
        text: s.sourceName,
        value: s.sourceName,
        content: s.sourceName
      };
    });

    let selectedStream = getSelectedStream(track.streams, defaultMusicSource);
    return (
      <div className={styles.stream_source}>
        <label>Source:</label>{' '}
        <Dropdown
          inline
          options={dropdownOptions}
          defaultValue={
            _.find(dropdownOptions, o => o.value === selectedStream.source)
              .value
          }
        />
      </div>
    );
  }

  renderStreamRefreshButton() {
    let { track } = this.props;
    return (
      <div className={styles.stream_buttons}>
        <a href='#' onClick={() => this.rerollTrack.bind(this)(track)}>
          <FontAwesome name='refresh' />
        </a>
      </div>
    );
  }

  renderStreamInfo() {
    const { track, defaultMusicSource, t } = this.props;
    const selectedStream = getSelectedStream(track.streams, defaultMusicSource);

    return (
      <div className={styles.stream_info}>
        <div className={styles.stream_thumbnail}>
          <Img
            alt=''
            src={selectedStream.thumbnail}
            unloader={<img src={artPlaceholder} />}
          />
        </div>
        <div className={styles.stream_text_info}>
          {this.renderStreamSourceDropdown()}
          <div className={styles.stream_title}>
            <label>{t('title')}</label>
            <span>{selectedStream.title}</span>
          </div>
          {selectedStream.id ? (
            <div className={styles.stream_id}>
              <label>{t('id')}</label>
              <span>{selectedStream.id}</span>
            </div>
          ) : (
            null
          )}
        </div>
        {this.renderStreamRefreshButton()}
      </div>
    );
  }

  renderPopupTrigger() {
    let { trigger } = this.props;
    return (
      <div
        ref={element => {
          this.container = element;
        }}
      >
        {trigger}
      </div>
    );
  }

  render() {
    const { track, defaultMusicSource, t } = this.props;
    const selectedStream = getSelectedStream(track.streams, defaultMusicSource);

    return (
      <div onContextMenu={this.toggleOpen.bind(this)}>
        <Popup
          className={styles.queue_popup}
          trigger={this.renderPopupTrigger()}
          open={this.state.isOpen}
          onClose={this.handleClose.bind(this)}
          onOpen={this.toggleOpen.bind(this)}
          hideOnScroll
          position='left center'
          // Do not touch - has to be null
          on={null}
        >
          {track.streams && selectedStream ? (
            this.renderStreamInfo()
          ) : (
            <div className={styles.stream_info}>{t('loading')}</div>
          )}
        </Popup>
      </div>
    );
  }
}

QueuePopup.propTypes = {
  trigger: PropTypes.node,
  track: PropTypes.object,
  defaultMusicSource: PropTypes.object,
  musicSources: PropTypes.array,
  rerollTrack: PropTypes.func
};

export default QueuePopup;
