#!/usr/bin/env python3
"""Synthesize soft varied transition swishes, booms/risers/cracks, a drone bed (ducked under the voice) and mix with the voiceover.
Usage: python3 sfx.py VOICE_AUDIO OUT_WAV [heartbeat_start:end]  (run in the work dir after render.py wrote meta.json). No per-word pop sounds, by design."""
import json, subprocess, sys, numpy as np, wave
SR=44100; meta=json.load(open('meta.json')); total=meta['total']; N=int((total+.3)*SR)
subprocess.run(['ffmpeg','-y','-v','error','-i',sys.argv[1],'-ac','1','-ar',str(SR),'-f','f32le','vo.raw'],check=True)
vo=np.fromfile('vo.raw',dtype=np.float32); vo=vo/np.abs(vo).max()*.9
L=np.zeros(N); Rr=np.zeros(N); rng=np.random.default_rng(3)
def put(sig,t,g=1.0,pan=0.0):
    i=int(max(0,t)*SR); n=min(len(sig),N-i)
    if n<=0: return
    L[i:i+n]+=sig[:n]*g*(1-max(0,pan)); Rr[i:i+n]+=sig[:n]*g*(1+min(0,pan))
def lp_sweep(x,fc):  # one-pole lowpass with time-varying cutoff
    y=np.zeros_like(x); s=0.0
    for k in range(len(x)):
        a=1-np.exp(-2*np.pi*fc[k]/SR); s+=a*(x[k]-s); y[k]=s
    return y
def whoosh(i,kind=None):
    kind=i%3 if kind is None else kind
    r=np.random.default_rng(100+i); dur=r.uniform(.95,1.4); n=int(dur*SR); u=np.linspace(0,1,n)
    x=np.cumsum(r.standard_normal(n)); x-=np.convolve(x,np.ones(2200)/2200,'same'); x/=np.abs(x).max()
    lo,hi=[(90,1300),(180,2400),(60,850)][kind]; peak=r.uniform(.38,.62); fc=lo+(hi-lo)*np.exp(-((u-peak)/r.uniform(.18,.28))**2)
    y=lp_sweep(x,fc); y/=np.abs(y).max()
    env=np.sin(np.pi*u)**r.uniform(2.0,3.0)
    air=np.sin(2*np.pi*np.cumsum(np.linspace(r.uniform(150,260),r.uniform(65,110),n))/SR)*.22
    sig=(y+air)*env; sig=lp_sweep(sig,np.full(n,3200)); sig/=np.abs(sig).max()
    d=1 if r.random()>.35 else -1; pan=d*np.linspace(-.55,.55,n)
    return sig,pan,r.uniform(.16,.26)
def put_st(sig,pan,t,g):
    i=int(max(0,t)*SR); n=min(len(sig),N-i)
    if n<=0: return
    a=(pan[:n]+1)*np.pi/4; L[i:i+n]+=sig[:n]*g*np.cos(a); Rr[i:i+n]+=sig[:n]*g*np.sin(a)
def boom():
    n=int(1.6*SR); t=np.arange(n)/SR; f=48*np.exp(-t*.9)+30
    s=np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*2.4); ns=lp_sweep(rng.standard_normal(n)*np.exp(-t*9),np.full(n,300))*3
    return (s+ns*.6)*.9
def riser(d):
    n=int(d*SR); t=np.arange(n)/SR; u=t/d; x=rng.standard_normal(n); y=lp_sweep(x,300+6000*u**2)*(u**2.2)*2.0
    s=np.sin(2*np.pi*np.cumsum(180+1400*u**2)/SR)*u**2.5*.35; return y+s
def crack():
    n=int(1.2*SR); t=np.arange(n)/SR; x=rng.standard_normal(n); hp=x-lp_sweep(x,np.full(n,2500))
    c=hp*np.exp(-t*28)*1.6; g=np.sin(2*np.pi*2400*t)*np.exp(-t*20)*.25+np.sin(2*np.pi*3600*t)*np.exp(-t*30)*.15
    return c+g+boom()[:n]*.7
def tick():
    n=int(.05*SR); t=np.arange(n)/SR; return np.sin(2*np.pi*np.cumsum(900-9000*t)/SR)*np.exp(-t*70)
def beat():
    n=int(.25*SR); t=np.arange(n)/SR; return np.sin(2*np.pi*46*t)*np.exp(-t*20)
# transitions + scripted events
for i,s in enumerate(meta['scenes']):
    t0=s['t0']
    if i:
        sg,pn,gg=whoosh(i,{'wipe':0,'slide':0,'flash':1,'iris':2}.get(s.get('tr'),i%3)); put_st(sg,pn,t0-len(sg)/SR/2,gg)
    for dt,k in s['sfx']:
        if k=='boom': put(boom(),t0+dt,.55)
        elif k=='riser': put(riser(1.4 if t0<10 else 1.7),t0+dt if t0<10 else t0+dt,.30)
        elif k=='crack': put(crack(),t0+dt,.65)
# heartbeat during the "exposed / hide it" section
if len(sys.argv)>3 and ':' in sys.argv[3]:   # optional heartbeat range 'a:b' (tense/dramatic section)
    ba,bb=[float(x) for x in sys.argv[3].split(':')]; t=ba
    while t<bb:
        put(beat(),t,.35*min(1,(t-ba)/3)); put(beat(),t+.22,.22*min(1,(t-ba)/3)); t+=.86
# drone bed, ducked under the voice
n=N; tt=np.arange(n)/SR
bed=(np.sin(2*np.pi*55*tt)+.6*np.sin(2*np.pi*55.4*tt)+.4*np.sin(2*np.pi*82.4*tt)+.25*np.sin(2*np.pi*110.3*tt))*(.6+.4*np.sin(2*np.pi*tt/9))
bed*=np.minimum(1,tt/3)*np.minimum(1,(total+.3-tt)/2)*(.7+.5*np.clip(tt/total,0,1))
v=np.zeros(N); v[:min(N,len(vo))]=np.abs(vo[:N]); k=int(.15*SR); env=np.convolve(v,np.ones(k)/k,'same'); duck=1-.45*np.clip(env/.2,0,1)
bed*=duck*.07; L+=bed; Rr+=bed
V=np.zeros(N); V[:min(N,len(vo))]=vo[:N]; L+=V; Rr+=V
m=np.stack([L,Rr],1); m=np.tanh(m*1.05)*.95
pcm=(m*32767).astype('<i2'); w=wave.open(sys.argv[2],'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes()); w.close(); print('mix ok',N/SR)
