import { NextResponse } from "next/server";
import { Chrono } from "chrono-node";

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const chrono = new Chrono();
    const parsed = chrono.parse(text);

    if (!parsed || parsed.length === 0) {
      return NextResponse.json(
        { error: "Could not parse date from input" },
        { status: 400 },
      );
    }

    // Pick the last future date from parsed results, fallback to first
    const dateRef =
      [...parsed].reverse().find((p) => {
        const date = p.start?.date();
        return date && date > new Date();
      }) || parsed[0];

    if (!dateRef.start) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 },
      );
    }

    const dateTime = dateRef.start.date();
    const isoDate = dateTime.toISOString();

    // Parse duration in minutes
    let durationMinutes: number | null = null;
    const durationMatch = text
      .toLowerCase()
      .match(/within \s+(\d+)\s*(minute|min|hour|hr)/);

    if (durationMatch) {
      const amount = parseInt(durationMatch[1], 10);
      const unit = durationMatch[2];
      if (unit.startsWith("h")) {
        durationMinutes = amount * 60;
      } else {
        durationMinutes = amount;
      }
    }

    // Parse priority
    let priority: "high" | "mid" | "easy" = "mid";
    const lower = text.toLowerCase();
    if (lower.includes("high")) priority = "high";
    else if (lower.includes("easy")) priority = "easy";

    return NextResponse.json({
      date: isoDate.slice(0, 10), // YYYY-MM-DD
      time: isoDate.slice(11, 16), // HH:MM
      durationMinutes, // number of minutes or null
      priority,
    });
  } catch (error) {
    return NextResponse.json({ error: "Error parsing date" }, { status: 500 });
  }
}
