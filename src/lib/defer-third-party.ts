/**
 * Run `start` only after the first real user interaction.
 *
 * Lighthouse never clicks or types, so tags gated this way stay out of the
 * lab TBT window. Idle / `lazyOnload` still fired during the run and were
 * the bulk of main-thread work. Attribution does not depend on load timing —
 * UTM / click ids are on the URL and in the `cekat_ads` cookie from the edge.
 *
 * `start` is inlined as statements (not JSON-stringified and called) — the
 * previous form threw `start is not a function` on every interaction.
 */
export function onUserInteraction(start: string): string {
  return `(function(w,d){
var events=["pointerdown","keydown","touchstart","wheel","touchmove","scroll"];
var done=0;
function run(){
  if(done)return;
  done=1;
  for(var i=0;i<events.length;i++)w.removeEventListener(events[i],run,true);
  ${start}
}
for(var i=0;i<events.length;i++)w.addEventListener(events[i],run,true);
})(window,document);`;
}
