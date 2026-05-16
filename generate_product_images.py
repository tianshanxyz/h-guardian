#!/usr/bin/env python3
"""Generate placeholder product images for medical mask website."""

from PIL import Image, ImageDraw, ImageFont
import os

OUTPUT_DIR = "/Users/maxiaoha/Desktop/NANJING FREEMAN/website/images/products"

def create_gradient(width, height, color1, color2, direction="vertical"):
    """Create a gradient background."""
    img = Image.new("RGB", (width, height))
    draw = ImageDraw.Draw(img)
    for i in range(height if direction == "vertical" else width):
        ratio = i / (height if direction == "vertical" else width)
        r = int(color1[0] * (1 - ratio) + color2[0] * ratio)
        g = int(color1[1] * (1 - ratio) + color2[1] * ratio)
        b = int(color1[2] * (1 - ratio) + color2[2] * ratio)
        if direction == "vertical":
            draw.line([(0, i), (width, i)], fill=(r, g, b))
        else:
            draw.line([(i, 0), (i, height)], fill=(r, g, b))
    return img

def draw_rounded_rect(draw, xy, radius, fill, outline=None, width=1):
    """Draw a rounded rectangle."""
    x1, y1, x2, y2 = xy
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=width)

def draw_mask_shape(draw, cx, cy, w, h, color, detail_color):
    """Draw a stylized medical mask shape."""
    # Main mask body (rounded rectangle)
    x1, y1 = cx - w//2, cy - h//2
    x2, y2 = cx + w//2, cy + h//2
    draw.rounded_rectangle([x1, y1, x2, y2], radius=h//4, fill=color, outline=detail_color, width=2)
    # Fold lines
    draw.line([(cx, y1+5), (cx, y2-5)], fill=detail_color, width=1)
    draw.line([(cx - w//4, y1+8), (cx - w//4, y2-8)], fill=detail_color, width=1)
    draw.line([(cx + w//4, y1+8), (cx + w//4, y2-8)], fill=detail_color, width=1)
    # Ear loops
    loop_color = detail_color
    # Left loop
    draw.arc([x1 - w//6, cy - h//3, x1 + w//12, cy + h//3], start=90, end=270, fill=loop_color, width=2)
    # Right loop
    draw.arc([x2 - w//12, cy - h//3, x2 + w//6, cy + h//3], start=-90, end=90, fill=loop_color, width=2)

def draw_carbon_mask(draw, cx, cy, w, h, color, detail_color, filter_color):
    """Draw a stylized carbon/industrial mask shape."""
    # Main mask body - more angular for industrial look
    x1, y1 = cx - w//2, cy - h//2
    x2, y2 = cx + w//2, cy + h//2
    draw.rounded_rectangle([x1, y1, x2, y2], radius=8, fill=color, outline=detail_color, width=3)
    # Valve circles
    valve_r = h // 6
    draw.ellipse([cx - valve_r - w//5, cy - valve_r, cx - valve_r//2 - w//5, cy + valve_r], fill=(60, 60, 60), outline=(30, 30, 30), width=2)
    draw.ellipse([cx + w//5, cy - valve_r, cx + valve_r + w//5, cy + valve_r], fill=(60, 60, 60), outline=(30, 30, 30), width=2)
    # Carbon filter layer indication
    draw.rectangle([x1 + 8, y1 + 8, x2 - 8, y1 + 18], fill=filter_color, outline=detail_color, width=1)
    draw.rectangle([x1 + 8, y2 - 18, x2 - 8, y2 - 8], fill=filter_color, outline=detail_color, width=1)
    # Head straps
    draw.line([(x1, cy - h//4), (x1 - w//4, cy - h//2 - 10)], fill=(80, 80, 80), width=3)
    draw.line([(x2, cy - h//4), (x2 + w//4, cy - h//2 - 10)], fill=(80, 80, 80), width=3)
    draw.line([(x1, cy + h//4), (x1 - w//4, cy + h//2 + 10)], fill=(80, 80, 80), width=3)
    draw.line([(x2, cy + h//4), (x2 + w//4, cy + h//2 + 10)], fill=(80, 80, 80), width=3)

def draw_texture_pattern(draw, width, height, base_color, line_color):
    """Draw a fabric texture pattern."""
    for y in range(0, height, 4):
        draw.line([(0, y), (width, y)], fill=line_color, width=1)
    for x in range(0, width, 6):
        draw.line([(x, 0), (x, height)], fill=line_color, width=1)

def draw_carbon_texture(draw, width, height):
    """Draw a carbon filter texture."""
    for y in range(0, height, 3):
        for x in range(0, width, 3):
            if (x + y) % 6 == 0:
                draw.point((x, y), fill=(40, 40, 40))
            elif (x + y) % 6 == 3:
                draw.point((x, y), fill=(80, 80, 80))

def draw_packaging(draw, cx, cy, w, h, primary_color, accent_color, text_lines):
    """Draw a packaging box mockup."""
    x1, y1 = cx - w//2, cy - h//2
    x2, y2 = cx + w//2, cy + h//2
    # Box body
    draw.rounded_rectangle([x1, y1, x2, y2], radius=6, fill=(250, 250, 250), outline=(200, 200, 200), width=2)
    # Top accent strip
    draw.rectangle([x1 + 2, y1 + 2, x2 - 2, y1 + 30], fill=primary_color)
    # Content area lines
    line_y = y1 + 50
    for line in text_lines:
        draw.text((cx, line_y), line, fill=(80, 80, 80), anchor="mm")
        line_y += 22
    # Bottom accent
    draw.rectangle([x1 + 2, y2 - 20, x2 - 2, y2 - 2], fill=accent_color)

def get_font(size):
    """Try to get a font, fallback to default."""
    try:
        return ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", size)
    except:
        try:
            return ImageFont.truetype("/System/Library/Fonts/Arial.ttf", size)
        except:
            return ImageFont.load_default()

def create_aesthetic_mask_1():
    """Soft purple/lavender gradient with elegant medical mask."""
    img = create_gradient(600, 450, (230, 220, 245), (200, 180, 230), "vertical")
    draw = ImageDraw.Draw(img)
    # Decorative circles
    draw.ellipse([20, 20, 120, 120], outline=(255, 255, 255, 100), width=2)
    draw.ellipse([480, 320, 580, 420], outline=(255, 255, 255, 100), width=2)
    # Mask
    draw_mask_shape(draw, 300, 220, 200, 120, (255, 255, 255), (180, 160, 210))
    # Text
    font = get_font(28)
    draw.text((300, 360), "Aesthetic Series", fill=(120, 100, 150), anchor="mm", font=font)
    font_small = get_font(16)
    draw.text((300, 390), "Soft & Gentle Protection", fill=(150, 130, 180), anchor="mm", font=font_small)
    return img

def create_aesthetic_mask_2():
    """Close-up of soft mask material texture."""
    img = Image.new("RGB", (600, 450), (245, 240, 250))
    draw = ImageDraw.Draw(img)
    draw_texture_pattern(draw, 600, 450, (245, 240, 250), (225, 215, 235))
    # Central fabric swatch
    draw.rounded_rectangle([150, 100, 450, 350], radius=10, fill=(255, 255, 255), outline=(200, 185, 220), width=3)
    # Texture detail lines on swatch
    for y in range(120, 330, 8):
        draw.line([(170, y), (430, y)], fill=(240, 235, 245), width=2)
    for x in range(170, 430, 10):
        draw.line([(x, 120), (x, 330)], fill=(240, 235, 245), width=1)
    # Highlight
    draw.line([(160, 110), (440, 110)], fill=(255, 255, 255), width=3)
    font = get_font(24)
    draw.text((300, 390), "Premium Soft Material", fill=(130, 110, 160), anchor="mm", font=font)
    return img

def create_aesthetic_mask_3():
    """Elegant packaging mockup for aesthetic mask."""
    img = create_gradient(600, 450, (240, 235, 250), (220, 210, 240), "vertical")
    draw = ImageDraw.Draw(img)
    draw_packaging(draw, 300, 220, 260, 280, (200, 180, 230), (180, 160, 210),
                   ["AESTHETIC MASK", "50 PCS | 3-PLY", "Soft & Comfortable"])
    font = get_font(22)
    draw.text((300, 390), "Elegant Packaging", fill=(120, 100, 150), anchor="mm", font=font)
    return img

def create_aesthetic_mask_4():
    """Mask on model/mannequin showing gentle fit."""
    img = create_gradient(600, 450, (235, 228, 245), (210, 200, 230), "vertical")
    draw = ImageDraw.Draw(img)
    # Stylized face silhouette
    face_color = (255, 248, 250)
    draw.ellipse([220, 80, 380, 340], fill=face_color, outline=(230, 220, 240), width=2)
    # Mask on face
    draw_mask_shape(draw, 300, 220, 180, 100, (255, 255, 255), (200, 185, 220))
    # Neck
    draw.polygon([(250, 320), (350, 320), (380, 450), (220, 450)], fill=face_color, outline=(230, 220, 240), width=2)
    font = get_font(22)
    draw.text((300, 400), "Gentle, Comfortable Fit", fill=(120, 100, 150), anchor="mm", font=font)
    return img

def create_carbon_mask_1():
    """Dark/charcoal gradient with industrial mask."""
    img = create_gradient(600, 450, (45, 45, 50), (25, 25, 30), "vertical")
    draw = ImageDraw.Draw(img)
    # Accent lines
    draw.line([(0, 50), (600, 50)], fill=(60, 60, 70), width=2)
    draw.line([(0, 400), (600, 400)], fill=(60, 60, 70), width=2)
    # Industrial mask
    draw_carbon_mask(draw, 300, 220, 220, 140, (55, 55, 60), (80, 80, 90), (35, 35, 40))
    font = get_font(28)
    draw.text((300, 360), "Carbon Filter Series", fill=(180, 180, 190), anchor="mm", font=font)
    font_small = get_font(16)
    draw.text((300, 390), "Industrial Grade Protection", fill=(140, 140, 150), anchor="mm", font=font_small)
    return img

def create_carbon_mask_2():
    """Close-up showing carbon filter layer texture."""
    img = Image.new("RGB", (600, 450), (35, 35, 40))
    draw = ImageDraw.Draw(img)
    draw_carbon_texture(draw, 600, 450)
    # Central filter layer detail
    draw.rounded_rectangle([150, 100, 450, 350], radius=8, fill=(45, 45, 50), outline=(70, 70, 80), width=3)
    # Honeycomb/activated carbon pattern
    for y in range(120, 330, 20):
        for x in range(170, 430, 20):
            draw.ellipse([x-6, y-6, x+6, y+6], fill=(30, 30, 35), outline=(60, 60, 70), width=1)
    font = get_font(24)
    draw.text((300, 390), "Activated Carbon Layer", fill=(160, 160, 170), anchor="mm", font=font)
    return img

def create_carbon_mask_3():
    """Industrial packaging mockup."""
    img = create_gradient(600, 450, (40, 40, 45), (30, 30, 35), "vertical")
    draw = ImageDraw.Draw(img)
    draw_packaging(draw, 300, 220, 260, 280, (60, 60, 70), (45, 45, 55),
                   ["CARBON MASK", "20 PCS | FFP2/N95", "Industrial Protection"])
    font = get_font(22)
    draw.text((300, 390), "Industrial Packaging", fill=(160, 160, 170), anchor="mm", font=font)
    return img

def create_carbon_mask_4():
    """Mask in industrial/workplace setting."""
    img = create_gradient(600, 450, (50, 50, 55), (30, 30, 35), "vertical")
    draw = ImageDraw.Draw(img)
    # Stylized industrial background elements
    draw.rectangle([0, 350, 600, 450], fill=(40, 40, 45))  # floor
    draw.rectangle([50, 100, 120, 350], fill=(55, 55, 60), outline=(70, 70, 80), width=2)  # pillar
    draw.rectangle([480, 100, 550, 350], fill=(55, 55, 60), outline=(70, 70, 80), width=2)  # pillar
    # Worker silhouette
    draw.ellipse([260, 120, 340, 220], fill=(80, 80, 85), outline=(100, 100, 110), width=2)  # head
    draw.rectangle([270, 220, 330, 360], fill=(70, 70, 75), outline=(90, 90, 100), width=2)  # body
    # Mask on worker
    draw_carbon_mask(draw, 300, 180, 100, 60, (55, 55, 60), (80, 80, 90), (35, 35, 40))
    font = get_font(22)
    draw.text((300, 400), "Workplace Ready", fill=(160, 160, 170), anchor="mm", font=font)
    return img

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    images = [
        ("aesthetic-mask-1.jpg", create_aesthetic_mask_1),
        ("aesthetic-mask-2.jpg", create_aesthetic_mask_2),
        ("aesthetic-mask-3.jpg", create_aesthetic_mask_3),
        ("aesthetic-mask-4.jpg", create_aesthetic_mask_4),
        ("carbon-mask-1.jpg", create_carbon_mask_1),
        ("carbon-mask-2.jpg", create_carbon_mask_2),
        ("carbon-mask-3.jpg", create_carbon_mask_3),
        ("carbon-mask-4.jpg", create_carbon_mask_4),
    ]

    created_files = []

    for filename, func in images:
        img = func()
        path = os.path.join(OUTPUT_DIR, filename)
        img.save(path, "JPEG", quality=90)
        created_files.append(path)
        print(f"Created: {path}")

        # Create thumbnail
        thumb = img.resize((120, 90), Image.LANCZOS)
        thumb_filename = filename.replace(".jpg", "-thumb.jpg")
        # Map to thumb1, thumb2 etc.
        if "aesthetic" in filename:
            num = filename.split("-")[2].replace(".jpg", "")
            thumb_filename = f"aesthetic-mask-thumb{num}.jpg"
        else:
            num = filename.split("-")[2].replace(".jpg", "")
            thumb_filename = f"carbon-mask-thumb{num}.jpg"
        thumb_path = os.path.join(OUTPUT_DIR, thumb_filename)
        thumb.save(thumb_path, "JPEG", quality=85)
        created_files.append(thumb_path)
        print(f"Created: {thumb_path}")

    print(f"\nTotal files created: {len(created_files)}")
    return created_files

if __name__ == "__main__":
    main()
