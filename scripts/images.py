#!/usr/bin/env python3
"""
Image pipeline (dev tool) — run locally whenever photos change:

    python3 scripts/images.py

Reads originals from source-media/, writes responsive AVIF + WebP variants to
public/media/<key>/<width>.<ext> and a manifest at src/content/media.json.

To add or swap a photo: edit MEDIA below (key -> source path + alt text),
re-run the script, then reference the key from any content JSON file.
Requires Pillow with AVIF support (pip install pillow pillow-avif-plugin).
"""
import json, os, sys
from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "source-media")
OUT = os.path.join(ROOT, "public", "media")
MANIFEST = os.path.join(ROOT, "src", "content", "media.json")
WIDTHS = [480, 800, 1200, 1600, 2400]

NM = "01_NORTH_MACEDONIA/"
NO = "02_NORWAY/"
AL = "03_ALPS_WINTER/"
SU = "04_SUMMER_ADVENTURE/"
BR = "05_BROCHURE_IMAGES/"  # images extracted from Organix brochures / flyers
DR = "06_DRIVE_2025_26/"   # OrganixEvents Drive, Photo 25/26

# key: (source file, English alt text, focal point "x% y%" for object-position)
MEDIA = {
    # North Macedonia
    "nm-snowcat-ridge":  (NM + "09A967B5-2716-44A7-A615-977A19BBF548.jpeg", "The Organix snowcat parked on a snowy ridge under a deep blue sky in North Macedonia", "70% 50%"),
    "nm-panorama":       (NM + "0d5351cc-9639-48ab-a6e9-e7dd15e8a3ce.jpg", "Wide snow-covered ridges and peaks of the Šar Mountains in North Macedonia", "50% 55%"),
    "nm-cornice":        (NM + "38A878DD-04F0-4483-A18E-50254DF7464C.jpeg", "A rider standing above a snow cornice looking over endless white ridges", "60% 40%"),
    "nm-snowcat-crew":   (NM + "3c041625-6252-4e5f-aaa4-21b6ee6b469f.jpg", "A guest waving from the door of the passenger cabin on the Organix snowcat", "40% 50%"),
    "nm-snowcat-powder": (NM + "5d7d3bdb-82c1-48e8-bfd6-83505c33b4e6.jpg", "The snowcat climbing through fresh powder below rocky summits", "50% 60%"),
    "nm-ridge-group":    (NM + "963c34e0-667b-431d-a2a3-3e174204d9cb.jpg", "Three skiers on a ridge looking toward steep rocky peaks", "60% 50%"),
    "nm-sunset":         (NM + "99DF5129-AAC0-48A3-B171-2997CDC3E0D7.jpeg", "Sunset glow behind a pointed summit with ski tracks in the foreground", "50% 60%"),
    "nm-group":          (NM + "9c1be1a5-be7d-4661-b1a6-cc9c88d2aec4.jpg", "A group of skiers and snowboarders gathered on a summit plateau under dramatic clouds", "50% 70%"),
    "nm-snowcat-blue":   (NM + "FF7C8F37-F64B-48F5-9DC6-B1E468B442D6.jpeg", "The snowcat with its passenger cabin on a high plateau", "40% 60%"),
    "nm-bowl":           (NM + "IMG_5441.jpeg", "Skiers crossing a vast untracked snow bowl", "50% 60%"),
    # Norway
    "no-ferry":          (NO + "31016B90-F6B7-472C-9595-7E6F24D4C977.jpeg", "Snowy Arctic peaks seen across the sea from the deck of a boat", "70% 50%"),
    "no-sunset-skin":    (NO + "4D4A9AC5-EE99-4F37-9F8A-95704C17DF6A.jpeg", "Two ski tourers on a snowy crest facing the low Arctic sun over the sea", "55% 50%"),
    "no-deck":           (NO + "IMG_0203.JPG", "Golden light across the deck and rigging of a sailing ship in Norway", "50% 50%"),
    "no-fjord-boat":     (NO + "IMG_0204.JPG", "A sailing boat anchored in a calm fjord surrounded by snowy mountains", "60% 60%"),
    "no-schooner":       (NO + "IMG_0205.JPG", "A two-masted schooner on still water beside snow-covered shores", "35% 60%"),
    # Alps
    "al-moonlit":        (AL + "0F695090-0FB6-4DB5-B81A-CAFADA086D99.jpeg", "A groomed mountain track through frosted trees at night", "50% 50%"),
    "al-sunset-sea":     (AL + "1DEF2510-55E1-4A6D-BFD3-BDF227721EA1.jpeg", "Fiery sunset clouds over water and snowy hills", "50% 40%"),
    "al-skintrack":      (AL + "22264FC6-1F8F-422F-B0BB-1BBF46AB99B6.jpeg", "A ski tourer following a skin track up a high alpine valley", "50% 60%"),
    "al-bootpack":       (AL + "31a19bb0-533a-424b-bce6-a9a7d187ac42.JPG", "A skier bootpacking along a narrow snowy ridge with skis on the shoulder", "60% 40%"),
    "al-chalets":        (AL + "5CA49E91-C911-41DE-8738-B28C9C6D3B8F.jpeg", "Snow-buried chalets and fir trees under a clear winter sky", "40% 50%"),
    "al-backlit":        (AL + "6712977D-76E5-4EA2-AA8D-087A30EE339A.jpeg", "A skier backlit by the sun below seracs", "50% 55%"),
    "al-flat-track":     (AL + "6C6E8601-3F5B-4344-B7AE-3A3EF6635D28.jpeg", "A lone ski track leading across a wide snowy plateau at dusk", "50% 60%"),
    "al-heli":           (AL + "A7CA1145-4D77-4425-AB4F-633007F86218.jpeg", "A helicopter landed on snow ready for a heliski drop", "50% 55%"),
    "al-sunrise":        (AL + "C662B6C7-7F71-4E00-9E46-285037C60AE8.jpeg", "A hiker on rocky snow at sunrise above a sea of cloud", "40% 60%"),
    "al-two-tourers":    (AL + "D4867EB4-782F-4666-A548-2D3FE0AAC1A4.jpeg", "Two ski tourers gliding toward snowy mountains above a fjord", "50% 60%"),
    "al-ice-cave":       (AL + "D5704009-9B37-46E5-A071-166C7EFBDA2E.jpeg", "Ski tracks leading out of a glacier ice cave into daylight", "50% 55%"),
    "al-matterhorn":     (AL + "F3B65B7B-B09E-462A-8502-0026BC762A90.jpeg", "The Matterhorn above snowy slopes near Zermatt", "55% 40%"),
    # Summer
    "su-sup":            (SU + "0435AF5C-E0D2-43B8-B621-492C5A1528FD.jpeg", "A young paddler on a stand-up paddle board on a calm lake", "30% 60%"),
    "su-lake":           (SU + "372F0B43-E4E0-4628-9871-23397D6E1BE4.jpeg", "A still lake reflecting wooded hills and summer sky", "50% 50%"),
    "su-paraglide":      (SU + "752BE777-5AD8-4987-9D7E-62A347E7A5ED.jpeg", "A paraglider flying high above a large lake and mountains", "50% 40%"),
    "su-cliffs":         (SU + "77CBA6D6-6FC4-49BD-A5B5-9A54CA70724B.jpeg", "Limestone cliffs above a dense green forest", "50% 40%"),
    "su-bike":           (SU + "A969D0F5-7FC4-4B7C-983A-02C7F399F1E5.jpeg", "Mountain bikers riding a gravel track across open hills", "40% 60%"),
    "su-wake-boat":      (SU + "PHOTO-2026-07-25-16-34-50.jpeg", "A wake boat on turquoise water with riders on board", "50% 60%"),
    "su-wake-jump":      (SU + "PHOTO-2026-07-25-18-59-17.jpg", "A wakeboarder jumping high behind the boat", "55% 45%"),
    # North Macedonia — Drive 2025/26 season
    "nm-cloudsea":       (DR + "b270a488-6a99-4dda-aaa1-240a5597b903.jpg", "A small group skinning across a snow plateau toward a sea of clouds in North Macedonia", "50% 62%"),
    "nm-snowfight":      (DR + "b455ba70-0530-4f1e-a798-289beecec8a5.jpg", "Guests throwing fresh snow and laughing next to the snowcat", "50% 45%"),
    "nm-cabin-group":    (DR + "29b2f484-e813-4838-8508-a90747628f09.jpg", "A cheerful group of riders inside the snowcat passenger cabin", "45% 45%"),
    "nm-skin-line":      (DR + "86361229-c3bc-455e-a5f6-327d139d3ebc.jpg", "A line of ski tourers climbing a wide snowy slope under a blue sky", "55% 55%"),
    "nm-ridges":         (DR + "IMG_5508.JPG", "Wide snow-covered ridges and forested valleys of the Šar Mountains", "50% 55%"),
    "nm-moonrise":       (DR + "8379263e-cec1-403c-bea1-8d0324852581.jpg", "The moon rising over snowy peaks at dusk", "50% 35%"),
    "nm-forest-walk":    (DR + "25b789fc-e580-43a9-9bc1-9a5abde1be38.jpg", "A skier carrying skis along a snowy forest track", "50% 50%"),
    "nm-stone-hut":      (DR + "6d8f8022-5bfe-4fab-8c99-a7ff96d974ef.jpg", "An old stone shepherd's hut half buried in snow below a summit", "50% 60%"),
    "nm-hut":            (DR + "09a01dbc-df1a-405e-bfd0-c71805f8e09d.jpg", "A mountain hut on a snowy plateau under a deep blue sky", "50% 50%"),
    "nm-spring-tour":    (DR + "c84811dc-fb99-4536-82f0-96719782ecc9.jpg", "A ski tourer walking up a spring trail with skis on his pack", "50% 45%"),
    "nm-duo":            (DR + "97dfbdf1-2578-4ea7-a3dc-3847b324fbb7.jpg", "Two riders smiling in helmets and goggles on the mountain", "50% 45%"),
    "nm-peak":           (DR + "88a12e4a-eae2-4264-9434-4f2aa7432a3c.jpg", "A snowy summit above untracked slopes", "50% 50%"),
    "nm-valley":         (DR + "88923f26-71ae-4efb-80b3-647d649a15c3.jpg", "A pointed snowy peak above a forested valley", "50% 50%"),
    "nm-spring-duo":     (DR + "b2a62125-7087-4ecc-a73a-3f711c094a42.jpg", "Two ski tourers with skis on their packs on a sunny spring hillside", "50% 55%"),
    "mk-meadow-hut":     (DR + "925fb9f7-d760-4a5a-9d2e-76cdc5e5d675.jpg", "A wooden hut and rock spire in a mountain meadow in North Macedonia", "50% 55%"),
    "mk-valley-village": (DR + "53ef8ce9-9eb7-4646-a5ca-7186c9b1e713.jpg", "A red-roofed cabin in a mountain valley below a snowy peak", "50% 60%"),
    # North Macedonia — Organix brochure
    "nm-snowcat-team":   (BR + "mk-000.jpg", "A group of riders standing in front of the red Organix snowcat", "55% 60%"),
    "nm-open-terrain":   (BR + "mk-004.jpg", "A skier walking across vast open snowfields", "50% 55%"),
    "nm-arms-up":        (BR + "mk-006.jpg", "A rider celebrating on a sunny ridge with arms raised", "45% 50%"),
    "nm-powder-board":   (BR + "mk-007.jpg", "A snowboarder spraying powder between fir trees", "55% 55%"),
    "nm-hotel":          (BR + "mk-024.jpg", "The small family hotel with its wood-fired sauna in the snow", "50% 55%"),
    "nm-jacuzzi":        (BR + "mk-025.jpg", "Guests relaxing in the outdoor jacuzzi in the evening", "50% 50%"),
    "nm-room":           (BR + "mk-026.jpg", "A bright double room at the hotel", "50% 50%"),
    "nm-food":           (BR + "mk-029.jpg", "Macedonian dishes: burek, grilled peppers and white cheese", "50% 50%"),
    # Georgia — Organix brochure
    "ge-sunset-group":   (BR + "ge-000.jpg", "A group of riders on a ridge at sunset in the Caucasus", "65% 70%"),
    "ge-snowcat":        (BR + "ge-001.jpg", "A snowcat with passenger cabin on a snowy ridge in Georgia", "60% 55%"),
    "ge-powder":         (BR + "ge-002.jpg", "A snowboarder in deep powder above forested valleys in Georgia", "55% 55%"),
    "ge-chalet":         (BR + "ge-003.jpg", "The wooden guest house chalet in Bakhmaro", "50% 50%"),
    "ge-interior":       (BR + "ge-004.jpg", "The lounge of the guest house with a wood stove", "50% 50%"),
    "ge-snow-hut":       (BR + "ge-012.jpg", "A wooden hut buried under a huge cushion of snow", "50% 50%"),
    "ge-village":        (BR + "ge-013.jpg", "The snow-covered village of Bakhmaro among fir trees", "50% 50%"),
    "ge-snowcat-road":   (BR + "ge-014.jpg", "A snowcat climbing between snowy mountains in Georgia", "50% 55%"),
    "ge-forest-peaks":   (BR + "ge-015.jpg", "Snowy peaks above dense fir forest in the Caucasus", "50% 50%"),
    # Norway — Organix Tromsø flyer
    "no-skintrack":      (BR + "no-006.jpg", "Two ski tourers following a skin track toward a fjord and snowy peaks", "50% 55%"),
    "no-fishing":        (BR + "no-007.jpg", "A skier holding up a freshly caught fish by the Arctic sea", "50% 45%"),
    "no-lyngen-light":   (BR + "no-014.jpg", "Evening light on the jagged peaks of the Lyngen Alps", "50% 60%"),
    # Portugal — Organix wake flyer
    "pt-boat-rider":     (BR + "pt-000.jpg", "A wake boat carving the lake with a rider behind it", "50% 55%"),
    "pt-pontoon":        (BR + "pt-001.jpg", "Aerial view of the private pontoon, boats and wake gear", "50% 50%"),
    "pt-house-aerial":   (BR + "pt-002.jpg", "The lakeside house and the lake from above", "50% 50%"),
    "pt-grounds":        (BR + "pt-003.jpg", "The lake and gardens around the house", "50% 55%"),
    "pt-house":          (BR + "pt-004.jpg", "The lake house and its terrace", "50% 55%"),
    "pt-living":         (BR + "pt-005.jpg", "The open living room of the lake house", "50% 50%"),
    "pt-garden":         (BR + "pt-007.jpg", "A hammock in the garden overlooking the lake", "50% 50%"),
    "pt-dock":           (BR + "pt-008.jpg", "Two wake boats moored at the private dock", "50% 55%"),
    "pt-jump":           (BR + "pt-009.jpg", "A wakeboarder jumping high above the boat's wake", "50% 40%"),
    "pt-misty":          (BR + "pt-010.jpg", "A wake boat on the lake in soft morning mist", "50% 60%"),
}


def main():
    manifest = {}
    for key, (rel, alt, focal) in MEDIA.items():
        path = os.path.join(SRC, rel)
        if not os.path.exists(path):
            print("MISSING", key, rel, file=sys.stderr)
            continue
        im = ImageOps.exif_transpose(Image.open(path)).convert("RGB")
        w, h = im.size
        outdir = os.path.join(OUT, key)
        os.makedirs(outdir, exist_ok=True)
        widths = [x for x in WIDTHS if x < w] + [min(w, WIDTHS[-1])]
        widths = sorted(set(widths))
        for tw in widths:
            th = round(h * tw / w)
            r = im.resize((tw, th), Image.LANCZOS)
            r.save(os.path.join(outdir, f"{tw}.webp"), "WEBP", quality=74, method=6)
            r.save(os.path.join(outdir, f"{tw}.avif"), "AVIF", quality=42, speed=6)
        tiny = im.resize((1, 1), Image.LANCZOS).getpixel((0, 0))
        manifest[key] = {
            "width": w, "height": h, "widths": widths, "alt": alt,
            "focal": focal, "color": "#%02x%02x%02x" % tiny, "source": rel,
        }
        print(key, w, h, widths)
    with open(MANIFEST, "w") as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)


if __name__ == "__main__":
    main()
