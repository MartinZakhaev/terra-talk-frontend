export function timeAgo(timestamp: string | Date): string {
  const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp;
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 30) {
    return "just now";
  } else if (seconds < 60) {
    return `${seconds} seconds ago`;
  } else if (minutes === 1) {
    return "a minute ago";
  } else if (minutes < 60) {
    return `${minutes} minutes ago`;
  } else if (hours === 1) {
    return "an hour ago";
  } else if (hours < 24) {
    return `${hours} hours ago`;
  } else if (days === 1) {
    return "yesterday";
  } else if (days < 7) {
    return `${days} days ago`;
  } else if (weeks === 1) {
    return "a week ago";
  } else if (weeks < 4) {
    return `${weeks} weeks ago`;
  } else if (months === 1) {
    return "a month ago";
  } else if (months < 12) {
    return `${months} months ago`;
  } else if (years === 1) {
    return "a year ago";
  } else {
    return `${years} years ago`;
  }
}

// Optional: Add a function to format absolute date if needed
export function formatDateTime(timestamp: string | Date): string {
  const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp;

  return date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Optional: Add a function that combines both relative and absolute time
export function formatMessageTime(timestamp: string | Date) {
  const relative = timeAgo(timestamp);
  const absolute = formatDateTime(timestamp);

  return {
    relative,
    absolute,
    toString: () => relative,
  };
}
