"""MOTION. — 15s original score + sound design.

Everything is synthesized here: no samples, no licensed audio.
120 BPM, A minor, 7.5 bars. The drop is at 10.000s (beat 21).
"""
import math
import wave
from pathlib import Path

import numpy as np

SR = 48000
DUR = 15.0
N = int(SR * DUR)
rng = np.random.default_rng(26)

OUT = Path(__file__).resolve().parent.parent / "public" / "audio"
OUT.mkdir(parents=True, exist_ok=True)

t_all = np.arange(N) / SR
buf = np.zeros((2, N))


# ------------------------------------------------------------------ utils
def add(sig, start, gain=1.0, pan=0.0):
    s = int(round(start * SR))
    if s >= N or len(sig) == 0:
        return
    sig = sig[: N - s]
    l = math.cos((pan + 1) * math.pi / 4)
    r = math.sin((pan + 1) * math.pi / 4)
    buf[0, s : s + len(sig)] += sig * gain * l * 1.4142
    buf[1, s : s + len(sig)] += sig * gain * r * 1.4142


def echo(sig, start, gain=1.0, pan=0.0):
    add(sig, start, gain, pan)
    add(sig * 0.16, start + 0.1875, gain, -pan * 0.7)
    add(sig * 0.07, start + 0.375, gain, pan * 0.5)


def bp(sig, lo, hi, order=2.0):
    """FFT band filter with soft edges."""
    spec = np.fft.rfft(sig)
    f = np.fft.rfftfreq(len(sig), 1 / SR)
    lo_w = np.clip((f - lo * 0.55) / (lo * 0.9), 0, 1) ** order
    hi_w = np.clip((hi * 1.55 - f) / (hi * 0.9), 0, 1) ** order
    return np.fft.irfft(spec * lo_w * hi_w, len(sig))


def lp(sig, cutoff, order=2.0):
    spec = np.fft.rfft(sig)
    f = np.fft.rfftfreq(len(sig), 1 / SR)
    w = 1 / (1 + (f / max(cutoff, 20)) ** order)
    return np.fft.irfft(spec * w, len(sig))


def hp(sig, cutoff, order=2.0):
    spec = np.fft.rfft(sig)
    f = np.fft.rfftfreq(len(sig), 1 / SR)
    w = 1 - 1 / (1 + (f / max(cutoff, 20)) ** order)
    return np.fft.irfft(spec * w, len(sig))


def env_ar(n, attack, decay, release=0.02, power=1.0):
    t = np.arange(n) / SR
    a = np.clip(t / max(attack, 1e-5), 0, 1)
    d = np.exp(-np.maximum(t - attack, 0) * decay)
    r = np.clip((n / SR - t) / max(release, 1e-5), 0, 1)
    return (a * d * r) ** power


def norm(sig):
    m = np.max(np.abs(sig))
    return sig / m if m > 1e-9 else sig


def saw(freq, t, phase=0.0):
    return 2 * ((freq * t + phase) % 1) - 1


# ------------------------------------------------------------------ drums
def kick(gain=1.0, length=0.5):
    n = int(length * SR)
    t = np.arange(n) / SR
    f = 46 + 150 * np.exp(-t * 32)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR)
    body *= np.exp(-t * 6.2)
    click = hp(rng.normal(0, 1, n), 1800) * np.exp(-t * 420) * 0.45
    return np.tanh((body + click) * 1.5) * gain


def clap(gain=1.0, length=0.28):
    n = int(length * SR)
    t = np.arange(n) / SR
    noise = bp(rng.normal(0, 1, n), 900, 5200)
    e = np.zeros(n)
    for delay, amp in [(0.0, 1.0), (0.011, 0.75), (0.022, 0.55), (0.034, 0.35)]:
        s = int(delay * SR)
        e[s:] += amp * np.exp(-np.maximum(t[: n - s], 0) * 24)
    body = np.sin(2 * np.pi * 175 * t) * np.exp(-t * 22) * 0.22
    return np.tanh((noise * e + body) * 1.3) * gain


def hat(open_=False, gain=1.0):
    length = 0.16 if open_ else 0.045
    n = int(length * SR)
    t = np.arange(n) / SR
    sig = hp(rng.normal(0, 1, n), 7200, 2.0)
    sig *= np.exp(-t * (18 if open_ else 95))
    return sig * gain


def snare(gain=0.5):
    n = int(0.16 * SR)
    t = np.arange(n) / SR
    sig = bp(rng.normal(0, 1, n), 500, 6500) * np.exp(-t * 28)
    sig += np.sin(2 * np.pi * 190 * t) * np.exp(-t * 30) * 0.3
    return sig * gain


# ------------------------------------------------------------------ tonal
def sub_note(freq, dur, gain=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    sig = np.sin(2 * np.pi * freq * t) + 0.18 * np.sin(2 * np.pi * freq * 2 * t)
    return sig * env_ar(n, 0.006, 3.2, 0.05) * gain


def bass_note(freq, dur, cutoff=280, gain=1.0, drive=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    sig = saw(freq, t) * 0.7 + np.sin(2 * np.pi * freq * t) * 0.55
    sig += 0.22 * saw(freq * 1.005, t, 0.3)
    sig = lp(sig, cutoff, 2.0)
    e = env_ar(n, 0.004, 5.5, 0.03)
    return np.tanh(sig * e * drive) * gain


def pad(freqs, dur, gain=1.0, cutoff=1600, attack=0.35):
    n = int(dur * SR)
    t = np.arange(n) / SR
    sig = np.zeros(n)
    for i, f in enumerate(freqs):
        det = 1 + 0.0035 * (i - 1.5)
        sig += saw(f * det, t, i * 0.13) * 0.22
        sig += np.sin(2 * np.pi * f * t * 0.5) * 0.16
    sig = lp(sig, cutoff, 2.0)
    e = np.clip(t / attack, 0, 1) * np.clip((dur - t) / 0.45, 0, 1)
    return sig * e * gain


def pluck(freq, dur=0.24, gain=1.0, cutoff=3800):
    n = int(dur * SR)
    t = np.arange(n) / SR
    sig = (
        np.sin(2 * np.pi * freq * t)
        + 0.35 * np.sin(2 * np.pi * freq * 2.001 * t)
        + 0.14 * np.sin(2 * np.pi * freq * 3.004 * t)
    )
    sig += 0.16 * saw(freq * 1.002, t)
    sig = lp(sig, cutoff, 1.5)
    return sig * env_ar(n, 0.003, 15, 0.02) * gain


def bell(freq, dur=1.2, gain=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    sig = (
        np.sin(2 * np.pi * freq * t)
        + 0.28 * np.sin(2 * np.pi * freq * 2.01 * t)
        + 0.12 * np.sin(2 * np.pi * freq * 3.98 * t)
    )
    return sig * env_ar(n, 0.005, 3.4, 0.1) * gain


# ------------------------------------------------------------------ sfx
def whoosh(dur=0.4, gain=1.0, up=True):
    n = int(dur * SR)
    t = np.arange(n) / SR
    noise = rng.normal(0, 1, n)
    out = np.zeros(n)
    block = 512
    for i in range(0, n, block):
        p = i / n
        if up:
            lo = 220 + 2600 * p
            hi = 900 + 7000 * p
        else:
            lo = 2800 - 2400 * p
            hi = 8200 - 6000 * p
        seg = noise[i : i + block]
        if len(seg) < 8:
            break
        out[i : i + block] = bp(seg, lo, hi, 1.4) * (len(seg) / 512)
    e = np.clip(t / (dur * 0.35), 0, 1) ** 1.6 * np.clip((dur - t) / (dur * 0.4), 0, 1)
    return norm(out) * e * gain


def riser(dur=1.0, gain=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    noise = rng.normal(0, 1, n)
    out = np.zeros(n)
    block = 512
    for i in range(0, n, block):
        p = i / n
        seg = noise[i : i + block]
        if len(seg) < 8:
            break
        out[i : i + block] = bp(seg, 300 + 5000 * p**2, 1200 + 9000 * p**2, 1.2) * (len(seg) / 512)
    sweep = np.sin(2 * np.pi * np.cumsum(180 + 900 * (t / dur) ** 2) / SR) * 0.22
    e = (t / dur) ** 2.4
    return norm(out * e + sweep * e) * gain


def impact(gain=1.0, big=False):
    n = int((1.6 if big else 0.7) * SR)
    t = np.arange(n) / SR
    f = 32 + 120 * np.exp(-t * (7 if big else 18))
    boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * (2.1 if big else 6.5))
    noise = lp(rng.normal(0, 1, n), 2200) * np.exp(-t * (8 if big else 22)) * 0.35
    return np.tanh((boom + noise) * 1.7) * gain


def blip(freq=880, dur=0.12, gain=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    sig = np.sin(2 * np.pi * freq * t) + 0.2 * np.sin(2 * np.pi * freq * 2.02 * t)
    return sig * env_ar(n, 0.002, 28, 0.01) * gain


def click(gain=1.0):
    n = int(0.05 * SR)
    t = np.arange(n) / SR
    sig = hp(rng.normal(0, 1, n), 3000) * np.exp(-t * 380) * 0.7
    sig += np.sin(2 * np.pi * 2100 * t) * np.exp(-t * 190) * 0.5
    return sig * gain


# ------------------------------------------------------------------ harmony
A2, C3, E3, F2, F3, G2, G3, A3, B2, B3, D3 = (
    110.0, 130.81, 164.81, 87.31, 174.61, 98.0, 196.0, 220.0, 123.47, 246.94, 146.83
)
C4, D4, E4, F4, G4, A4, B4 = 261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88
C5, D5, E5, F5, G5, A5 = 523.25, 587.33, 659.25, 698.46, 783.99, 880.0

CHORDS = [
    # (start, root, triad, pad voicing)
    (0.0, A2, [A2, C3, E3], [A3, C4, E4, A4]),
    (2.0, F2, [F2, A2, C3], [F3, A3, C4, F4]),
    (4.0, 130.81, [130.81, 164.81, 196.0], [C4, E4, G4, C5]),
    (6.0, G2, [G2, B2, D3], [G3, B3, D4, G4]),
    (8.0, A2, [A2, C3, E3], [A3, C4, E4, A4]),
    (10.0, F2, [F2, A2, C3], [F3, A3, C4, F4]),
    (12.0, 130.81, [130.81, 164.81, 196.0], [C4, E4, G4, C5]),
    (14.0, G2, [G2, B2, D3], [G3, B3, D4, G4]),
]

# pad bed
for start, root, triad, voicing in CHORDS:
    dur = min(2.0, DUR - start)
    echo(pad(voicing, dur, gain=0.055, cutoff=1400, attack=0.5), start, 1.0, 0.0)

# sub pulse — beat 1 and 3 through the intro, four-on-floor after the flood
for beat in range(0, 20):
    start = beat * 0.5
    if start >= 9.5:
        break
    if start < 3.5:
        if beat % 2 == 0:
            add(sub_note(A2 / 2 if beat < 4 else F2 / 2, 0.55, 0.5), start, 0.55, 0.0)
    elif start < 9.0:
        add(kick(1.0), start, 0.52, 0.0)

for beat in range(20, 25):
    start = beat * 0.5
    if start >= 12.5:
        break
    add(kick(1.0), start, 0.62, 0.0)

# kick tail at 12.0 (end of drop bar) etc.
for beat in [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]:
    start = beat * 0.5
    if 3.5 <= start < 9.0:
        pass  # covered above

# claps on the backbeat
for beat in range(8, 25):
    start = beat * 0.5
    if 4.0 <= start < 9.0 or 10.0 <= start < 12.5:
        if beat % 2 == 0:
            num = int(start * 2)
            if num % 2 == 0:
                add(clap(1.0), start, 0.2, 0.08 if num % 4 else -0.08)

# hats: 8ths everywhere after 2s, accents and 16th rolls at section edges
for step in range(int(2.0 / 0.25), int(14.5 / 0.25)):
    start = step * 0.25
    if 9.0 <= start < 10.0:
        continue
    if 12.0 <= start < 12.5:
        continue
    if step % 2 == 1:
        add(hat(False, 0.7), start, 0.11, 0.24 if step % 4 == 1 else -0.24)
    else:
        add(hat(True, 0.5), start, 0.045, 0.0)
# roll into the drop and into the outro
for i in range(8):
    add(hat(False, 0.5), 9.5 + i * 0.03125, 0.05 + i * 0.008, 0.1)
for i in range(6):
    add(snare(0.4), 8.75 + i * 0.0625, 0.10 + i * 0.035, 0.0)

# bass line — root eighths with octave lift
for start, root, triad, voicing in CHORDS:
    if start < 3.5:
        continue
    if start >= 12.5:
        continue
    if 9.5 <= start < 10.0:
        continue
    for i in range(8):
        sub_start = start + i * 0.25
        if sub_start >= 12.5:
            break
        if 9.0 <= sub_start < 10.0:
            continue
        f = root * (2 if i in (3, 6) and start >= 6 else 1)
        cutoff = 240 if start < 7.5 else 420
        add(bass_note(f, 0.2, cutoff, 0.34, 1.2), sub_start, 0.5, 0.0)

# drop bass: harder, syncopated
for i in range(20):
    start = 10.0 + i * 0.125
    if start >= 12.5:
        break
    root = F2 if start < 12.0 else 130.81
    f = root * (2 if i % 8 in (5, 7) else 1)
    add(bass_note(f, 0.11, 700, 0.34, 1.6), start, 0.42, 0.0)

# arpeggio
ARP_FROM = {0: [A3, C4, E4, A4], 2: [F3, A3, C4, F4], 4: [C4, E4, G4, C5],
            6: [G3, B3, D4, G4], 8: [A3, C4, E4, A4], 10: [F3, A3, C4, F4],
            12: [C4, E4, G4, C5], 14: [G3, B3, D4, G4]}
for section, notes in ARP_FROM.items():
    if section in (0, 2):
        continue
    if section == 10:
        rng_range = range(0, 8)
    else:
        rng_range = range(0, 8)
    for i in rng_range:
        start = section + i * 0.25
        if section == 4:
            start = 5.5 + i * 0.25
        if start >= 14.6:
            continue
        if 9.0 <= start < 10.0:
            continue
        note = notes[i % len(notes)] * (2 if i % 3 == 2 else 1)
        echo(pluck(note, 0.22, 0.10, 4200), start, 0.9, 0.3 if i % 2 else -0.3)

# melodic accents (bells) on the picture's turning points
echo(bell(A5, 1.1, 0.10), 3.5, 0.8, -0.2)
echo(bell(E5, 1.2, 0.09), 5.5, 0.7, 0.25)
echo(bell(C5, 1.3, 0.09), 7.5, 0.7, -0.25)
echo(bell(F5, 1.4, 0.10), 10.0, 0.8, 0.1)
echo(bell(A5, 1.6, 0.08), 11.7, 0.7, -0.15)
echo(bell(C5, 1.6, 0.07), 12.5, 0.6, 0.2)

# ------------------------------------------------------------------ sound design
add(impact(0.55), 0.0, 0.55, 0.0)
add(blip(1320, 0.16, 0.5), 0.0, 0.35, 0.0)
add(whoosh(0.32, 0.5, up=True), 0.5, 0.5, 0.1)
add(blip(880, 0.1, 0.4), 0.5, 0.3, -0.1)
for i, s in enumerate([0.72, 0.76, 0.80, 0.84, 0.88, 0.92]):
    add(blip(1760 + i * 60, 0.05, 0.22), s, 0.22, -0.25 + i * 0.1)
add(whoosh(0.3, 0.35, up=False), 1.08, 0.4, 0.0)
for i, s in enumerate([1.26, 1.36, 1.46]):
    add(blip(660, 0.08, 0.18), s, 0.2, (-0.2, 0.0, 0.2)[i])
for i, s in enumerate([1.56, 1.64, 1.72]):
    add(click(0.5), s, 0.16, (-0.3, 0.3, -0.1)[i])
add(whoosh(0.34, 0.5, up=False), 1.98, 0.4, 0.0)
add(riser(0.32, 0.35), 2.18, 0.55, 0.0)
add(impact(0.6), 3.5, 0.5, 0.0)
add(whoosh(0.4, 0.5, up=True), 3.5, 0.35, 0.0)
for i, s in enumerate([4.0, 4.1, 4.2]):
    add(kick(0.75), s, 0.22, 0.0)
    add(blip(440 - i * 60, 0.12, 0.15), s, 0.25, 0.0)
add(whoosh(0.4, 0.45, up=False), 5.05, 0.45, 0.0)
add(blip(523, 0.2, 0.3), 5.72, 0.3, 0.0)
for i, s in enumerate([6.0, 6.5, 7.0]):
    add(click(0.4), s, 0.1, (-0.2, 0.2, 0.0)[i])
add(whoosh(0.26, 0.25, up=True), 7.44, 0.3, 0.0)
for i, s in enumerate([7.84, 7.9, 7.98]):
    add(click(0.35), s, 0.09, (-0.4, 0.0, 0.4)[i])
for s in [8.25, 8.42]:
    add(click(0.3), s, 0.06, 0.2)
add(click(0.8), 8.533, 0.24, 0.12)
add(blip(1200, 0.06, 0.4), 8.533, 0.18, 0.12)
add(blip(1568, 0.3, 0.3), 8.86, 0.18, 0.2)
add(bell(2093, 0.5, 0.12), 8.95, 0.22, 0.2)
add(whoosh(0.5, 0.5, up=True), 9.36, 0.55, -0.1)
add(riser(0.5, 0.55), 9.55, 0.6, 0.0)
# drop
add(impact(1.2, big=True), 10.0, 0.85, 0.0)
add(whoosh(0.35, 0.6, up=False), 10.0, 0.4, 0.0)
for s in (10.0, 10.5, 11.0, 11.5, 12.0):
    add(kick(0.5), s, 0.12, 0.0)
add(whoosh(0.45, 0.45, up=False), 11.48, 0.45, 0.1)
add(blip(880, 0.16, 0.2), 11.7, 0.3, 0.0)
add(impact(0.65), 12.5, 0.32, 0.0)
add(blip(660, 0.2, 0.2), 12.5, 0.28, 0.0)
for s in (13.0, 13.5):
    add(click(0.25), s, 0.06, -0.2)
add(whoosh(0.55, 0.5, up=False), 14.4, 0.4, 0.0)
add(blip(1320, 0.16, 0.5), 14.87, 0.35, 0.0)
add(impact(0.4), 14.87, 0.28, 0.0)

# ------------------------------------------------------------------ master
# gentle bus: remove DC, ride the low end, soft-limit, normalise
buf = buf - buf.mean(axis=1, keepdims=True)
# tiny high-pass to keep the sub clean
for ch in range(2):
    buf[ch] = hp(buf[ch], 24)
# soft saturation + peak control
buf = np.tanh(buf * 1.15)
peak = np.max(np.abs(buf))
buf *= 0.872 / peak
# stereo width: tiny, keep mono-compatible
mid = (buf[0] + buf[1]) / 2
side = (buf[0] - buf[1]) / 2
buf[0] = mid + side * 0.92
buf[1] = mid - side * 0.92
# fade the very edges to zero for a clean loop seam
fade = int(0.012 * SR)
buf[:, :fade] *= np.linspace(0, 1, fade) ** 0.5
buf[:, -fade:] *= np.linspace(1, 0, fade) ** 1.5

pcm = np.clip(buf.T, -1, 1)
pcm = (pcm * 32767).astype(np.int16)
path = OUT / "reel-mix.wav"
with wave.open(str(path), "wb") as f:
    f.setnchannels(2)
    f.setsampwidth(2)
    f.setframerate(SR)
    f.writeframes(pcm.tobytes())

print("wrote", path, path.stat().st_size, "bytes")
print("peak dBFS", 20 * np.log10(np.max(np.abs(buf)) + 1e-9))
print("rms dBFS", 20 * np.log10(np.sqrt(np.mean(buf**2)) + 1e-9))
