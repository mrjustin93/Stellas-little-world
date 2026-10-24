// Ten real minutes per game day. 00:00 and 24:00 are the same midnight.
export class WorldClock {
  constructor(){this.hour=9;this.day=1;this.paused=false;}
  update(dt){if(this.paused)return;this.hour+=dt*24/600;while(this.hour>=24){this.hour-=24;this.day++;}}
  get night(){return this.hour<6||this.hour>=18;}
  get darkness(){const h=this.hour;return h<5||h>=20?.62:h<8?.62*(8-h)/3:h>=17?.62*(h-17)/3:0;}
  get label(){return `Day ${this.day} · ${String(Math.floor(this.hour)).padStart(2,'0')}:${String(Math.floor(this.hour%1*60)).padStart(2,'0')} ${this.night?'☾':'☀'}`;}
}
