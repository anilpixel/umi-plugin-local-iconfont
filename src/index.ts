import fs from 'fs';
import path from 'path';
import request from 'request';
import type { IApi } from 'umi';

const getFileName = (url: string): string | undefined => {
  const regex = /\/([^/]+\.js)$/;
  const match = url.match(regex);

  if (match) {
    return match[1];
  } else {
    console.log('无法匹配文件名');
  }
};

export default (api: IApi) => {
  // See https://umijs.org/docs/guides/plugins
  api.describe({
    key: 'localIconfont',
    config: {
      schema(Joi) {
        return Joi.object({
          fontPath: Joi.string().optional(),
          urls: Joi.array().items(Joi.string()).optional(),
          publicPath: Joi.string().optional(),
          async: Joi.boolean().default(true).optional(),
        });
      },
      default: {
        fontPath: './iconfont',
        urls: [],
      },
    },
  });

  const { paths } = api;
  const { absOutputPath } = paths;
  const {
    urls = [],
    fontPath = './iconfont',
    publicPath = '',
    async = true,
  } = api.userConfig.localIconfont;
  const absFontPath = path.join(absOutputPath, fontPath);

  const addScript = () => {
    if (process.env.NODE_ENV == 'development') {
      // 开发环境直接使用
      api.addHTMLHeadScripts(() =>
        urls.map((url: string) => ({ src: url, async })),
      );
    } else {
      api.addHTMLHeadScripts(() =>
        urls.map((url: string) => ({
          src: path.join(publicPath, fontPath, getFileName(url) || ''),
          async,
        })),
      );

      api.onBuildComplete(() => {
        // 打包的时候需要先下载js
        if (!fs.existsSync(absFontPath)) {
          fs.mkdirSync(absFontPath, { recursive: true });
        }

        urls.forEach((url: string) => {
          request('http:' + url).pipe(
            fs.createWriteStream(path.join(absFontPath, getFileName(url)!)),
          );
        });
      });
    }
  };

  addScript();
};
