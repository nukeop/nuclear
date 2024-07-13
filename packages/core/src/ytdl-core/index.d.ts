declare module 'tough-cookie' {
  export const version: string;

  export const PrefixSecurityEnum: Readonly<{
      DISABLED: string;
      SILENT: string;
      STRICT: string;
  }>;
  
  /**
   * Parse a cookie date string into a Date.
   * Parses according to RFC6265 Section 5.1.1, not Date.parse().
   */
  export function parseDate(string: string): Date;
  
  /**
   * Format a Date into a RFC1123 string (the RFC6265-recommended format).
   */
  export function formatDate(date: Date): string;
  
  /**
   * Transforms a domain-name into a canonical domain-name.
   * The canonical domain-name is a trimmed, lowercased, stripped-of-leading-dot
   * and optionally punycode-encoded domain-name (Section 5.1.2 of RFC6265).
   * For the most part, this function is idempotent (can be run again on its output without ill effects).
   */
  export function canonicalDomain(str: string): string;
  
  /**
   * Answers "does this real domain match the domain in a cookie?".
   * The str is the "current" domain-name and the domStr is the "cookie" domain-name.
   * Matches according to RFC6265 Section 5.1.3, but it helps to think of it as a "suffix match".
   *
   * The canonicalize parameter will run the other two parameters through canonicalDomain or not.
   */
  export function domainMatch(str: string, domStr: string, canonicalize?: boolean): boolean;
  
  /**
   * Given a current request/response path, gives the Path apropriate for storing in a cookie.
   * This is basically the "directory" of a "file" in the path, but is specified by Section 5.1.4 of the RFC.
   *
   * The path parameter MUST be only the pathname part of a URI (i.e. excludes the hostname, query, fragment, etc.).
   * This is the .pathname property of node's uri.parse() output.
   */
  export function defaultPath(path: string): string;
  
  /**
   * Answers "does the request-path path-match a given cookie-path?" as per RFC6265 Section 5.1.4.
   * Returns a boolean.
   *
   * This is essentially a prefix-match where cookiePath is a prefix of reqPath.
   */
  export function pathMatch(reqPath: string, cookiePath: string): boolean;
  
  /**
   * alias for Cookie.parse(cookieString[, options])
   */
  export function parse(cookieString: string, options?: Cookie.ParseOptions): Cookie | undefined;
  
  /**
   * alias for Cookie.fromJSON(string)
   */
  export function fromJSON(string: string): Cookie;
  
  export function getPublicSuffix(hostname: string): string | null;
  
  export function cookieCompare(a: Cookie, b: Cookie): number;
  
  export function permuteDomain(domain: string, allowSpecialUseDomain?: boolean): string[];
  
  export function permutePath(path: string): string[];
  
  export class Cookie {
    static parse(cookieString: string, options?: Cookie.ParseOptions): Cookie | undefined;
  
    static fromJSON(strOrObj: string | object): Cookie | null;
  
    constructor(properties?: Cookie.Properties);
  
      key: string;
      value: string;
      expires: Date | 'Infinity';
      maxAge: number | 'Infinity' | '-Infinity';
      domain: string | null;
      path: string | null;
      secure: boolean;
      httpOnly: boolean;
      extensions: string[] | null;
      creation: Date | null;
      creationIndex: number;
  
      hostOnly: boolean | null;
      pathIsDefault: boolean | null;
      lastAccessed: Date | null;
      sameSite: string;
  
      toString(): string;
  
      cookieString(): string;
  
      setExpires(exp: Date | string): void;
  
      setMaxAge(number: number): void;
  
      expiryTime(now?: number): number;
  
      expiryDate(now?: number): Date;
  
      TTL(now?: Date): number | typeof Infinity;
  
      isPersistent(): boolean;
  
      canonicalizedDomain(): string | null;
  
      cdomain(): string | null;
  
      inspect(): string;
  
      toJSON(): { [key: string]: any };
  
      clone(): Cookie;
  
      validate(): boolean | string;
  }
  
  export namespace Cookie {
      interface ParseOptions {
          loose?: boolean | undefined;
      }
  
      interface Properties {
          key?: string | undefined;
          value?: string | undefined;
          expires?: Date | 'Infinity' | undefined;
          maxAge?: number | 'Infinity' | '-Infinity' | undefined;
          domain?: string | undefined;
          path?: string | undefined;
          secure?: boolean | undefined;
          httpOnly?: boolean | undefined;
          extensions?: string[] | undefined;
          creation?: Date | undefined;
          creationIndex?: number | undefined;
  
          hostOnly?: boolean | undefined;
          pathIsDefault?: boolean | undefined;
          lastAccessed?: Date | undefined;
          sameSite?: string | undefined;
      }
  
      interface Serialized {
          [key: string]: any;
      }
  }
  
  export class CookieJar {
    static deserialize(serialized: CookieJar.Serialized | string, store?: Store): Promise<CookieJar>;
    static deserialize(
          serialized: CookieJar.Serialized | string,
          store: Store,
          cb: (err: Error | null, object: CookieJar) => void,
      ): void;
    static deserialize(
          serialized: CookieJar.Serialized | string,
          cb: (err: Error | null, object: CookieJar) => void,
      ): void;
  
    static deserializeSync(serialized: CookieJar.Serialized | string, store?: Store): CookieJar;
  
    static fromJSON(string: string): CookieJar;
  
    constructor(store?: Store, options?: CookieJar.Options);
  
    setCookie(
          cookieOrString: Cookie | string,
          currentUrl: string,
          options?: CookieJar.SetCookieOptions,
      ): Promise<Cookie>;
    setCookie(
          cookieOrString: Cookie | string,
          currentUrl: string,
          options: CookieJar.SetCookieOptions,
          cb: (err: Error | null, cookie: Cookie) => void,
      ): void;
    setCookie(
          cookieOrString: Cookie | string,
          currentUrl: string,
          cb: (err: Error | null, cookie: Cookie) => void,
      ): void;
  
    setCookieSync(cookieOrString: Cookie | string, currentUrl: string, options?: CookieJar.SetCookieOptions): Cookie;
  
    getCookies(currentUrl: string, options?: CookieJar.GetCookiesOptions): Promise<Cookie[]>;
    getCookies(
          currentUrl: string,
          options: CookieJar.GetCookiesOptions,
          cb: (err: Error | null, cookies: Cookie[]) => void,
      ): void;
    getCookies(currentUrl: string, cb: (err: Error | null, cookies: Cookie[]) => void): void;
  
    getCookiesSync(currentUrl: string, options?: CookieJar.GetCookiesOptions): Cookie[];
  
    getCookieString(currentUrl: string, options?: CookieJar.GetCookiesOptions): Promise<string>;
    getCookieString(
          currentUrl: string,
          options: CookieJar.GetCookiesOptions,
          cb: (err: Error | null, cookies: string) => void,
      ): void;
    getCookieString(currentUrl: string, cb: (err: Error | null, cookies: string) => void): void;
  
    getCookieStringSync(currentUrl: string, options?: CookieJar.GetCookiesOptions): string;
  
    getSetCookieStrings(currentUrl: string, options?: CookieJar.GetCookiesOptions): Promise<string[]>;
    getSetCookieStrings(
          currentUrl: string,
          options: CookieJar.GetCookiesOptions,
          cb: (err: Error | null, cookies: string[]) => void,
      ): void;
    getSetCookieStrings(currentUrl: string, cb: (err: Error | null, cookies: string[]) => void): void;
  
    getSetCookieStringsSync(currentUrl: string, options?: CookieJar.GetCookiesOptions): string[];
  
    serialize(): Promise<CookieJar.Serialized>;
    serialize(cb: (err: Error | null, serializedObject: CookieJar.Serialized) => void): void;
  
    serializeSync(): CookieJar.Serialized;
  
    toJSON(): CookieJar.Serialized;
  
    clone(store?: Store): Promise<CookieJar>;
    clone(store: Store, cb: (err: Error | null, newJar: CookieJar) => void): void;
    clone(cb: (err: Error | null, newJar: CookieJar) => void): void;
  
    cloneSync(store?: Store): CookieJar;
  
    removeAllCookies(): Promise<void>;
    removeAllCookies(cb: (err: Error | null) => void): void;
  
    removeAllCookiesSync(): void;
  }
  
  export namespace CookieJar {
      interface Options {
          allowSpecialUseDomain?: boolean | undefined;
          looseMode?: boolean | undefined;
          rejectPublicSuffixes?: boolean | undefined;
          prefixSecurity?: string | undefined;
      }
  
      interface SetCookieOptions {
          http?: boolean | undefined;
          secure?: boolean | undefined;
          now?: Date | undefined;
          ignoreError?: boolean | undefined;
      }
  
      interface GetCookiesOptions {
          http?: boolean | undefined;
          secure?: boolean | undefined;
          now?: Date | undefined;
          expire?: boolean | undefined;
          allPaths?: boolean | undefined;
      }
  
      interface Serialized {
          version: string;
          storeType: string;
          rejectPublicSuffixes: boolean;
          cookies: Cookie.Serialized[];
      }
  }
  
  export abstract class Store {
      synchronous: boolean;
  
      findCookie(domain: string, path: string, key: string, cb: (err: Error | null, cookie: Cookie | null) => void): void;
  
      findCookies(
          domain: string,
          path: string,
          allowSpecialUseDomain: boolean,
          cb: (err: Error | null, cookie: Cookie[]) => void,
      ): void;
  
      putCookie(cookie: Cookie, cb: (err: Error | null) => void): void;
  
      updateCookie(oldCookie: Cookie, newCookie: Cookie, cb: (err: Error | null) => void): void;
  
      removeCookie(domain: string, path: string, key: string, cb: (err: Error | null) => void): void;
  
      removeCookies(domain: string, path: string, cb: (err: Error | null) => void): void;
  
      getAllCookies(cb: (err: Error | null, cookie: Cookie[]) => void): void;
  }
  
  export class MemoryCookieStore extends Store {
    findCookie(domain: string, path: string, key: string, cb: (err: Error | null, cookie: Cookie | null) => void): void;
    findCookie(domain: string, path: string, key: string): Promise<Cookie | null>;
  
    findCookies(
          domain: string,
          path: string,
          allowSpecialUseDomain: boolean,
          cb: (err: Error | null, cookie: Cookie[]) => void,
      ): void;
    findCookies(domain: string, path: string, cb: (err: Error | null, cookie: Cookie[]) => void): void;
    findCookies(domain: string, path: string, allowSpecialUseDomain?: boolean): Promise<Cookie[]>;
  
    putCookie(cookie: Cookie, cb: (err: Error | null) => void): void;
    putCookie(cookie: Cookie): Promise<void>;
  
    updateCookie(oldCookie: Cookie, newCookie: Cookie, cb: (err: Error | null) => void): void;
    updateCookie(oldCookie: Cookie, newCookie: Cookie): Promise<void>;
  
    removeCookie(domain: string, path: string, key: string, cb: (err: Error | null) => void): void;
    removeCookie(domain: string, path: string, key: string): Promise<void>;
  
    removeCookies(domain: string, path: string, cb: (err: Error | null) => void): void;
    removeCookies(domain: string, path: string): Promise<void>;
  
    getAllCookies(cb: (err: Error | null, cookie: Cookie[]) => void): void;
    getAllCookies(): Promise<Cookie[]>;
  }
}

import { Dispatcher, ProxyAgent, request } from 'undici';
import { Cookie as CK, CookieJar } from 'tough-cookie';
import { CookieAgent } from 'http-cookie-agent/undici';
import { Readable } from 'stream';

  namespace ytdl {
    type Filter = 'audioandvideo' | 'videoandaudio' | 'video' | 'videoonly' | 'audio' | 'audioonly' | ((format: videoFormat) => boolean);

    interface Agent {
      dispatcher: Dispatcher;
      jar: CookieJar;
      localAddress?: string;
    }

    interface getInfoOptions {
      lang?: string;
      requestCallback?: () => {};
      requestOptions?: Parameters<typeof request>[1];
      agent?: Agent;
    }

    interface chooseFormatOptions {
      quality?: 'lowest' | 'highest' | 'highestaudio' | 'lowestaudio' | 'highestvideo' | 'lowestvideo' | string | number | string[] | number[];
      filter?: Filter;
      format?: videoFormat;
    }

    interface downloadOptions extends getInfoOptions, chooseFormatOptions {
      range?: {
        start?: number;
        end?: number;
      };
      begin?: string | number | Date;
      liveBuffer?: number;
      highWaterMark?: number;
      IPv6Block?: string;
      dlChunkSize?: number;
    }

    interface videoFormat {
      itag: number;
      url: string;
      mimeType?: string;
      bitrate?: number;
      audioBitrate?: number;
      width?: number;
      height?: number;
      initRange?: { start: string; end: string };
      indexRange?: { start: string; end: string };
      lastModified: string;
      contentLength: string;
      quality: 'tiny' | 'small' | 'medium' | 'large' | 'hd720' | 'hd1080' | 'hd1440' | 'hd2160' | 'highres' | string;
      qualityLabel: '144p' | '144p 15fps' | '144p60 HDR' | '240p' | '240p60 HDR' | '270p' | '360p' | '360p60 HDR'
        | '480p' | '480p60 HDR' | '720p' | '720p60' | '720p60 HDR' | '1080p' | '1080p60' | '1080p60 HDR' | '1440p'
        | '1440p60' | '1440p60 HDR' | '2160p' | '2160p60' | '2160p60 HDR' | '4320p' | '4320p60';
      projectionType?: 'RECTANGULAR';
      fps?: number;
      averageBitrate?: number;
      audioQuality?: 'AUDIO_QUALITY_LOW' | 'AUDIO_QUALITY_MEDIUM';
      colorInfo?: {
        primaries: string;
        transferCharacteristics: string;
        matrixCoefficients: string;
      };
      highReplication?: boolean;
      approxDurationMs?: string;
      targetDurationSec?: number;
      maxDvrDurationSec?: number;
      audioSampleRate?: string;
      audioChannels?: number;

      // Added by ytdl-core
      container: 'flv' | '3gp' | 'mp4' | 'webm' | 'ts';
      hasVideo: boolean;
      hasAudio: boolean;
      codecs: string;
      videoCodec?: string;
      audioCodec?: string;

      isLive: boolean;
      isHLS: boolean;
      isDashMPD: boolean;
    }

    interface thumbnail {
      url: string;
      width: number;
      height: number;
    }

    interface captionTrack {
      baseUrl: string;
      name: {
        simpleText: 'Afrikaans' | 'Albanian' | 'Amharic' | 'Arabic' | 'Armenian' | 'Azerbaijani' | 'Bangla' | 'Basque'
        | 'Belarusian' | 'Bosnian' | 'Bulgarian' | 'Burmese' | 'Catalan' | 'Cebuano' | 'Chinese (Simplified)'
        | 'Chinese (Traditional)' | 'Corsican' | 'Croatian' | 'Czech' | 'Danish' | 'Dutch' | 'English'
        | 'English (auto-generated)' | 'Esperanto' | 'Estonian' | 'Filipino' | 'Finnish' | 'French' | 'Galician'
        | 'Georgian' | 'German' | 'Greek' | 'Gujarati' | 'Haitian Creole' | 'Hausa' | 'Hawaiian' | 'Hebrew' | 'Hindi'
        | 'Hmong' | 'Hungarian' | 'Icelandic' | 'Igbo' | 'Indonesian' | 'Irish' | 'Italian' | 'Japanese' | 'Javanese'
        | 'Kannada' | 'Kazakh' | 'Khmer' | 'Korean' | 'Kurdish' | 'Kyrgyz' | 'Lao' | 'Latin' | 'Latvian' | 'Lithuanian'
        | 'Luxembourgish' | 'Macedonian' | 'Malagasy' | 'Malay' | 'Malayalam' | 'Maltese' | 'Maori' | 'Marathi'
        | 'Mongolian' | 'Nepali' | 'Norwegian' | 'Nyanja' | 'Pashto' | 'Persian' | 'Polish' | 'Portuguese' | 'Punjabi'
        | 'Romanian' | 'Russian' | 'Samoan' | 'Scottish Gaelic' | 'Serbian' | 'Shona' | 'Sindhi' | 'Sinhala' | 'Slovak'
        | 'Slovenian' | 'Somali' | 'Southern Sotho' | 'Spanish' | 'Spanish (Spain)' | 'Sundanese' | 'Swahili'
        | 'Swedish' | 'Tajik' | 'Tamil' | 'Telugu' | 'Thai' | 'Turkish' | 'Ukrainian' | 'Urdu' | 'Uzbek' | 'Vietnamese'
        | 'Welsh' | 'Western Frisian' | 'Xhosa' | 'Yiddish' | 'Yoruba' | 'Zulu' | string;
      };
      vssId: string;
      languageCode: 'af' | 'sq' | 'am' | 'ar' | 'hy' | 'az' | 'bn' | 'eu' | 'be' | 'bs' | 'bg' | 'my' | 'ca' | 'ceb'
      | 'zh-Hans' | 'zh-Hant' | 'co' | 'hr' | 'cs' | 'da' | 'nl' | 'en' | 'eo' | 'et' | 'fil' | 'fi' | 'fr' | 'gl'
      | 'ka' | 'de' | 'el' | 'gu' | 'ht' | 'ha' | 'haw' | 'iw' | 'hi' | 'hmn' | 'hu' | 'is' | 'ig' | 'id' | 'ga' | 'it'
      | 'ja' | 'jv' | 'kn' | 'kk' | 'km' | 'ko' | 'ku' | 'ky' | 'lo' | 'la' | 'lv' | 'lt' | 'lb' | 'mk' | 'mg' | 'ms'
      | 'ml' | 'mt' | 'mi' | 'mr' | 'mn' | 'ne' | 'no' | 'ny' | 'ps' | 'fa' | 'pl' | 'pt' | 'pa' | 'ro' | 'ru' | 'sm'
      | 'gd' | 'sr' | 'sn' | 'sd' | 'si' | 'sk' | 'sl' | 'so' | 'st' | 'es' | 'su' | 'sw' | 'sv' | 'tg' | 'ta' | 'te'
      | 'th' | 'tr' | 'uk' | 'ur' | 'uz' | 'vi' | 'cy' | 'fy' | 'xh' | 'yi' | 'yo' | 'zu' | string;
      kind: string;
      rtl?: boolean;
      isTranslatable: boolean;
    }

    interface audioTrack {
      captionTrackIndices: number[];
    }

    interface translationLanguage {
      languageCode: captionTrack['languageCode'];
      languageName: captionTrack['name'];
    }

    interface VideoDetails {
      videoId: string;
      title: string;
      shortDescription: string;
      lengthSeconds: string;
      keywords?: string[];
      channelId: string;
      isOwnerViewing: boolean;
      isCrawlable: boolean;
      thumbnails: thumbnail[];
      averageRating: number;
      allowRatings: boolean;
      viewCount: string;
      author: string;
      isPrivate: boolean;
      isUnpluggedCorpus: boolean;
      isLiveContent: boolean;
      isLive: boolean;
    }

    interface Media {
      category: string;
      category_url: string;
      game?: string;
      game_url?: string;
      year?: number;
      song?: string;
      artist?: string;
      artist_url?: string;
      writers?: string;
      licensed_by?: string;
      thumbnails: thumbnail[];
    }

    interface Author {
      id: string;
      name: string;
      avatar: string; // to remove later
      thumbnails?: thumbnail[];
      verified: boolean;
      user?: string;
      channel_url: string;
      external_channel_url?: string;
      user_url?: string;
      subscriber_count?: number;
    }

    interface MicroformatRenderer {
      thumbnail: {
        thumbnails: thumbnail[];
      };
      embed: {
        iframeUrl: string;
        flashUrl: string;
        width: number;
        height: number;
        flashSecureUrl: string;
      };
      title: {
        simpleText: string;
      };
      description: {
        simpleText: string;
      };
      lengthSeconds: string;
      ownerProfileUrl: string;
      ownerGplusProfileUrl?: string;
      externalChannelId: string;
      isFamilySafe: boolean;
      availableCountries: string[];
      isUnlisted: boolean;
      hasYpcMetadata: boolean;
      viewCount: string;
      category: string;
      publishDate: string;
      ownerChannelName: string;
      liveBroadcastDetails?: {
        isLiveNow: boolean;
        startTimestamp: string;
        endTimestamp?: string;
      };
      uploadDate: string;
    }

    interface storyboard {
      templateUrl: string;
      thumbnailWidth: number;
      thumbnailHeight: number;
      thumbnailCount: number;
      interval: number;
      columns: number;
      rows: number;
      storyboardCount: number;
    }

    interface Chapter {
      title: string;
      start_time: number;
    }

    interface MoreVideoDetails extends Omit<VideoDetails, 'author' | 'thumbnail' | 'shortDescription'>, Omit<MicroformatRenderer, 'title' | 'description'> {
      published: number;
      video_url: string;
      age_restricted: boolean;
      likes: number | null;
      media: Media;
      author: Author;
      thumbnails: thumbnail[];
      storyboards: storyboard[];
      chapters: Chapter[];
      description: string | null;
    }

    interface videoInfo {
      iv_load_policy?: string;
      iv_allow_in_place_switch?: string;
      iv_endscreen_url?: string;
      iv_invideo_url?: string;
      iv3_module?: string;
      rmktEnabled?: string;
      uid?: string;
      vid?: string;
      focEnabled?: string;
      baseUrl?: string;
      storyboard_spec?: string;
      serialized_ad_ux_config?: string;
      player_error_log_fraction?: string;
      sffb?: string;
      ldpj?: string;
      videostats_playback_base_url?: string;
      innertube_context_client_version?: string;
      t?: string;
      fade_in_start_milliseconds: string;
      timestamp: string;
      ad3_module: string;
      relative_loudness: string;
      allow_below_the_player_companion: string;
      eventid: string;
      token: string;
      atc: string;
      cr: string;
      apply_fade_on_midrolls: string;
      cl: string;
      fexp: string[];
      apiary_host: string;
      fade_in_duration_milliseconds: string;
      fflags: string;
      ssl: string;
      pltype: string;
      enabled_engage_types: string;
      hl: string;
      is_listed: string;
      gut_tag: string;
      apiary_host_firstparty: string;
      enablecsi: string;
      csn: string;
      status: string;
      afv_ad_tag: string;
      idpj: string;
      sfw_player_response: string;
      account_playback_token: string;
      encoded_ad_safety_reason: string;
      tag_for_children_directed: string;
      no_get_video_log: string;
      ppv_remarketing_url: string;
      fmt_list: string[][];
      ad_slots: string;
      fade_out_duration_milliseconds: string;
      instream_long: string;
      allow_html5_ads: string;
      core_dbp: string;
      ad_device: string;
      itct: string;
      root_ve_type: string;
      excluded_ads: string;
      aftv: string;
      loeid: string;
      cver: string;
      shortform: string;
      dclk: string;
      csi_page_type: string;
      ismb: string;
      gpt_migration: string;
      loudness: string;
      ad_tag: string;
      of: string;
      probe_url: string;
      vm: string;
      afv_ad_tag_restricted_to_instream: string;
      gapi_hint_params: string;
      cid: string;
      c: string;
      oid: string;
      ptchn: string;
      as_launched_in_country: string;
      avg_rating: string;
      fade_out_start_milliseconds: string;
      midroll_prefetch_size: string;
      allow_ratings: string;
      thumbnail_url: string;
      iurlsd: string;
      iurlmq: string;
      iurlhq: string;
      iurlmaxres: string;
      ad_preroll: string;
      tmi: string;
      trueview: string;
      host_language: string;
      innertube_api_key: string;
      show_content_thumbnail: string;
      afv_instream_max: string;
      innertube_api_version: string;
      mpvid: string;
      allow_embed: string;
      ucid: string;
      plid: string;
      midroll_freqcap: string;
      ad_logging_flag: string;
      ptk: string;
      vmap: string;
      watermark: string[];
      dbp: string;
      ad_flags: string;
      html5player: string;
      formats: videoFormat[];
      related_videos: relatedVideo[];
      no_embed_allowed?: boolean;
      player_response: {
        playabilityStatus: {
          status: string;
          playableInEmbed: boolean;
          miniplayer: {
            miniplayerRenderer: {
              playbackMode: string;
            };
          };
          contextParams: string;
        };
        streamingData: {
          expiresInSeconds: string;
          formats: {}[];
          adaptiveFormats: {}[];
        };
        captions?: {
          playerCaptionsRenderer: {
            baseUrl: string;
            visibility: string;
          };
          playerCaptionsTracklistRenderer: {
            captionTracks: captionTrack[];
            audioTracks: audioTrack[];
            translationLanguages: translationLanguage[];
            defaultAudioTrackIndex: number;
          };
        };
        microformat: {
          playerMicroformatRenderer: MicroformatRenderer;
        };
        videoDetails: VideoDetails;
        playerConfig: {
          audioConfig: {
            loudnessDb: number;
            perceptualLoudnessDb: number;
            enablePerFormatLoudness: boolean;
          };
          streamSelectionConfig: { maxBitrate: string };
          mediaCommonConfig: { dynamicReadaheadConfig: {}[] };
          webPlayerConfig: { webPlayerActionsPorting: {}[] };
        };
      };
      videoDetails: MoreVideoDetails;
    }

    interface relatedVideo {
      id?: string;
      title?: string;
      published?: string;
      author: Author | 'string'; // to remove the `string` part later
      ucid?: string; // to remove later
      author_thumbnail?: string; // to remove later
      short_view_count_text?: string;
      view_count?: string;
      length_seconds?: number;
      video_thumbnail?: string; // to remove later
      thumbnails: thumbnail[];
      richThumbnails: thumbnail[];
      isLive: boolean;
    }

    interface Cookie {
      name: string;
      value: string;
      expirationDate?: number;
      domain?: string;
      path?: string;
      secure?: boolean;
      httpOnly?: boolean;
      hostOnly?: boolean;
      sameSite?: string;
    }

    function getBasicInfo(url: string, options?: getInfoOptions): Promise<videoInfo>;
    function getInfo(url: string, options?: getInfoOptions): Promise<videoInfo>;
    function downloadFromInfo(info: videoInfo, options?: downloadOptions): Readable;
    function chooseFormat(format: videoFormat | videoFormat[], options?: chooseFormatOptions): videoFormat | never;
    function filterFormats(formats: videoFormat | videoFormat[], filter?: Filter): videoFormat[];
    function validateID(string: string): boolean;
    function validateURL(string: string): boolean;
    function getURLVideoID(string: string): string | never;
    function getVideoID(string: string): string | never;
    function createProxyAgent(options: ProxyAgent.Options | string): Agent;
    function createProxyAgent(options: ProxyAgent.Options | string, cookies?: (Cookie | CK)[]): Agent;
    function createAgent(): Agent;
    function createAgent(cookies?: (Cookie | CK)[]): Agent;
    function createAgent(cookies?: (Cookie | CK)[], opts?: CookieAgent.Options): Agent;
    const version: number;
  }

  function ytdl(link: string, options?: ytdl.downloadOptions): Readable;

  export = ytdl;
