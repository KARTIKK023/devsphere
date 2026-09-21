export type SessionDevice = {
  browser: string;
  os: string;
  deviceType: "desktop" | "mobile" | "tablet";
};

export type DeviceInfo = SessionDevice;

function detectDeviceType(ua: string): SessionDevice["deviceType"] {
  if (/tablet|ipad|playbook|silk/i.test(ua)) {
    return "tablet";
  }

  if (
    /android|mobi|ip(hone|od)|blackberry|kindle|opera mini|iemobile/i.test(
      ua
    )
  ) {
    return "mobile";
  }

  return "desktop";
}

function detectOs(ua: string): string {
  if (/windows/i.test(ua)) {
    return "Windows";
  }

  if (/android/i.test(ua)) {
    return "Android";
  }

  if (/iphone|ipad|ipod/i.test(ua)) {
    return "iOS";
  }

  if (/mac os x|macintosh/i.test(ua)) {
    return "macOS";
  }

  if (/linux/i.test(ua)) {
    return "Linux";
  }

  if (/cros|chrome os/i.test(ua)) {
    return "ChromeOS";
  }

  return "Unknown OS";
}

function detectBrowser(ua: string): string {
  if (/edg\//i.test(ua)) {
    return "Edge";
  }

  if (/opr\/|opera/i.test(ua)) {
    return "Opera";
  }

  if (/firefox|fxios/i.test(ua)) {
    return "Firefox";
  }

  if (
    /samsungbrowser|samsung browser/i.test(ua)
  ) {
    return "Samsung Internet";
  }

  if (/chromium|chrome|crkey|headlesschrome/i.test(ua)) {
    return "Chrome";
  }

  if (/safari/i.test(ua)) {
    return "Safari";
  }

  return "Unknown browser";
}

export function getDeviceInfo(
  userAgent: string | undefined | null
): SessionDevice {
  const ua = userAgent ?? "";

  return {
    browser: detectBrowser(ua),
    os: detectOs(ua),
    deviceType: detectDeviceType(ua),
  };
}