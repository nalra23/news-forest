async function sha256Hex(input: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(input)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function getCanvasSignature(): string {
  try {
    const canvas = document.createElement('canvas')
    canvas.width = 200
    canvas.height = 50
    const ctx = canvas.getContext('2d')
    if (!ctx) return 'no-canvas'
    ctx.textBaseline = 'top'
    // 웹폰트 비동기 로드로 인한 fingerprint 불안정 방지 — 빌트인 monospace만 사용
    ctx.font = '14px monospace'
    ctx.fillStyle = '#2F855A'
    ctx.fillText('🌱 News Forest fingerprint', 2, 2)
    return canvas.toDataURL().slice(-80)
  } catch {
    return 'canvas-blocked'
  }
}

/**
 * UC-01 §4.4 — FE에서 device fingerprint 수집.
 * Note: 실제 BE 통합 시 server-side salt + 재해시 됨. 이 함수의 출력은 raw가 아니라
 * 이미 SHA-256 해시이므로 localStorage에 저장해도 안전한 형태.
 * (CLAUDE.md §9 — raw fingerprint는 메모리에서만 사용)
 */
export async function generateFingerprintHash(): Promise<string> {
  const parts = [
    getCanvasSignature(),
    navigator.userAgent,
    `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}`,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    navigator.language,
    String(navigator.hardwareConcurrency ?? 0),
  ]
  return sha256Hex(parts.join('|'))
}
