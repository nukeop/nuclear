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
      }))
    }
  }
};
