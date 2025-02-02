module.exports = {
  app: {
    getPath: () => { }
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
