#!/usr/bin/env python3
"""Render frames of the three.js engine to an H.264 video (silent). Usage:
python3 render.py W H FPS T0 T1 OUT_MP4 AUDIO_DURATION [PORT]   (run from the work dir, server on PORT, default 8765)"""
import sys, base64, subprocess, time, json
from playwright.sync_api import sync_playwright
W,H,FPS=int(sys.argv[1]),int(sys.argv[2]),int(sys.argv[3]); t0,t1=float(sys.argv[4]),float(sys.argv[5]); out=sys.argv[6]
dur=float(sys.argv[7]); port=sys.argv[8] if len(sys.argv)>8 else "8765"
with sync_playwright() as p:
    b=p.chromium.launch(args=["--use-gl=swiftshader","--enable-webgl","--ignore-gpu-blocklist","--use-angle=swiftshader"])
    pg=b.new_page(viewport={"width":W,"height":H}); errs=[]; pg.on("pageerror",lambda e:errs.append(str(e)))
    pg.goto(f"http://localhost:{port}/index.html?w={W}&h={H}&dur={dur}&srt=input.srt")
    try: pg.wait_for_function("window.READY===true",timeout=90000)
    except Exception: print("ENGINE NOT READY. page errors:",errs); sys.exit(1)
    json.dump(pg.evaluate("window.META"),open("meta.json","w"))
    ff=subprocess.Popen(["ffmpeg","-y","-v","error","-f","image2pipe","-framerate",str(FPS),"-c:v","mjpeg","-i","-","-c:v","libx264","-preset","veryfast","-crf","17","-pix_fmt","yuv420p",out],stdin=subprocess.PIPE)
    n=int((t1-t0)*FPS); st=time.time()
    for i in range(n):
        d=pg.evaluate(f"renderFrame({t0+i/FPS})"); ff.stdin.write(base64.b64decode(d.split(',')[1]))
        if i%30==0: print(i,n,round(time.time()-st,1),flush=True)
    ff.stdin.close(); ff.wait(); b.close(); print("done",round(time.time()-st,1),flush=True)
