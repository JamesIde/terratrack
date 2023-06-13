export function convertTitleToSlug(title: string) {
  const lowercaseTitle = title.toLowerCase();
  if (lowercaseTitle.includes(" ")) {
    const slug = lowercaseTitle.replace(/\s+/g, "-");
    return slug;
  }
  return lowercaseTitle;
}
