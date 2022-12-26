export function cleanTags(tags: string): string[] {
    return tags.replace(/\s/g, "").replace(/,\s*$/, "").split(",");
}
