declare module "test-network-speed" {
  export function getSpeedByAjax(url: string): Promise<string>;
  export function getSpeedByImg(url: string, fileSize: number): Promise<string>;
}
