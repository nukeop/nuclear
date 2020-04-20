/* eslint-disable no-console */
/* eslint-disable no-process-exit */
import sync  from 'i18next-json-sync';
import fs from 'fs';
import glob from 'glob';
import path from 'path';
import { promisify } from 'util';

import { getMissingKeys } from './helpers/object';
import { generateMdFile } from './helpers/md';

const PRIMARY_LANGUAGE = 'en';

(async () => {
  const localesPath = path.resolve(__dirname, '../src/locales/*.json');

  try {
    sync({
      check: false,
      files: localesPath,
      primary: PRIMARY_LANGUAGE,
      createResources: [],
      space: 2,
      lineEndings: 'LF',
      finalNewline: true,
      newKeysEmpty: false
    });

    const data: Record<string, Record<string, string[]>> = {};

    const enJson = await promisify(fs.readFile)(path.resolve(__dirname, `../src/locales/${PRIMARY_LANGUAGE}.json`), 'utf-8');
    const files = (await promisify(glob)(localesPath)).filter(filePath => !filePath.includes('en.json'));

    for (const filePath of files) {
      const fileContent = await promisify(fs.readFile)(filePath, 'utf-8');

      data[path.basename(filePath).split('.')[0]] = getMissingKeys(
        JSON.parse(fileContent),
        JSON.parse(enJson)
      );
    }

    generateMdFile(data)
      .on('error', () => {
        console.error('something fail while trying to generate i18n doc md file');
        process.exit(1);
      });
  } catch (err) {
    console.log('something fail during 18n sync');
    console.error(err);
  }
})();
