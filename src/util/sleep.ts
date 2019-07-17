export default function sleep(ms): Promise<NodeJS.Timeout> {
  return new Promise((resolve): NodeJS.Timeout => setTimeout(resolve, ms));
}
