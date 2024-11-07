// /utils/languagetool.ts
import { MatchParams } from "@/utils/types/user-profile";
import axios, { AxiosError } from "axios";
import qs from "qs";


export async function checkGrammar(text: string): Promise<MatchParams[]> {
  try {
    const data = qs.stringify({
      text: text,
      language: "en-US",
    });

    const response = await axios.post(
      "https://api.languagetool.org/v2/check",
      data,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response.data.matches;
  } catch (error: AxiosError | unknown) {
    const err = error as AxiosError;
    console.error(
      "Error checking grammar:",
      err.response ? err.response.data : err.message
    );
    return [];
  }
}
