"use client";

import Image from "next/image";
import { Moon, Sun } from "lucide-react";
import { useState } from "react";
import type { CSSProperties } from "react";

// Explicit fixed offsets for an illustrative preview, not a live world clock.
const ZONES = [
  { city: "Jakarta", offset: 7, language: "Bahasa Indonesia", x: "73%", y: "62%" },
  { city: "Tokyo", offset: 9, language: "日本語", x: "79%", y: "32%" },
  { city: "London", offset: 0, language: "English", x: "44%", y: "24%" },
  { city: "New York", offset: -5, language: "English", x: "23%", y: "41%" },
] as const;

function localHour(utc: number, offset: number) {
  return (utc + offset + 24) % 24;
}
function clock(hour: number) {
  return `${String(hour).padStart(2, "0")}:00`;
}
function offsetLabel(offset: number) {
  return `UTC${offset >= 0 ? "+" : "−"}${Math.abs(offset)}`;
}

/** Native, keyboard-explorable companion to the existing 24/7 coverage copy. */
export function CoverageScene({ imageAlt, isId }: { imageAlt: string; isId: boolean }) {
  const [utc, setUtc] = useState(17);
  const [selected, setSelected] = useState(1);
  const zone = ZONES[selected];
  const hour = localHour(utc, zone.offset);
  const isDay = hour >= 6 && hour < 18;
  const period = (day: boolean) => day ? (isId ? "Siang" : "Day") : (isId ? "Malam" : "Night");

  return (
    <div className="coverage-scene" role="group" aria-label={imageAlt}>
      <div className="coverage-scene__world" data-scene-layer>
        <div className="coverage-scene__globe" data-scene-float aria-hidden="true">
          <div className="coverage-scene__sphere">
            <div className="coverage-scene__meridians"><i /><i /><i /></div>
            <div className="coverage-scene__latitudes"><i /><i /><i /></div>
            {ZONES.map((item, index) => <i key={item.city} className="coverage-scene__point" data-active={selected === index} style={{ "--point-x": item.x, "--point-y": item.y } as CSSProperties} />)}
          </div>
          <span className="coverage-scene__sun"><Sun size={24} /></span>
          <span className="coverage-scene__moon"><Moon size={22} /></span>
          <div className="coverage-scene__agent">
            <Image src="/revamp-web-cekat/assets/logo-mark.svg" alt="" width={30} height={30} />
            <strong>24/7</strong>
            <span>AI Agent</span>
          </div>
        </div>
        <div className="coverage-scene__languages" aria-hidden="true">
          <span>Bahasa Indonesia</span><span lang="ja">日本語</span><span>English</span>
        </div>
      </div>

      <div className="coverage-scene__zones" data-scene-layer>
        {ZONES.map((item, index) => {
          const time = localHour(utc, item.offset);
          const day = time >= 6 && time < 18;
          const DayIcon = day ? Sun : Moon;
          return (
            <button key={item.city} type="button" className="coverage-scene__zone" aria-label={item.city} aria-pressed={selected === index} onClick={() => setSelected(index)}>
              <span className="coverage-scene__zone-icon" data-day={day}><DayIcon size={19} aria-hidden="true" /></span>
              <span className="coverage-scene__zone-name"><strong>{item.city}</strong><span>{offsetLabel(item.offset)}</span></span>
              <time>{clock(time)}</time>
            </button>
          );
        })}
      </div>

      <div className="coverage-scene__preview" data-scene-layer>
        <label>
          <span className="coverage-scene__preview-label"><span>{isId ? "Simulasi waktu UTC" : "UTC time preview"}</span><strong>{clock(utc)}</strong></span>
          <input type="range" min="0" max="23" step="1" value={utc} aria-label={isId ? "Simulasi waktu UTC" : "UTC time preview"} aria-valuetext={`${clock(utc)} UTC`} onChange={(event) => setUtc(Number(event.target.value))} />
        </label>
        <div className="coverage-scene__selection" role="status" aria-live="polite" aria-atomic="true">
          <span>{zone.city} · {clock(hour)} · {period(isDay)}</span>
          <span lang={zone.language === "日本語" ? "ja" : undefined}>{zone.language}</span>
        </div>
        <p className="coverage-scene__note">{isId ? "Ilustrasi zona waktu · offset UTC tetap" : "Illustrative timezones · fixed UTC offsets"}</p>
      </div>
    </div>
  );
}
