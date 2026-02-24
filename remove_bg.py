import sys
from PIL import Image

def remove_white_bg(in_path, out_path, tolerance=40):
    img = Image.open(in_path).convert("RGBA")
    data = img.getdata()
    new_data = []
    for item in data:
        dist = max(255 - item[0], 255 - item[1], 255 - item[2])
        if dist < tolerance:
            alpha = int((dist / tolerance) * 255)
            new_data.append((item[0], item[1], item[2], alpha))
        else:
            new_data.append(item)
    img.putdata(new_data)
    img.save(out_path, "PNG")

if __name__ == "__main__":
    if len(sys.argv) == 3:
        remove_white_bg(sys.argv[1], sys.argv[2])
    else:
        print("Usage: python remove_bg.py input output")
