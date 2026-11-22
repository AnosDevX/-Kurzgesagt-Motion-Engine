#!/usr/bin/env python3
"""Contact sheet of preview frames (360x640 each). Usage: python3 preview.py OUT.png DURATION t1 t2 t3 ...  (run from work dir)"""
import sys, base64, io
from playwright.sync_api import sync_playwright
from PIL import Image
out=sys.argv[1]; dur=sys.argv[2]; times=[float(x) for x in sys.argv[3:]]
with sync_playwright() as p:
    b=p.chromium.launch(args=["--use-gl=swiftshader","--enable-webgl","--ignore-gpu-blocklist","--use-angle=swiftshader"])
    pg=b.new_page(viewport={"width":360,"height":640}); errs=[]; pg.on("pageerror",lambda e:errs.append(str(e)))
    pg.goto(f"http://localhost:8765/index.html?w=360&h=640&dur={dur}&srt=input.srt")
    try: pg.wait_for_function("window.READY===true",timeout=60000)
    except Exception: print("ENGINE NOT READY. page errors:",errs); sys.exit(1)
    ims=[Image.open(io.BytesIO(base64.b64decode(pg.evaluate(f"renderFrame({t})").split(',')[1]))) for t in times]
    cols=min(len(ims),6); rows=(len(ims)+cols-1)//cols; w,h=ims[0].size; sh=Image.new("RGB",(w*cols,h*rows))
    for i,im in enumerate(ims): sh.paste(im,((i%cols)*w,(i//cols)*h))
    sh.save(out); print("saved",out,"page errors:",errs); b.close()
