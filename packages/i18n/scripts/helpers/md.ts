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

  const now = new Date();
  const entries = Object.entries(data);
  
  if (entries.length) {
    stream.write('# Missing translations (generated file, don\'t update it)\n', 'utf-8');
    stream.write('\n## Navigation\n');
    entries.forEach(([lang]) => {
      stream.write(`- [${lang}](#${lang})\n`);
    });
  
    entries.forEach(([lang, namespaces]) => {
      stream.write(`\n## ${lang}\n`, 'utf-8');
  
      Object.entries(namespaces).forEach(([namespace, missingKeys]) => {
        stream.write(`\n### ${namespace}:\n`, 'utf-8');
        
        missingKeys.forEach(missingKey => {
          stream.write(` - ${missingKey}\n`, 'utf-8');
        });
      });
    });
  
    stream.write('\n', 'utf-8');
  } else {
    stream.write('\n## No missing translation !!! Well done folks\n');
  }

  stream.write(`\n\n\ngenerated the ${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`);

  stream.end();

  return stream;
};
