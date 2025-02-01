import React, { ComponentProps, useCallback, useEffect, useState } from 'react';
import { Icon, Input } from 'semantic-ui-react';

import Button from '../Button';
import Card from '../Card';
import styles from './styles.scss';

type CardWithId = ComponentProps<typeof Card> & {
  id: string;
}

type CardRowProps = {
  cards: CardWithId[];
  header?: string;
  filterPlaceholder?: string;
  nothingFoundLabel?: string;
}

const EmptyState: React.FC<{nothingFoundLabel: string}> = ({nothingFoundLabel}) => (
  <div className={styles.empty_state}>
    <Icon.Group size='massive'>
      <Icon name='search' />
      <Icon corner='bottom left' name='times' color='red' />
    </Icon.Group>
    <h2>{nothingFoundLabel}</h2>
  </div>

);

const SCROLL_INCREMENT = 240;
const CardsRow: React.FC<CardRowProps> = ({
  cards,
  header,
  filterPlaceholder,
  nothingFoundLabel
}) => {
  const cardsRow = React.useRef<HTMLDivElement>(null);
  const onScrollButtonClick = (direction: 1 | -1) => () => {
    if (cardsRow.current) {
      const newScrollPosition = Math.ceil((cardsRow.current.scrollLeft + direction * SCROLL_INCREMENT)/SCROLL_INCREMENT) * SCROLL_INCREMENT;
      cardsRow.current.scroll(newScrollPosition, 0);
    }
  };

  const [displayedCards, setDisplayedCards] = useState(cards);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    setDisplayedCards(cards);
  }, [cards]);

  const onFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  const onFilterClick = useCallback(() => {
    setFilter('');
  }, []);

  useEffect(() => {
    setDisplayedCards(cards.filter(card => card.header.toLowerCase().includes(filter.toLowerCase())));
  }, [cards, filter]);

  return <div className={styles.cards_row_container}>
    <div className={styles.header_row}>
      <h2>{header}</h2>
      <div className={styles.scroll_buttons}>
        <div className={styles.filter_container}>
          <Input 
            className={styles.cards_filter}
            value={filter}
            onChange={onFilterChange}
            placeholder={filterPlaceholder}
          />
          <Button 
            className={styles.filter_button}
            onClick={onFilterClick}
            borderless
            color={'blue'}
            icon='filter' 
          />
        </div>
        <Button 
          className={styles.scroll_button}
          onClick={onScrollButtonClick(-1)}
          borderless
          circular
          size='tiny'
          color='blue'
          icon='chevron left'
        />
        <Button 
          className={styles.scroll_button}
          onClick={onScrollButtonClick(1)}
          borderless
          circular
          size='tiny'
          color='blue'
          icon='chevron right'
        />
      </div>
    </div>
    <div 
      className={styles.cards_row}
      ref={cardsRow}
    >
      {
        displayedCards.length > 0 ?
          displayedCards.map(card => <Card 
            key={card.id}
            className={styles.row_card}
            {...card} 
          />)
          : <EmptyState nothingFoundLabel={nothingFoundLabel}/>
      }
    </div>
  </div>;
};

export default CardsRow;
