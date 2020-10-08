import fs from "fs-extra";
import { ParseOptions, parseUrl, stringifyUrl } from "query-string";

import resolveAsync from "../../../utils/resolve-async";

/** File resolved by URL resolver */
export interface UrlFile {
  /** Absolute path to file */
  from: string;
  /** File source */
  source: Uint8Array;
  /** Original query extracted from the input path */
  urlQuery?: string;
}

/** URL resolver */
export type UrlResolve = (inputUrl: string, basedir: string) => Promise<UrlFile>;

const resolve: UrlResolve = async (inputUrl, basedir) => {
  const options = { basedir };
  let from: string;
  const parseOptions: ParseOptions = { parseFragmentIdentifier: true, sort: false, decode: false };
  const { url, query, fragmentIdentifier } = parseUrl(inputUrl, parseOptions);
  try {
    from = await resolveAsync(url, options);
  } catch {
    from = await resolveAsync(`./${url}`, options);
  }
  const urlQuery = stringifyUrl({ url: "", query, fragmentIdentifier }, parseOptions);
  return { from, source: await fs.readFile(from), urlQuery };
};

export default resolve;
