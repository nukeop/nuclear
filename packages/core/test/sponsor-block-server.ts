export const MockServer = {
  request: (videoId) => {
    switch (videoId) {
    case VIDEO_ID.HAS_NO_SEGMENT:
      return [];

    case VIDEO_ID.HAS_SEGMENT:
      return [
        {
          'category': 'sponsor',
          'segment': [0.300312, 17.486291],
          'UUID': '8e4d2c8cfcd9d7647759a765a634777d1d20abca6758d0432556717a048ca8e2'
        }
      ];
    case VIDEO_ID.HAS_SEGMENT_NOT_ORDER:
      return [
        {
          'category': 'sponsor',
          'segment': [0.300312, 17.486291],
          'UUID': '8e4d2c8cfcd9d7647759a765a634777d1d20abca6758d0432556717a048ca8e2'
        },
        {
          'category': 'sponsor',
          'segment': [962.72917, 1022.340966],
          'UUID': 'e3d03b97947b2932e652edc366f83d2f8ca54682d240e31142717f54474cbea5'
        },
        {
          'category': 'selfpromo',
          'segment': [10.658109, 16.966255],
          'UUID': 'f06dc54e385d6a0ea986abfa6b94f1f0ecd794ea99450a1bd69ec820e2551979'
        },
        {
          'category': 'outro',
          'segment': [1025.782768, 1042.761723],
          'UUID': 'd3ae9c79bebf3b994e1999292c656d713ffccb5adf5c1da11e6e606ad15a5822'
        }
      ];

    case VIDEO_ID.HAS_SEGMENT_CONTAIN_OTHER_SEGMENT:
      return [
        {
          'category': 'sponsor',
          'segment': [0.300312, 17.486291],
          'UUID': '8e4d2c8cfcd9d7647759a765a634777d1d20abca6758d0432556717a048ca8e2'
        },
        {
          'category': 'sponsor',
          'segment': [962.72917, 1022.340966], 
          'UUID': 'e3d03b97947b2932e652edc366f83d2f8ca54682d240e31142717f54474cbea5'
        },
        {
          'category': 'selfpromo',
          'segment': [10.658109, 16.966255],
          'UUID': 'f06dc54e385d6a0ea986abfa6b94f1f0ecd794ea99450a1bd69ec820e2551979'
        },
        {
          'category': 'outro',
          'segment': [1025.782768, 1042.761723], 
          'UUID': 'd3ae9c79bebf3b994e1999292c656d713ffccb5adf5c1da11e6e606ad15a5822'
        }
      ];
    }
  }
};

export const VIDEO_ID = {
  HAS_NO_SEGMENT: 0,
  HAS_SEGMENT: 1,
  HAS_SEGMENT_NOT_ORDER: 2,
  HAS_SEGMENT_CONTAIN_OTHER_SEGMENT: 3
};
