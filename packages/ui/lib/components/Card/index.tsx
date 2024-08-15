import React from 'react';
import cx from 'classnames';
import _ from 'lodash';
import { Dropdown, DropdownItemProps, DropdownHeaderProps, DropdownDividerProps } from 'semantic-ui-react';

import artPlaceholder from '../../../resources/media/art_placeholder.png';
import common from '../../common.scss';
import styles from './styles.scss';

export type CardMenuEntry = {
  type: 'header' | 'item' | 'divider';
  props?: DropdownItemProps | DropdownHeaderProps | DropdownDividerProps;
};

type CardProps = {
  header: string;
  content?: string;
  image?: string;
  onClick?: React.MouseEventHandler;
  withMenu?: boolean;
  animated?: boolean;
  menuEntries?: CardMenuEntry[];
  className?: string;
  'data-testid'?: string;
};

const Card: React.FC<CardProps> = ({
  header,
  content,
  image,
  onClick,
  withMenu = false,
  animated = true,
  menuEntries,
  className,
  'data-testid': dataTestId
}) => (
  <div 
    className={cx(
      common.nuclear,
      styles.card_container,
      className
    )}
    data-testid={dataTestId}
  >
    <div
      className={cx(
        styles.card,
        { [styles.animated]: animated }
      )}
      onClick={onClick}
    >
      {
        withMenu &&
          <Dropdown
            basic
            icon='ellipsis vertical'
            className={styles.menu_button}
          >
            {
              _.isArray(menuEntries) && !_.isEmpty(menuEntries) &&
              <Dropdown.Menu>
                {
                  menuEntries.map((entry, i) => {
                    switch (entry.type) {
                    case 'header':
                      return <Dropdown.Header {...entry.props} />;
                    case 'item':
                      return <Dropdown.Item key={`item-${i}`} {...entry.props} />;
                    case 'divider':
                      return <Dropdown.Divider {...entry.props} />;
                    }
                  })
                }
              </Dropdown.Menu>
            }
          </Dropdown>
      }
      <div className={styles.thumbnail}
        style={{ backgroundImage: `url('${(_.isNil(image) || _.isEmpty(image)) ? artPlaceholder : image}')` }}
      >
        <div className={styles.overlay} />
      </div>
      <div className={styles.card_content}>
        <h4>{header}</h4>
        {
          _.isNil(content)
            ? null
            : <p>{content}</p>
        }
      </div>
    </div>
  </div>
);
export default Card;
