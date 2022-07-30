import { NuclearSupabaseService } from './NuclearSupabaseService';

export enum ConfigFlag {
    PROMOTED_ARTISTS = 'PROMOTED_ARTISTS',
}

export enum ParamKey {
    PROMOTED_ARTIST_BACKGROUND = 'PROMOTED_ARTIST_BACKGROUND',
}

export type Configuration = {
    [key in ConfigFlag]: boolean;
}

export type Parameters = {
    [key in ParamKey]: string;
}

export type ConfigurationDbType = {
    key: ConfigFlag;
    value: boolean;
};
export type ParamDbType = {
    key: ConfigFlag;
    value: string;
};

export class NuclearConfigurationService extends NuclearSupabaseService {
  async getConfiguration() {
    const dbConfiguration = await this.client
      .from<ConfigurationDbType>('config')
      .select();

    return dbConfiguration?.data.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Configuration);
  }

  async getParams() {
    const dbParams = await this.client
      .from<ParamDbType>('params')
      .select();

    return dbParams?.data.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Parameters);
  }
}
