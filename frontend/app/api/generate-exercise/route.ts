import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();

    const prompt = `
      Buatkan 5 soal latihan (exercise) untuk topik: ${topic}.
      Format JSON seperti ini:
      {
        "exercises": [
          {
            "question": "teks soal",
            "options": ["A", "B", "C", "D"],
            "answer": "jawaban benar",
            "explanation": "penjelasan singkat mengapa jawaban itu benar"
          }
        ]
      }
      Jangan sertakan teks lain di luar JSON.
    `;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyAdRXPmy1k31P5EsCl28c_LfebA0csqN5U`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Gagal memanggil API Gemini" },
        { status: 500 }
      );
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (err) {
      console.error("Gagal parse JSON:", text, err);
      return NextResponse.json(
        { error: "Format JSON dari Gemini tidak valid", raw: text },
        { status: 500 }
      );
    }

    if (!parsed.exercises || !Array.isArray(parsed.exercises)) {
      return NextResponse.json(
        { error: "Format data tidak valid", raw: parsed },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Terjadi error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
