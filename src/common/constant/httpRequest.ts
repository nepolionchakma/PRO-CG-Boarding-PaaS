// httpRequest.ts
import axios, {
  AxiosResponse,
  AxiosRequestConfig,
  AxiosHeaders,
  AxiosError,
} from 'axios';
import {makeEncryption, makeDecryption} from './encryption';
import {withoutEncryptionApi} from '../api/withoutEncrytApi';

interface RequestParams {
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

type LoadingCallback = (state: boolean) => void;

// ===============================================================
// 🧱 AXIOS INSTANCE
// ===============================================================
const axiosInstance = axios.create({
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ===============================================================
// 🔐 REQUEST INTERCEPTOR
// ===============================================================
axiosInstance.interceptors.request.use(
  async config => {
    let url = config?.url;
    if (!url) {
      return config;
    }

    // Skip encryption for specific endpoints
    if (withoutEncryptionApi.some(endpoint => url.includes(endpoint))) {
      return config;
    }

    let copyOfConfig = {...config};

    // 🔒 Encrypt query parameters if exist
    if (url.includes('?')) {
      const [base, query] = url.split('?');
      const encryptedQuery = await makeEncryption(query);
      if (encryptedQuery) {
        copyOfConfig.url = `${base}?${encryptedQuery}`;
      }
    }

    // 🔒 Encrypt payload (body)
    if (config.data) {
      const encryptedPayload = await makeEncryption(
        JSON.stringify(config.data),
      );
      if (encryptedPayload) {
        copyOfConfig.data = encryptedPayload;
        const headers =
          config.headers instanceof AxiosHeaders
            ? config.headers
            : AxiosHeaders.from(config.headers || {});
        headers.set('Content-Type', 'application/json');
        copyOfConfig.headers = headers;
      }
    }

    return copyOfConfig;
  },
  error => Promise.reject(error),
);

// ===============================================================
// 🧩 RESPONSE INTERCEPTOR
// ===============================================================
axiosInstance.interceptors.response.use(
  async response => {
    const url = response?.config?.url || '';
    if (withoutEncryptionApi.some(endpoint => url.includes(endpoint))) {
      return response;
    }

    try {
      const decrypted = makeDecryption(response?.data);
      if (decrypted) {
        return {...response, data: decrypted};
      }
      return response;
    } catch (error) {
      console.error('Decryption error:', error);
      return response;
    }
  },
  error => Promise.reject(error),
);

// ===============================================================
// 🚀 UNIVERSAL HTTP REQUEST FUNCTION
// ===============================================================
export const httpRequest = async (
  params: RequestParams,
  cb?: LoadingCallback,
) => {
  const configParams = configuration(params);
  const defaultBaseURL = axiosInstance.defaults.baseURL || '';

  let config: AxiosRequestConfig = {
    method: configParams.method || 'GET',
    baseURL: params.isBaseURLAndURLSame
      ? params.url
      : params.baseURL || defaultBaseURL,
    headers: {
      Authorization: params.access_token ? `Bearer ${params.access_token}` : '',
      'Content-Type': params.mediaFile
        ? 'multipart/form-data'
        : 'application/json',
      Referer: params.referer || '',
    },
  };

  // =========================================================
  // 🧩 Handle Data or Media File
  // =========================================================
  if (params.data || params.mediaFile) {
    const method = (configParams.method || 'GET').toUpperCase();

    if (method === 'GET') {
      config = await apiParamsProcess(params, config);
    } else {
      let formData = new FormData();

      if (params.mediaFile) {
        const file = {
          uri: params.mediaFile?.uri,
          name: params.mediaFile?.fileName || params.mediaFile?.name,
          type: params.mediaFile?.type,
        };
        formData.append('file', file);
      }

      if (params.mediaFile && params.isParamsAndmediaFile) {
        config.url = configParams.url;
        config.params = configParams.data;
        config.data = formData;
      } else if (params.isPostOrPutWithParams) {
        config = await apiParamsProcess(params, config);
      } else if (params.mediaFile) {
        config.url = configParams.url;
        config.data = formData;
      } else {
        config.url = configParams.url;
        config.data = configParams.data;
      }
    }
  } else {
    config.url = params.url;
  }

  // =========================================================
  // 📡 API Execution
  // =========================================================
  try {
    cb?.(true);
    if (params.isConsoleParams) {
      console.log('🔍 API Config =>', JSON.stringify(config, null, 2));
    }

    const response: AxiosResponse = await axiosInstance(config);

    cb?.(false);
    if (params.isConsole) {
      console.log('✅ API Response =>', JSON.stringify(response.data, null, 2));
    }

    return {
      status: response.status,
      success: response.status >= 200 && response.status < 300,
      data: response.data,
    };
  } catch (error: any) {
    cb?.(false);
    const err = error as AxiosError;

    if (params.isConsole) {
      console.error(
        '❌ API Error =>',
        JSON.stringify(err.response?.data, null, 2),
      );
    }

    return {
      status: err.response?.status || 500,
      success: false,
      data: err.response?.data || err.message,
    };
  }
};

// ===============================================================
// 🧮 Helper: Handle GET Params
// ===============================================================
const apiParamsProcess = async (params: any, config: any) => {
  const configParams = configuration(params);
  const queryString = new URLSearchParams(configParams.data).toString();
  let processedConfig = {};

  if (
    withoutEncryptionApi.some(endpoint => configParams.url.includes(endpoint))
  ) {
    processedConfig = {
      url: configParams.url,
      params: configParams.data,
      ...config,
    };
  } else {
    if (params.isEncrypted) {
      const encrypted = await makeEncryption(queryString);
      console.log(`🔐 Encrypted Params for ${configParams.url}?${encrypted}`);
      processedConfig = {
        url: `${configParams.url}?${encrypted}`,
        ...config,
      };
    } else {
      processedConfig = {
        url: `${configParams.url}?${queryString}`,
        ...config,
      };
    }
  }

  return processedConfig;
};

// ===============================================================
// ⚙️ Helper: Configuration
// ===============================================================
const configuration = (param: any) => {
  if (param.url && (param.data || param.mediaFile) && param.method) {
    return {
      url: param.url,
      data: param.data,
      method: param.method,
    };
  } else {
    return {
      url: param.url,
      method: param.method || 'GET',
    };
  }
};
