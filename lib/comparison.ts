export type ComparisonItem = {
    slug: string;
    name: string;
    category: string;
};
export function toggleComparison(items: ComparisonItem[], item: ComparisonItem): {
    items: ComparisonItem[];
    error?: string;
} {
    if (items.some(selected => selected.slug === item.slug))
        return { items: items.filter(selected => selected.slug !== item.slug) };
    if (items.length >= 4)
        return { items, error: 'You can compare up to four products.' };
    if (items[0] && items[0].category !== item.category)
        return { items, error: 'Choose products from the same category.' };
    return { items: [...items, item] };
}
export function restoreComparison(value: unknown): ComparisonItem[] {
    if (!Array.isArray(value))
        return [];
    const valid = value.filter((item): item is ComparisonItem => !!item && typeof item.slug === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug)
        && typeof item.name === 'string' && typeof item.category === 'string');
    return valid.reduce<ComparisonItem[]>((items, item) => {
        if (items.some(selected => selected.slug === item.slug))
            return items;
        return toggleComparison(items, item).items;
    }, []);
}
