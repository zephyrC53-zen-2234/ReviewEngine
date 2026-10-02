import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bayesian, trendScore } from '../lib/ranking';
test('an established strong product outranks two perfect ratings', () => {
    assert.ok(bayesian(4.7, 1000) > bayesian(5, 2));
});
test('unrated products start at the prior rather than a perfect score', () => {
    assert.equal(bayesian(0, 0), 3.5);
    assert.ok(bayesian(5, 100000) < 5);
});
test('trending rewards fresh activity and week-over-week growth', () => {
    assert.ok(trendScore(20, 5, 4, 30) > trendScore(20, 20, 4, 30));
    assert.ok(trendScore(10, 10, 2, 10) > trendScore(0, 10, 0, 0));
    assert.equal(trendScore(0, 0, 0, 0), 0);
});
