//@ts-nocheck
import axios, {AxiosResponse, AxiosError} from 'axios';
import {makeDecryption, makeEncryption} from './encryption';
import {withoutEncryptionApi} from '../api/withoutEncrytApi';

interface requestParams {
  url: string;
  data?: any;
  method?: string;
  baseURL?: string;
  isConsole?: boolean;
  mediaFile?: any;
  isParamsAndmediaFile?: boolean;
  isEncrypted?: boolean;
  isPostOrPutWithParams?: boolean;
  isBaseURLAndURLSame?: boolean;
  isConsoleParams?: boolean;
  referer?: string;
  access_token?: string | null;
}

// Encryption process
axios.interceptors.request.use(
  async config => {
    let url = config?.url;
    if (withoutEncryptionApi.some(element => url?.includes(element))) {
      return config;
    }
    let copyOfConfig = {...config};
    const apiPrefixes = url?.includes('?');
    if (apiPrefixes) {
      let splitUrl = url?.split('?');
      const encryptedData = await makeEncryption(splitUrl?.[1]);
      url = `${splitUrl?.[0]}?${encryptedData}`;
      copyOfConfig = {...config, url};
    }
    let payload = null;
    if (config?.data) {
      payload = await makeEncryption(JSON.stringify(config?.data));
    }

    copyOfConfig = {
      ...copyOfConfig,
      data: payload,
      headers: {
        ...copyOfConfig.headers,
        'Content-Type': 'application/json',
      },
    };

    return copyOfConfig;
  },
  async error => {
    // console.log('error', JSON.stringify(error, null, 2));
    let decryptedData = await makeDecryption(error?.response?.data);
    let newError = {response: {data: decryptedData || ''}};
    return Promise.reject(newError);
  },
);

axios.interceptors.response.use(
  async (response: AxiosResponse) => {
    if (
      withoutEncryptionApi.some(element =>
        response?.config?.url?.includes(element),
      )
    ) {
      return response;
    }
    let decryptedData = makeDecryption(response?.data);
    return {
      ...response,
      data: decryptedData,
    };
  },

  async (error: AxiosError) => {
    if (error?.response?.status === 401) {
      return Promise.reject({response: {data: 401}});
    } else if (error?.response?.status === 406) {
      return Promise.reject({response: {data: 406}});
    } else {
      let decryptedError = makeDecryption(error?.response?.data);
      let modifiedError = {response: {data: decryptedError || ''}};
      if (
        modifiedError?.response?.data?.message ===
        'No authenticationScheme was specified, and there was no DefaultChallengeScheme found. The default schemes can be set using either AddAuthentication(string defaultScheme) or AddAuthentication(Action<AuthenticationOptions> configureOptions).'
      ) {
      } else {
        return Promise.reject(modifiedError);
      }
    }
  },
);

export const httpRequest = async (params: requestParams, cb: any) => {
  const cofigParam = configuration(params);

  const defualt_baseURL = axios.defaults.baseURL;
  var config = {
    method: cofigParam?.method || 'get',
    baseURL: params?.isBaseURLAndURLSame
      ? params?.url
      : params?.baseURL || defualt_baseURL,
    headers: {
      ...axios.defaults.headers,
      Authorization: `Bearer ${params?.access_token}`,
      'Content-Type': params?.mediaFile
        ? 'multipart/form-data'
        : axios.defaults.headers['Content-Type'],
      ['Referer']: params?.referer || '',
    },
  };

  if (params?.data || params?.mediaFile) {
    if (cofigParam?.method?.toUpperCase() === 'GET') {
      const processedConfig = await apiParamsProcess(params, config);
      config = processedConfig;
    } else {
      let formData = new FormData();
      const file = {
        uri: params?.mediaFile?.uri,
        name: params?.mediaFile?.fileName || params?.mediaFile?.name,
        type: params?.mediaFile?.type,
      };
      formData?.append('profileImage', file);

      if (params?.mediaFile && params?.isParamsAndmediaFile) {
        config.url = cofigParam?.url;
        config.params = cofigParam?.data;
        config.data = params?.mediaFile ? formData : cofigParam?.data;
      } else if (params?.isPostOrPutWithParams) {
        const processedConfig = await apiParamsProcess(params, config);
        config = processedConfig;
      } else if (params?.mediaFile) {
        config.url = cofigParam?.url;
        config.data = params?.mediaFile ? formData : cofigParam?.data;
      } else {
        config.url = cofigParam?.url;
        config.data = cofigParam?.data;
        const encrypt = await makeEncryption(JSON.stringify(cofigParam?.data));
        params?.isEncrypted &&
          console.log(
            `Encypted_Payload for==> ${
              params?.isBaseURLAndURLSame
                ? params?.url
                : params?.baseURL || defualt_baseURL
            }${params?.url}==>`,
            encrypt,
          );
      }
    }
  } else {
    config = {
      url: params?.url,
      ...config,
    };
  }

  try {
    cb(true);
    params?.isConsoleParams &&
      console.log('api_params/payload ==>', JSON.stringify(config, null, 2));

    const response = await axios(config);

    cb(false);
    params?.isConsole &&
      console.log('api_response ==>', JSON.stringify(response?.data, null, 2));

    if (response?.data === 0 || response?.data) {
      return response?.data;
    } else {
      return response;
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      cb(false);
      params?.isConsole &&
        console.log('error_response ==>', JSON.stringify(error, null, 2));
      // params?.isConsole &&
      //   console.log(
      //     'error_response_data ==>',
      //     JSON.stringify(error?.data, null, 2),
      //   );
      return error?.response?.data;
    }
  }
};

const apiParamsProcess = async (params: any, config: any) => {
  let processedConfig = {};
  const cofigParam = configuration(params);
  let modifiedParam = '';
  for (const [key, value] of Object.entries(cofigParam?.data)) {
    modifiedParam += `${key}=${value}&`;
  }
  if (
    withoutEncryptionApi.some(element => cofigParam?.url?.includes(element))
  ) {
    processedConfig = {
      url: cofigParam?.url,
      params: cofigParam?.data,
      ...config,
    };
  } else {
    if (params?.isEncrypted) {
      const encrypt = await makeEncryption(`${modifiedParam?.slice(0, -1)}`);
      console.log(
        `Encypted_Params for==> ${
          params?.isBaseURLAndURLSame
            ? params?.url
            : params?.baseURL || axios.defaults.baseURL
        }${params?.url}?${encrypt}`,
      );
    }
    processedConfig = {
      url: `${cofigParam?.url}?${modifiedParam?.slice(0, -1)}`,
      ...config,
    };
  }
  return processedConfig;
};

const configuration = (param: any) => {
  if (param?.url && (param?.data || param?.mediaFile) && param?.method) {
    return {
      url: param?.url,
      data: param?.data,
      method: param?.method,
    };
  } else {
    return {
      url: param?.url,
      method: param?.method || 'get',
    };
  }
};
