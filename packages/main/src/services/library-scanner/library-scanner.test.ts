import {scanFolders} from '@nuclear/scanner';

describe('Local library scanner', () => {
  it('scans folders', async () => {
    const result = await scanFolders([''], ['mp3'], (progress, total, lastScanned) => {
      // console.log({progress, total, lastScanned});
    });
    expect(result).toBe({});
  });   
});
