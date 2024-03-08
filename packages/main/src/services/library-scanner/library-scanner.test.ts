import {scanFolders} from '@nuclear/scanner';

// Enable when testing the local library scanner rust package
xdescribe('Local library scanner', () => {
  it('scans folders', async () => {
    // const result = await scanFolders([''], ['mp3'], (progress, total, lastScanned) => {
    //   // console.log({progress, total, lastScanned});
    // });
    const result = {};
    expect(result).toBe({});
  });   
});
