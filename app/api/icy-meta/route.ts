import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import fetch from "node-fetch";

const STREAM_URL = "https://radio.imediaport.com/singcast";

export async function GET(req: NextRequest) {
  try {
    // Icecast requires 'Icy-MetaData' header to return metadata
    const response = await fetch(STREAM_URL, {
      method: "GET",
      headers: {
        "Icy-MetaData": "1",
        "User-Agent": "SingCASTClient/1.0",
      },
    });

    // Some Icecast servers return metadata in headers
    const headers = response.headers;
    const icyName = headers.get("icy-name") || "SingCAST";
    const icyGenre = headers.get("icy-genre") || "Global";
    const icyUrl = headers.get("icy-url") || "https://singnify.com";

    // Attempt to read current song from 'icy-title'
    const icyTitle = headers.get("icy-title") || "Live DJ";

    return NextResponse.json({
      name: icyName,
      genre: icyGenre,
      url: icyUrl,
      title: icyTitle,
    });
  } catch (err) {
    console.error("ICY fetch error:", err);
    return NextResponse.json({
      name: "SingCAST",
      genre: "Global",
      url: "https://singnify.com",
      title: "Live DJ",
      error: true,
    });
  }
}
