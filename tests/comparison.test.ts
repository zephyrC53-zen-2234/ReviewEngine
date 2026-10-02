import { test } from 'node:test';
import assert from 'node:assert/strict';
import { restoreComparison, toggleComparison } from '../lib/comparison';
const product = (slug: string, category = 'AI') => ({ slug, name: slug, category });
test('comparison limits selections to four compatible products', () => {
    const items = ['one', 'two', 'three', 'four'].map(slug => product(slug));
    assert.equal(toggleComparison(items, product('five')).items.length, 4);
    assert.ok(toggleComparison(items, product('five')).error);
    assert.ok(toggleComparison([product('one')], product('music', 'Music')).error);
    assert.equal(toggleComparison(items, product('one')).items.length, 3);
});
test('comparison restoration discards malformed, duplicated, and incompatible items', () => {
    assert.deepEqual(restoreComparison({}), []);
    assert.deepEqual(restoreComparison([null, product('one'), product('one'), product('spotify', 'Music'), { slug: '../../admin' }, product('two')]), [product('one'), product('two')]);
});
