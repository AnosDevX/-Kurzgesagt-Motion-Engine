#!/bin/bash
# usage: run_all.sh WORKDIR SRT AUDIO [W H FPS] [HEARTBEAT a:b]
# Copies the engine into WORKDIR (keeps an existing scenes.js), installs deps, renders, builds SFX, muxes final.mp4
set -e
SK=$(cd "$(dirname "$0")" && pwd); WD=$1; SRT=$2; AUD=$3; W=${4:-1080}; H=${5:-1920}; FPS=${6:-30}; BEAT=$7
mkdir -p "$WD"; cp "$SK"/engine/core.js "$SK"/engine/runtime.js "$SK"/engine/index.html "$WD"/; [ -f "$WD/scenes.js" ] || cp "$SK/engine/scenes.js" "$WD/"
cp "$SRT" "$WD/input.srt"; cp "$AUD" "$WD/voice_src"; cd "$WD"
[ -d node_modules/three ] || npm install three@0.128.0 @fontsource/anton --no-audit --no-fund >/dev/null 2>&1
ls ~/.cache/ms-playwright >/dev/null 2>&1 || python3 -m playwright install chromium >/dev/null 2>&1 || true
(curl -sI http://localhost:8765/index.html | grep -q 200) || { setsid nohup python3 -m http.server 8765 >/dev/null 2>&1 </dev/null & sleep 2; }
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 voice_src)
python3 "$SK/render.py" $W $H $FPS 0 $(python3 -c "print($DUR+.5)") silent.mp4 $DUR
python3 "$SK/sfx.py" voice_src mix.wav $BEAT
ffmpeg -y -v error -i silent.mp4 -i mix.wav -c:v copy -c:a aac -b:a 192k -shortest final.mp4 && echo "final.mp4 ready"
