# Test-Network-Speed

✨ 一个轻量的前端测网速工具，利用图片探测、并行 Ajax 请求技术测量你的环境网络下载速度。

# Features

- 💪TypeScript

- 🎶 ES2015

- ✔ Promise

- 🎨 Ajax

# Install

`npm i test-network-speed`

# Usage

```js
import nst from "test-network-speed";
(async function () {
  const speedByImg = await nst.getSpeedByImg("./example.jpg", 734208);
  const speedByAjax = await nst.getSpeedByAjax("./example.jpg");
})();
```

- `getSpeedByImg`:

  利用图片探测技术测量网速。

  优势：完全不必担心跨域的限制，使用简单。

  劣势：资源必须是图片且需要预先知道图片大小，灵活性较差；测得网速误差较大

- `getSpeedByAjax`:

  利用 Ajax 并行发起多次网络请求，测得较为准确的网速。

  优势：不需要提前知道资源大小，类型随意，灵活性较好，测得网速值贴近真实值

  劣势：有跨域问题，且服务器配置 CORS 需要允许客户端自定义请求头 Cache-Control 字段

# Demo

同时，我还实现了一个小Demo，如果你想试试看，clone 项目到本地

```
npm install
npm run dev
```

# TODO

- [ ] 一个时间段内的实时测速
- [ ] 网速变化可视化图表
- [ ] 测量 ping 值

鉴于本人水平有限，这个工具有一些地方可以更加完善，欢迎各位大佬提出问题，一起讨论，共同进步😁