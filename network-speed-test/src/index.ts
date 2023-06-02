enum CONSTANT {
  TIME = 10,
}

export default {
  getSpeedByImg(url: string, fileSize: number): Promise<number> {
    return new Promise((resolve) => {
      let speed: number;
      let endTime: number;
      const img = new Image();
      const startTime = Date.now();
      img.src = url;
      img.onload = () => {
        endTime = Date.now();
        speed = (fileSize / (endTime - startTime) / Math.pow(1024, 2)) * 1000;
        resolve(speed);
      };
    });
  },
  getSpeedByAjax(url: string): Promise<string> {
    let startTime: number;
    let endTime: number;
    let speed: number;
    let count: number = CONSTANT.TIME;
    return new Promise((resolve, reject) => {
      startTime = Date.now();
      for (let i = count; i > 0; i--) {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
          if (
            (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) ||
            xhr.status === 304
          ) {
            console.log(111);

            count--;
            if (count <= 0) {
              endTime = Date.now();
              let fileSize = xhr.getResponseHeader("Content-Length");
              if (fileSize) {
                speed =
                  ((parseInt(fileSize) * CONSTANT.TIME) /
                    (endTime - startTime) /
                    Math.pow(1024, 2)) *
                  1000;

                resolve(speed.toFixed(1));
              } else {
                reject(new Error("响应首部字段获取失败"));
              }
            }
          }
        };
        xhr.open("GET", url, true);
        xhr.send();
      }
    });
  },
};
