# umi-plugin-local-iconfont

在打包umi项目的时候，将 iconfont.js 打包到本地使用。

## Install

```bash
# npm
$ npm install  umi-plugin-local-iconfont
```

## Usage

```js
export default defineConfig({
  plugins: ['umi-plugin-local-iconfont'],
  localIconfont: {
    fontPath: './iconfont',
    urls: [
      '//at.alicdn.com/t/c/font_foo.js',
      '//at.alicdn.com/t/c/font_bar.js',
    ],
  },
});
```

## Options

```js
{
  urls: []; // 图标列表,
  fontPath: ''; //js存放路径,默认为 ./iconfont
}
```

## LICENSE

MIT
