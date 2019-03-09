import express from 'express';
const { ipcMain } = require('electron');

export function windowRouter() {

  const router = express.Router();

  router.post('/quit', (req, res) => {
    ipcMain.emit('close');
    res.send();
  });

  router.post('/maximize', (req, res) => {
    ipcMain.emit('maximize');
    res.send();
  });

  router.post('/minimize', (req, res) => {
    ipcMain.emit('minimize');
    res.send();
  });

  return router;
}

