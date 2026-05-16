from PIL import Image
import os

# 压缩KAKEN证书
img1 = Image.open('images/certificates/kaken-cert.png')
if img1.mode == 'RGBA':
    img1 = img1.convert('RGB')
# 等比例缩放至最大宽度1200
ratio = 1200 / img1.width
new_size = (1200, int(img1.height * ratio))
img1_resized = img1.resize(new_size, Image.LANCZOS)
img1_resized.save('images/certificates/kaken-cert.jpg', quality=80, optimize=True)
print(f'KAKEN JPG size: {os.path.getsize("images/certificates/kaken-cert.jpg") / 1024:.1f} KB')

# 压缩医疗器械注册证
img2 = Image.open('images/certificates/medical-device-reg.png')
if img2.mode == 'RGBA':
    img2 = img2.convert('RGB')
ratio2 = 1000 / img2.width
new_size2 = (1000, int(img2.height * ratio2))
img2_resized = img2.resize(new_size2, Image.LANCZOS)
img2_resized.save('images/certificates/medical-device-reg.jpg', quality=80, optimize=True)
print(f'Medical device JPG size: {os.path.getsize("images/certificates/medical-device-reg.jpg") / 1024:.1f} KB')
