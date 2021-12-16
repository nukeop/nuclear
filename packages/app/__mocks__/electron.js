module.exports = {
  app: {
    getPath: () => { }
  },
  remote: {
    transformSource: jest.fn(),
    getCurrentWindow: jest.fn(() => 'currentWindow'),
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
  },
  clipboard: {
    writeText: jest.fn(async (text) => Promise.resolve({
      text
    }))
  }
};
