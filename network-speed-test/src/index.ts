enum CONSTANT {
  TIME = 6, // 并行发送请求数量
  BIAS = 1.225, // 网速值修正因子
}

export default {
  /*
   * @desc 利用图片探测技术测量网速。
   *       优势：完全不必担心跨域的限制，使用简单。
   *       劣势：资源必须是图片且需要预先知道图片大小，灵活性较差；测得网速误差较大
   * @param url {String} 传入图片url
   * @param fileSize {Number} 预先已知的图片大小,单位 B
   * @return {Promise<string>} 返回Promise对象,解决值为网速
   * @author jiabin 2023/06/002
   */
  getSpeedByImg(url: string, fileSize: number): Promise<string> {
    return new Promise((resolve) => {
      let speed: number;
      let endTime: number;
      new Image();
      // 创建 Image 实例
      const img = new Image();
      const startTime = Date.now();
      //给img.src赋值请求即开始
      img.src = url;
      // 图片加载完毕的回调
      img.onload = () => {
        endTime = Date.now();
        speed = (fileSize / (endTime - startTime) / Math.pow(1024, 2)) * 1000;
        resolve(speed.toFixed(1));
      };
    });
  },

  /*
   * @desc 利用Ajax并行发起多次网络请求，测得较为准确的网速。
   *       优势：不需要提前知道资源大小，类型随意，灵活性较好，测得网速值贴近真实值
   *       劣势：有跨域问题，且服务器配置CORS需要允许客户端自定义请求头Cache-Control字段
   * @param url {String} 传入请求资源的url
   * @return {Promise<string>} 返回Promise对象,解决值为网速
   * @author jiabin 2023/06/02
   */
  getSpeedByAjax(url: string): Promise<string> {
    let startTime: number;
    let endTime: number;
    let speed: number;
    let count: number = CONSTANT.TIME; //计数器，还需发送的请求数量
    return new Promise((resolve, reject) => {
      startTime = Date.now();
      // 并行发起多次请求，这些请求共用同一个TCP连接，大幅减小建立TCP连接的耗时对网速准确性的影响
      // 实践证明，由于建立TCP连接的耗时在单次请求总耗时中占比较大，多次请求所得网速远大于单次请求所得网速
      for (let i = count; i > 0; i--) {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
          try {
            if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) {
              count--;
              if (count <= 0) {
                endTime = Date.now();
                // 根据实际情况获得资源大小
                let fileSize = xhr.getResponseHeader("Content-Length");
                if (fileSize) {
                  speed =
                    ((parseInt(fileSize) * CONSTANT.TIME) /
                      (endTime - startTime) /
                      Math.pow(1024, 2)) *
                    1000 *
                    CONSTANT.BIAS;
                  resolve(speed.toFixed(1));
                } else {
                  reject("响应首部字段获取失败");
                }
              }
            } else if (xhr.readyState === 4 && xhr.status >= 300) {
              reject(`请求失败:${xhr.status}`);
            }
          } catch (error) {
            // 若xhr请求超时，readyState仍然变成4，但是访问status和statusText会发生错误，因此做好防护
          }
        };

        // 请求超时回调
        xhr.ontimeout = () => {
          reject("请求超时");
        };

        xhr.open("GET", url, true);
        // 设置请求最长等待时间
        xhr.timeout = 3000;
        // 不能从缓存里拿数据。
        // 因为使用了setRequestHeader自定义请求头，所以在不使用代理时服务端的CORS需要设置接受自定义Cache-Control字段
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.send();
      }
    });
  },
};
