const CHARACTERS_PER_LINE = 48;
const LINES_PER_PAGE = 2;

const wrapWords = (text: string) =>
  text
    .split(/\s+/)
    .filter(Boolean)
    .reduce<string[]>((lines, word) => {
      const currentLine = lines.at(-1);
      const fitsOnCurrentLine =
        currentLine !== undefined &&
        currentLine.length + 1 + word.length <= CHARACTERS_PER_LINE;

      if (fitsOnCurrentLine) {
        return [...lines.slice(0, -1), `${currentLine} ${word}`];
      }
      return [...lines, word];
    }, []);

const fitsOnPage = (text: string) => wrapWords(text).length <= LINES_PER_PAGE;

const chunk = <Item>(items: Item[], size: number) =>
  Array.from({ length: Math.ceil(items.length / size) }, (_, chunkIndex) =>
    items.slice(chunkIndex * size, (chunkIndex + 1) * size),
  );

const paginateSentence = (sentence: string) =>
  chunk(wrapWords(sentence), LINES_PER_PAGE).map((lines) => lines.join(' '));

const splitSentences = (text: string) =>
  text.split(/(?<=[.!?])\s+/).filter(Boolean);

export const paginate = (text: string) =>
  splitSentences(text).reduce<string[]>((pages, sentence) => {
    const lastPage = pages.at(-1);
    if (lastPage === undefined) {
      return paginateSentence(sentence);
    }

    const merged = `${lastPage} ${sentence}`;
    if (fitsOnPage(merged)) {
      return [...pages.slice(0, -1), merged];
    }
    return [...pages, ...paginateSentence(sentence)];
  }, []);
