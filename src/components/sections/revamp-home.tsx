"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { AppAnchor } from "@/components/shared/app-anchor";
import { REGISTER_URL } from "@/lib/links";

const stages = [
  { key: "acquire", label: "Acquire", title: "Marketing", color: "orange" },
  { key: "engage", label: "Engage", title: "Conversations", color: "cyan" },
  { key: "convert", label: "Convert", title: "CRM pipeline", color: "blue" },
  { key: "retain", label: "Retain", title: "Broadcasts", color: "retain" },
  { key: "measure", label: "Measure", title: "Analytics", color: "measure" },
] as const;

const industries = ["Healthcare", "Retail & F&B", "Financial Services", "Automotive", "Logistics", "Travel & Hospitality"];

export function RevampHome() {
  const [stage, setStage] = useState(0);
  const [word, setWord] = useState("revenue");

  useEffect(() => {
    const words = ["revenue", "leads", "traffic"];
    const id = window.setInterval(() => setWord((current) => words[(words.indexOf(current) + 1) % words.length]), 2800);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="revamp-home">
      <section className="rv-hero">
        <div className="rv-wrap rv-hero__copy">
          <p className="rv-kicker">Cekat.AI Revenue Platform</p>
          <h1>#1 AI-powered <span className={`rv-word rv-word--${word}`}>{word}</span> technology</h1>
          <p className="rv-lede">Connect marketing, customer conversations, CRM, automation, and performance data in one connected revenue ecosystem.</p>
          <div className="rv-actions"><AppAnchor href={REGISTER_URL} className="rv-btn rv-btn--primary">Start free trial</AppAnchor><a href="#journey" className="rv-btn rv-btn--ghost">See how it works</a></div>
          <p className="rv-assure">14-day free trial · No credit card required · Set up in about 10 minutes</p>
          <ul className="rv-proof"><li><b>2M+</b> conversations processed every day</li><li><b>15+</b> industries served</li><li><b>Meta</b> Official Business Partner</li></ul>
        </div>
        <div className="rv-wrap rv-loop" aria-label="The Cekat revenue loop">
          <LoopCard tone="orange" label="Acquire" title="Lead sources"><div className="rv-source"><b>Creator post</b><span>Kirana · Instagram Reel</span></div><div className="rv-link">glowclinic.ckt.link/kirana-ig</div><div className="rv-bars"><i style={{ width: "86%" }}>Meta ads <b>412</b></i><i style={{ width: "64%" }}>Creator links <b>287</b></i><i style={{ width: "42%" }}>Website <b>103</b></i></div></LoopCard>
          <LoopCard tone="cyan" label="Engage" title="WhatsApp chat"><div className="rv-chat"><span>Hi, do you have a treatment slot this Saturday?</span><strong>Yes, we have 10:00 and 14:00 open.</strong><span>14:00, please</span></div><div className="rv-tags">Intent: booking · Qualified</div></LoopCard>
          <LoopCard tone="blue" label="Convert" title="CRM pipeline"><div className="rv-pipeline"><span>Inquiry</span><span>Qualified</span><strong>Booked</strong><span>Paid</span></div><p>Revenue source <b>Kirana&apos;s Reel</b></p><p>Follow-up <b>Sat 13:00 reminder</b></p></LoopCard>
          <LoopCard tone="measure" label="Measure" title="Analytics"><h3>Cost per booking, by source</h3><div className="rv-bars"><i style={{ width: "40%" }}>Creator posts <b>IDR 42K</b></i><i style={{ width: "66%" }}>WhatsApp ads <b>IDR 69K</b></i><i style={{ width: "84%" }}>TikTok creators <b>IDR 88K</b></i></div><p className="rv-insight"><b>Insight</b> Creator posts book customers at the lowest cost.</p></LoopCard>
          <p className="rv-loop__back">↺ Next campaign: brief more creators like Kirana, and Meta learns who booked.</p>
        </div>
      </section>

      <section className="rv-trust"><div className="rv-wrap rv-trust__head"><h2>Built for businesses that run on customer conversations</h2><b>3,000+ businesses trust Cekat</b></div><div className="rv-marquee">Nature Craft Indonesia　 Rumah Zakat　 VIO Optical Clinic　 Ancol　 DokterHub　 Kopi Kenangan　 Moir Salon　 Rata</div></section>

      <section className="rv-section rv-pain"><div className="rv-wrap"><p className="rv-kicker">Why revenue leaks</p><h2>Every tool does its job. None of them share the customer.</h2><div className="rv-pain-grid">{stages.slice(0, 4).map((item, index) => <button key={item.key} className={`rv-pain-card rv-tone-${item.color} ${stage === index ? "is-active" : ""}`} onClick={() => setStage(index)}><span>{item.label}</span><h3>{item.title}</h3><p>{stage === index ? "Leads move across teams, but the source and next action disappear between tools." : "A disconnected part of your customer journey."}</p>{stage === index && <div className="rv-mini-ui">{index === 0 ? "Ads → leads → ?" : index === 1 ? "Chats → team phones → ?" : index === 2 ? "Pipeline → follow-up → ?" : "Broadcast → repeat buyer → ?"}</div>}</button>)}</div></div></section>

      <section id="journey" className="rv-section rv-journey"><div className="rv-wrap"><div className="rv-section-head"><div><p className="rv-kicker">One connected loop</p><h2>From first click to repeat customer.</h2></div><p>Every stage connects to the next, so your team can see what moves revenue and act on it.</p></div><div className="rv-stage-tabs">{stages.map((item, index) => <button key={item.key} className={stage === index ? "is-active" : ""} onClick={() => setStage(index)}><span>{index + 1}</span>{item.label}</button>)}</div><div className={`rv-journey-panel rv-tone-${stages[stage].color}`}><div><span className="rv-stage-chip">{stages[stage].label}</span><h3>{stages[stage].title}</h3><p>{stage === 0 ? "Know which ads and creators bring revenue." : stage === 1 ? "Every channel in one inbox, answered by AI." : stage === 2 ? "Pipelines that keep every deal moving." : stage === 3 ? "Personal messages to the right segment." : "See what moves customers, end to end."}</p><AppAnchor href={REGISTER_URL} className="rv-btn rv-btn--primary">Explore this stage</AppAnchor></div><div className="rv-product-ui"><div className="rv-ui-top">Cekat platform <span>● Live</span></div><div className="rv-ui-columns"><b>{stages[stage].title}</b><i /><i /><i /><i /></div></div></div></div></section>

      <section id="trial" className="rv-section rv-clara"><div className="rv-wrap rv-split"><div><p className="rv-kicker">Meet Clara</p><h2>Your AI setup agent, ready in minutes.</h2><p>Tell Clara what you want to automate. She connects your knowledge, channels, and workflows so your team can start faster.</p><AppAnchor href={REGISTER_URL} className="rv-btn rv-btn--primary">Build with Clara</AppAnchor></div><Image src="/images/home/simpler-ai-builder.png" alt="Cekat AI builder" width={720} height={480} /></div></section>

      <section id="industries" className="rv-section rv-industries"><div className="rv-wrap"><p className="rv-kicker">Built for your business</p><h2>One revenue loop. Every industry.</h2><div className="rv-industry-grid">{industries.map((name, index) => <div key={name} className="rv-industry"><span>0{index + 1}</span><h3>{name}</h3><p>Connect every customer conversation to the outcome.</p><a href="#journey">Explore →</a></div>)}</div></div></section>

      <section id="stories" className="rv-section rv-stories"><div className="rv-wrap rv-split"><div><p className="rv-kicker">Customer stories</p><h2>Revenue teams move faster when the loop is connected.</h2><p>From first conversation to closed-won, Cekat helps teams turn more customer intent into measurable growth.</p><a className="rv-btn rv-btn--ghost" href="#integrations">See customer stories</a></div><Image src="/images/home/story-retail-owner.jpg" alt="Cekat customer" width={720} height={500} /></div></section>

      <section id="integrations" className="rv-section rv-integrations"><div className="rv-wrap"><p className="rv-kicker">Integrations</p><h2>Works with the tools your team already uses.</h2><div className="rv-integration-list"><span>WhatsApp</span><span>Meta</span><span>Instagram</span><span>TikTok</span><span>HubSpot</span><span>Google Sheets</span><span>API</span></div></div></section>

      <section id="releases" className="rv-section rv-releases"><div className="rv-wrap"><div className="rv-section-head"><div><p className="rv-kicker">What&apos;s new</p><h2>Always getting better at closing the loop.</h2></div><a href="https://docs.cekat.ai" target="_blank" rel="noreferrer">View changelog →</a></div><div className="rv-release-grid"><article><span>Product release</span><h3>Build smarter AI agents with Clara</h3><p>Give your team a faster path from idea to automation.</p></article><article><span>Platform update</span><h3>See the full customer journey in one view</h3><p>Connect marketing, conversations, CRM, and revenue data.</p></article></div></div></section>

      <section className="rv-final"><div className="rv-wrap"><p className="rv-kicker">Cekat.AI</p><h2>Stop losing revenue between tools.</h2><p>Connect the loop and turn every customer conversation into your next best action.</p><div className="rv-actions"><AppAnchor href={REGISTER_URL} className="rv-btn rv-btn--light">Start free trial</AppAnchor><a href="#journey" className="rv-btn rv-btn--outline-light">See how it works</a></div></div></section>
    </div>
  );
}

function LoopCard({ tone, label, title, children }: { tone: string; label: string; title: string; children: ReactNode }) {
  return <article className={`rv-loop-card rv-tone-${tone}`}><p className="rv-ui-label"><span>{label}</span>{title}</p>{children}</article>;
}
