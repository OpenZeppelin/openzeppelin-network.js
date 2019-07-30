export default function sleep(ms: number): Promise<number> {
  return new Promise((resolve): number => setTimeout(resolve, ms));
}
