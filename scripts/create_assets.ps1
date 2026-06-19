Add-Type -AssemblyName System.Drawing

$assetsDir = Join-Path $PSScriptRoot "..\assets"

# Create icon (1024x1024)
$bmp = New-Object System.Drawing.Bitmap(1024,1024)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.Clear([System.Drawing.Color]::FromArgb(45,90,120))
$font = New-Object System.Drawing.Font('Arial',300,[System.Drawing.FontStyle]::Bold)
$sf = New-Object System.Drawing.StringFormat
$sf.Alignment = [System.Drawing.StringAlignment]::Center
$sf.LineAlignment = [System.Drawing.StringAlignment]::Center
$rect = New-Object System.Drawing.RectangleF(0,0,1024,1024)
$g.DrawString('M',$font,[System.Drawing.Brushes]::White,$rect,$sf)
$bmp.Save((Join-Path $assetsDir "icon.png"),[System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Save((Join-Path $assetsDir "adaptive-icon.png"),[System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bmp.Dispose()

# Create favicon (48x48)
$fav = New-Object System.Drawing.Bitmap(48,48)
$gf = [System.Drawing.Graphics]::FromImage($fav)
$gf.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$gf.Clear([System.Drawing.Color]::FromArgb(45,90,120))
$fontFav = New-Object System.Drawing.Font('Arial',20,[System.Drawing.FontStyle]::Bold)
$rectFav = New-Object System.Drawing.RectangleF(0,0,48,48)
$gf.DrawString('M',$fontFav,[System.Drawing.Brushes]::White,$rectFav,$sf)
$fav.Save((Join-Path $assetsDir "favicon.png"),[System.Drawing.Imaging.ImageFormat]::Png)
$gf.Dispose()
$fav.Dispose()

# Create splash (1284x2778)
$splash = New-Object System.Drawing.Bitmap(1284,2778)
$gs = [System.Drawing.Graphics]::FromImage($splash)
$gs.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$gs.Clear([System.Drawing.Color]::FromArgb(45,90,120))
$fontSplash = New-Object System.Drawing.Font('Arial',150,[System.Drawing.FontStyle]::Bold)
$rectSplash = New-Object System.Drawing.RectangleF(0,0,1284,2778)
$gs.DrawString('Maqra',$fontSplash,[System.Drawing.Brushes]::White,$rectSplash,$sf)
$splash.Save((Join-Path $assetsDir "splash.png"),[System.Drawing.Imaging.ImageFormat]::Png)
$gs.Dispose()
$splash.Dispose()

$sf.Dispose()
$font.Dispose()
$fontFav.Dispose()
$fontSplash.Dispose()

Write-Host "Assets created successfully!"
