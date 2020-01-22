/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';

const FILE_PATH = path.resolve(__dirname, '../../../../docs/i18n.md');

export const generateMdFile = (data: Record<string, Record<string, string[]>>) => {
  const stream = fs.createWriteStream(FILE_PATH, {
    encoding: 'utf-8'
  });

  stream.on('close', () => {
    console.log('i18n missing translation doc updated');
  });

  stream.write('# Missing translations\n', 'utf-8');

  Object.entries(data).forEach(([lang, namespaces]) => {
    stream.write(`\n## ${lang}\n`, 'utf-8');

    Object.entries(namespaces).forEach(([namespace, missingKeys]) => {
      stream.write(`\n### ${namespace}:\n\n`, 'utf-8');
      
      missingKeys.forEach(missingKey => {
        stream.write(` - ${missingKey}\n`, 'utf-8');
      });
    });
  });

  stream.write('\n', 'utf-8');
  stream.end();

  return stream;
};
