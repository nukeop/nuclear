import React from 'react';
import {Grid} from 'react-redux-grid';
import {compose} from 'recompose';
import {withTranslation} from 'react-i18next';
import PropTypes from 'prop-types';
import './styles.scss';

const data = {
  'root': {
    'id': -1,
    'Name': 'Root',
    'children': [
      {
        'id': 1,
        'parentId': -1,
        'Name': 'Category 1',
        'GUID': '8f7152dc-fed7-4a65-afcf-527fceb99865',
        'Email': 'hgardnero6@ed.gov',
        'Gender': 'Male',
        'Address': '605 Manley Park',
        'Phone Number': '31-(678)495-4134',
        'children': [
          {
            'id': 11,
            'parentId': 1,
            'Name': 'Category 11',
            'GUID': '8f7152dc-fed7-4a65-afcf-527fceb991865',
            'Email': 'hgardneross6@ed.gov',
            'Gender': 'Male',
            'Address': '12 Manley Park',
            'Phone Number': '31-(678)495-4134'
          },
          {
            'id': 12,
            'parentId': 1,
            'Name': 'Category 12',
            'GUID': '8f7152dc-fed7-4acf-527fceb991865',
            'Email': 'hgardneross6@ed.gov',
            'Gender': 'Male',
            'Address': '12 Manley Park',
            'Phone Number': '31-(678)495-4134',
            'children': [
              {
                'id': 121,
                'parentId': 12,
                'Name': 'Category 121',
                'GUID': '8f7q2dc-fedsss7-4acf-527fceb991865',
                'Email': 'hgoss6@eds.gov',
                'Gender': 'Male',
                'Address': '21 fake Park',
                'Phone Number': '31-(678)495-4134'
              },
              {
                'id': 122,
                'parentId': 12,
                'Name': 'Category 122',
                'GUID': '8f7q2dc-fed7-4acf-527fceb991865',
                'Email': 'hgoss6@ed.gov',
                'Gender': 'Male',
                'Address': '21 fake Park',
                'Phone Number': '31-(678)495-4134',
                'children': [
                  {
                    'id': 1221,
                    'parentId': 122,
                    'Name': 'Category 1211',
                    'GUID': '8f7q2dc-facf-527fceb991865',
                    'Email': 'hgossjdjdjdj6@ed.gov',
                    'Gender': 'Male',
                    'Address': '21 fdjdjake Park',
                    'Phone Number': '31-(678)495-4134'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        'id': 2,
        'parentId': -1,
        'Name': 'Category 2',
        'GUID': '8f7q2dc-facf-527fcebdk=-jdjd991865',
        'Email': 'hehehe@ed.gov',
        'Gender': 'Male',
        'Address': '212 Park',
        'Phone Number': '31-(678)495-4134',
        'children': [
          {
            'id': 21,
            'parentId': 2,
            'Name': 'Category 21',
            'GUID': '8f7q2dc-facf-527fcsw-jdjd991865',
            'Email': 'hehehe@ed.gov',
            'Gender': 'Male',
            'Address': '21112 Park',
            'Phone Number': '31-(678)495-4134',
            'leaf': false
          }
        ]
      }
    ]
  }
};

const LibraryFolderTree = (/* {
  tracks,
  sortBy,
  direction,
  handleSort,
  // estimateItemSize,
  t
}*/) => {
  const treeConfig = {
    store: window.store,
    stateKey: 'local-library-folder-tree',
    gridType: 'tree', // either `tree` or `grid`,
    showTreeRootNode: false, // dont display root node of tree
    plugins: {
      COLUMN_MANAGER: {
        resizable: true,
        moveable: true
        /* sortable: {
          enabled: true,
          method: 'local',
          sortingSource: pagingDataSource
        }*/
      },
      EDITOR: {
        type: 'inline',
        enabled: true
      },
      PAGER: {
        enabled: false
      },
      LOADER: {
        enabled: true
      },
      SELECTION_MODEL: {
        mode: 'single'
      },
      ERROR_HANDLER: {
        defaultErrorMessage: 'AN ERROR OCURRED',
        enabled: true
      },
      GRID_ACTIONS: null,
      BULK_ACTIONS: {
        enabled: false
      }
    },
    columns: [
      {
        name: 'Name',
        width: '30%',
        className: 'additional-class',
        dataIndex: 'Name',
        sortable: false,
        expandable: true
      },
      {
        name: 'Phone Number',
        dataIndex: 'Phone Number',
        sortable: false,
        className: 'additional-class'
      },
      {
        name: 'Email',
        dataIndex: 'Email',
        sortable: false,
        className: 'additional-class',
        defaultSortDirection: 'descend'
      },
      {
        name: 'Address',
        dataIndex: 'Address',
        sortable: false,
        className: 'additional-class'
      }
    ],
    data
  };
  return <Grid {...treeConfig} />;
};

LibraryFolderTree.propTypes = {
  tracks: PropTypes.array,
  sortBy: PropTypes.string,
  direction: PropTypes.string,
  handleSort: PropTypes.func
};

export default compose(
  withTranslation('library')
)(LibraryFolderTree);
