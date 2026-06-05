export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function pick<T>(arr: T[], not?: T): T {
  if (arr.length === 0) throw new Error("pick from empty array");
  let choice = arr[Math.floor(Math.random() * arr.length)];
  let guard = 0;
  while (not !== undefined && choice === not && arr.length > 1 && guard < 20) {
    choice = arr[Math.floor(Math.random() * arr.length)];
    guard++;
  }
  return choice;
}
