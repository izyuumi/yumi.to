export {};

declare global {
  interface Shortlink {
    id: string;
    short: string;
    link: string;
    expire: Date | null;
  }
}
