﻿param(
    [string]$OutFile = "$PSScriptRoot\..\assets\screenshots\launcher-home.png"
)

Add-Type -AssemblyName System.Drawing
Add-Type @"
using System;
using System.Runtime.InteropServices;
public class Win32Cap {
    [DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr hWnd, out RECT rect);
    [DllImport("user32.dll")] public static extern bool SetProcessDPIAware();
    [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
    [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr hWnd);
    [DllImport("user32.dll")] public static extern bool GetClientRect(IntPtr hWnd, out RECT rect);
    [DllImport("user32.dll")] public static extern bool SetCursorPos(int x, int y);
    [DllImport("user32.dll")] public static extern void mouse_event(uint dwFlags, uint dx, uint dy, uint dwData, UIntPtr dwExtraInfo);
    [DllImport("gdi32.dll")] public static extern bool BitBlt(IntPtr hdcDest, int x, int y, int w, int h, IntPtr hdcSrc, int x1, int y1, int rop);
    [DllImport("user32.dll")] public static extern IntPtr GetDC(IntPtr hWnd);
    [DllImport("user32.dll")] public static extern int ReleaseDC(IntPtr hWnd, IntPtr hDC);
    [StructLayout(LayoutKind.Sequential)] public struct RECT { public int Left, Top, Right, Bottom; }
}
"@

[Win32Cap]::SetProcessDPIAware() | Out-Null

# Launch the launcher (fat jar with JavaFX)
$fx = 'C:\Users\USER\.m2\repository\org\openjfx'
$mp = "$fx\javafx-base\21.0.6\javafx-base-21.0.6-win.jar;$fx\javafx-controls\21.0.6\javafx-controls-21.0.6-win.jar;$fx\javafx-fxml\21.0.6\javafx-fxml-21.0.6-win.jar;$fx\javafx-graphics\21.0.6\javafx-graphics-21.0.6-win.jar"
$java = 'C:\Users\USER\.jdk\java-25\jdk-25.0.2\bin\java.exe'
$jar = 'C:\Users\USER\Desktop\moddownloader\target\moddownloader-0.1.0-SNAPSHOT.jar'
$proc = Start-Process $java -ArgumentList '--enable-native-access=javafx.graphics','--module-path',$mp,'--add-modules','javafx.controls,javafx.fxml','-cp',$jar,'com.moddownloader.launcher.App' -PassThru

# Poll for the window
$hwnd = [IntPtr]::Zero
foreach ($i in 1..60) {
    Start-Sleep -Milliseconds 500
    $proc.Refresh()
    if ($proc.HasExited) { throw "Launcher exited early (code $($proc.ExitCode))" }
    if ($proc.MainWindowHandle -ne [IntPtr]::Zero) { $hwnd = $proc.MainWindowHandle; break }
}
if ($hwnd -eq [IntPtr]::Zero) { throw "No window appeared" }

# Let the UI finish loading, then capture
Start-Sleep -Seconds 6
[Win32Cap]::ShowWindow($hwnd, 3) | Out-Null   # SW_MAXIMIZE
Start-Sleep -Milliseconds 500
[Win32Cap]::SetForegroundWindow($hwnd) | Out-Null
Start-Sleep -Seconds 3

$proc.Refresh()
if ($proc.MainWindowHandle -eq [IntPtr]::Zero) { throw "Window closed before capture" }
$rect = New-Object Win32Cap+RECT
[Win32Cap]::GetClientRect($hwnd, [ref]$rect) | Out-Null
$winRect = New-Object Win32Cap+RECT
[Win32Cap]::GetWindowRect($hwnd, [ref]$winRect) | Out-Null
# Client-area origin inside the window (centered horizontally, below the title bar)
$offX = $winRect.Left + [int]((($winRect.Right - $winRect.Left) - $rect.Right) / 2)
$offY = $winRect.Bottom - $rect.Bottom
$w = $rect.Right; $h = $rect.Bottom
if ($w -le 0 -or $h -le 0) { throw "Window has no size" }

function Capture([string]$Path) {
    $screenDc = [Win32Cap]::GetDC([IntPtr]::Zero)
    $bmp = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $hdc = $g.GetHdc()
    [Win32Cap]::BitBlt($hdc, 0, 0, $w, $h, $screenDc, $offX, $offY, 0x00CC0020) | Out-Null  # SRCCOPY
    $g.ReleaseHdc($hdc)
    $dir = Split-Path $Path -Parent
    if (!(Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
    $bmp.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose()
    [Win32Cap]::ReleaseDC([IntPtr]::Zero, $screenDc) | Out-Null
    Write-Output "Saved $Path (${w}x${h})"
}

function ClickAt([int]$cx, [int]$cy) {
    [Win32Cap]::SetCursorPos($offX + $cx, $offY + $cy) | Out-Null
    Start-Sleep -Milliseconds 150
    [Win32Cap]::mouse_event(2, 0, 0, 0, [UIntPtr]::Zero)   # LEFTDOWN
    [Win32Cap]::mouse_event(4, 0, 0, 0, [UIntPtr]::Zero)   # LEFTUP
}

# Sidebar nav item client-space Y centers (client is ${w}x${h} = 1920x1166)
$pages = @(
    @{ name = 'home';       y = 263 },
    @{ name = 'instances';  y = 327 },
    @{ name = 'mods';       y = 389 },
    @{ name = 'marketplace'; y = 453 },
    @{ name = 'settings';   y = 687 }
)
$dir = Split-Path $OutFile -Parent
foreach ($p in $pages) {
    $target = Join-Path $dir ("launcher-" + $p.name + ".png")
    if ($p.name -ne 'home') {
        ClickAt 170 $p.y
        Start-Sleep -Seconds 2
    }
    Capture $target
}



