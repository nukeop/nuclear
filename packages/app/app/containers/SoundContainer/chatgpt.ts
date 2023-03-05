import { Configuration, OpenAIApi } from 'openai';

type QueueItem = {
    artist: string;
    title: string;
}

type RecommendedItem = {
    artist: string;
    title: string;
    description: string;
}

export class ChatGptRecommendations {
    private openai: OpenAIApi;
    constructor() {
      const configuration = new Configuration({
        apiKey: ''
      });
      this.openai = new OpenAIApi(configuration);
    }

    getSystemPrompt() {
      return `
        You are a music recommendation system. For a given queue of songs, you will select a song to be added to the queue next. You are free to select any song, so try recommending music that's related to the tracks in the queue but it doesn't have to be well known or a standard in its genre. You can choose tracks out of the box if there's something connecting them to the rest of the queue.

        The songs will be provided in JSON format, and you will output the song to be added in JSON with the following structure: {artist: string, title: string, description: string}. In the description field, you will say why this particular song was selected. Remember to output the recommended track in JSON. Do not output anything else.
        `;
    }

    async getRecommendation(currentQueue: QueueItem[]) {
      const completion = await this.openai.createChatCompletion({
        model: 'gpt-3.5-turbo-0301',
        messages: [
          {role: 'system', content: this.getSystemPrompt()},
          {role: 'user', content: JSON.stringify(currentQueue.map((item) => {
            return {artist: item.artist, title: item.title};
          }))}
        ]   
      });

      //   console.log(JSON.parse(completion.data.choices[0].message.content).description);

      return JSON.parse(completion.data.choices[0].message.content) as RecommendedItem;
    }
}
