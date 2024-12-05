import { prettyPrint } from '@base2/pretty-print-object';

export default function logger(message: string) {
  console.log(`message logss: ${message}`);
}

export function loggerBeautifulObject(data: object) {
  console.log(prettyPrint(data, { indent: ' ', singleQuotes: false }));
}

export function prettyObject(data: {}) {
  return JSON.stringify(data, null, 2);
}
