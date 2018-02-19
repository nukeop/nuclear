import React from 'react';

import BestNewListActiveItem from './BestNewListActiveItem';
import BestNewListItem from './BestNewListItem';
import styles from './styles.scss';

class BestNewList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: 0
    };
  }

  render() {
    let {
      data,
      artistInfoSearchByName,
      history
    } = this.props;

    return (
      <div className={styles.best_new_list_container}>

        <div className={styles.best_new_main}>
          <BestNewListActiveItem
            item={data[this.state.activeItem]}
            artistInfoSearchByName={artistInfoSearchByName}
            history={history}
          />
        </div>
        <div className={styles.best_new_items}>
          {
            data.map((el, i) => {
              return <BestNewListItem
                onMouseEnter={
                  () => this.setState({
                    activeItem: i
                  })
                }
                item={el}
                key={i}
              />;
            })
          }
        </div>

      </div>
    );
  }
}

export default BestNewList;
