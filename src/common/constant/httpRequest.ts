//@ts-nocheck
import axios from 'axios';
import {makeEncryption} from './encryption';
import {withoutEncryptionApi} from '../api/withoutEncrytApi';

export const httpRequest = async (params: any, cb: any) => {
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
    console.log(response, 'response-----');
    cb(false);
    params?.isConsole &&
      console.log('api_response ==>', JSON.stringify(response?.data, null, 2));

    if (response?.data === 0 || response?.data) {
      return response?.data;
    } else {
      return response;
    }
  } catch (error) {
    console.log(error, 'error');
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
