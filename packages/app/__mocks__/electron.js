module.exports = {
  app: {
    getPath: () => { }
  },
  remote: {
    transformSource: () => { },
    app: {
      getPath: () => { }
    },
    dialog: {
      showOpenDialog: jest.fn(async () => Promise.resolve({
        canceled: false,
        filePaths: ['test file.txt']
      })),
      showSaveDialog: jest.fn(async () => Promise.resolve({
        canceled: false,
        filePath: 'downloaded_playlist'
      }))
    }
  },
  shell: {
    openExternal: jest.fn(async (link) => Promise.resolve({
      link
    }))
  }
};
