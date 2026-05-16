from PIL import Image
import os

# 转换KAKEN PDF为PNG
try:
    from pdf2image import convert_from_path
    pages = convert_from_path('/Users/maxiaoha/Desktop/NANJING FREEMAN/认证证书/JAPAN KAKEN TEST/2021检测报告/kaken2021检测报告.pdf', dpi=200)
    pages[0].save('/Users/maxiaoha/Desktop/NANJING FREEMAN/website/images/certificates/kaken-cert.png', 'PNG')
    print('KAKEN PDF converted successfully')
except ImportError:
    print('pdf2image not available, trying PyMuPDF')
    try:
        import fitz
        doc = fitz.open('/Users/maxiaoha/Desktop/NANJING FREEMAN/认证证书/JAPAN KAKEN TEST/2021检测报告/kaken2021检测报告.pdf')
        page = doc[0]
        pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))
        pix.save('/Users/maxiaoha/Desktop/NANJING FREEMAN/website/images/certificates/kaken-cert.png')
        print('KAKEN PDF converted with PyMuPDF')
    except ImportError:
        print('PyMuPDF not available either')
