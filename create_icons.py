#!/usr/bin/env python3
"""アイコン生成スクリプト"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(size):
    """指定されたサイズのアイコンを作成"""
    # 黒背景のイメージ作成
    img = Image.new('RGB', (size, size), color='black')
    draw = ImageDraw.Draw(img)

    # 緑色の枠線
    border_width = max(2, size // 20)
    draw.rectangle(
        [(border_width, border_width), (size - border_width, size - border_width)],
        outline='#00FF00',
        width=border_width
    )

    # 中央に「</>」のようなハッキングシンボルを描画
    font_size = size // 3
    try:
        # システムフォントを試みる
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf", font_size)
    except:
        # フォントが見つからない場合はデフォルトを使用
        font = ImageFont.load_default()

    # テキストを描画
    text = "</>"

    # テキストの位置を計算（中央揃え）
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]

    x = (size - text_width) // 2
    y = (size - text_height) // 2

    # テキストを緑色で描画
    draw.text((x, y), text, fill='#00FF00', font=font)

    # グローエフェクト風に少しぼかす
    from PIL import ImageFilter
    img = img.filter(ImageFilter.GaussianBlur(radius=0.5))

    return img

def main():
    """メイン処理"""
    # アイコンディレクトリの作成
    icon_dir = 'assets/icons'
    os.makedirs(icon_dir, exist_ok=True)

    # 各サイズのアイコンを生成
    sizes = [16, 48, 128]
    for size in sizes:
        icon = create_icon(size)
        icon.save(f'{icon_dir}/icon{size}.png')
        print(f'Created icon{size}.png')

    print('All icons created successfully!')

if __name__ == '__main__':
    main()
