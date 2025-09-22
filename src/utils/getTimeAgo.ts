export function getTimeAgo(dateString: string): string {
  if (!dateString || typeof dateString !== "string") return "N/A";

  try {
    // Handle ISO strings or any format that Date can parse reliably first
    // e.g., 2025-08-29T09:28:31.920Z or 2025-08-29T09:28:31
    if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(dateString)) {
      const iso = new Date(dateString);
      if (!Number.isNaN(iso.getTime())) {
        return formatFromDate(iso);
      }
    }

    const parts = dateString.trim().split(",");
    if (parts.length !== 2) {
      // Last resort: try native Date parser
      const native = new Date(dateString);
      if (!Number.isNaN(native.getTime())) return formatFromDate(native);
      return "N/A";
    }

    const datePart = parts[0].trim();
    const timePart = parts[1].trim();

    const [a, b, yRaw] = datePart.split("/").map((s) => Number(s.trim()));
    if (!a || !b || !yRaw) return "N/A";
    const y = yRaw < 100 ? yRaw + 2000 : yRaw;

    const t = to24HourParts(timePart);
    if (!t) return "N/A";

    // Try MM/DD first when unambiguous, otherwise try both and pick the past one
    const makeDate = (mm: number, dd: number) => new Date(y, mm - 1, dd, t.h, t.m, t.s || 0);
    const now = new Date();

    let candidates: Date[] = [];
    if (a > 12 && b <= 31) {
      // Definitely DD/MM/YYYY
      candidates = [makeDate(b, a)];
    } else if (b > 12 && a <= 12) {
      // Definitely MM/DD/YYYY
      candidates = [makeDate(a, b)];
    } else {
      // Ambiguous: try both
      candidates = [makeDate(a, b), makeDate(b, a)];
    }

    // Select the candidate that is not in the far future; prefer the one in the past
    let parsedDate = candidates[0];
    for (const d of candidates) {
      if (now.getTime() - d.getTime() >= 0) {
        parsedDate = d;
        break;
      }
    }

    return formatFromDate(parsedDate);
  } catch {
    return "N/A";
  }
}


function to24HourParts(input: string): { h: number; m: number; s: number } | null {
  if (!input) return null;
  const s = input.replace(/\s+/g, " ").trim().toUpperCase();

  // Match hh:mm[:ss] + AM/PM
  const m = s.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)\b/);
  if (!m) return null;

  let h = Number(m[1]);
  const min = Number(m[2]);
  const sec = m[3] ? Number(m[3]) : 0;
  const mer = m[4];

  if ([h, min, sec].some(Number.isNaN) || min > 59 || sec > 59 || h < 1 || h > 12) return null;
  if (mer === "PM" && h !== 12) h += 12;
  if (mer === "AM" && h === 12) h = 0;

  return { h, m: min, s: sec };
}

// Shared formatter used by all branches once we have a Date
function formatFromDate(parsedDate: Date): string {
  const now = new Date();
  let diffMs = now.getTime() - parsedDate.getTime();
  if (diffMs < 0) diffMs = 0;

  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffMonth / 12);

  if (diffSec < 3600) return "Added now";
  if (diffHr < 24) return `Added ${diffHr} hour${diffHr === 1 ? "" : "s"} ago`;
  if (diffDay < 30) return `Added ${diffDay === 1 ? "a" : diffDay} day${diffDay === 1 ? "" : "s"} ago`;
  if (diffMonth < 12) return `Added ${diffMonth} month${diffMonth === 1 ? "" : "s"} ago`;
  return `Added ${diffYear} year${diffYear === 1 ? "" : "s"} ago`;
}
